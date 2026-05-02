<template>
  <div class="game-root" :class="stageClasses">
    <div class="rust-overlay"></div>
    <div v-if="store.showRedFlash" class="red-flash"></div>

    <div
      class="fixed inset-0 z-[90] bg-black pointer-events-none transition-opacity duration-[1500ms]"
      :class="store.fadeOverlay ? 'opacity-100' : 'opacity-0'"
    ></div>

    <div class="blackout-overlay" :class="blackoutState"></div>

    <div v-if="store.stage < 5 && !isScene" class="absolute top-0 left-0 right-0 z-50 flex items-center justify-end px-4 py-2">
      <div class="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-yellow-200">
        <span class="text-yellow-600 text-lg">💰</span>
        <span class="font-bold text-gray-800">{{ store.wallet }}</span>
        <span class="text-gray-500 text-sm">阿元</span>
      </div>
    </div>

    <FactionBar v-if="store.stage >= 4 && store.stage < 5 && !isScene" />

    <div class="game-main relative w-full h-full" :class="{ 'screen-shake': screenShaking }">
      <router-view />
    </div>

    <InventoryPanel v-if="showInventory && store.stage < 5 && !isScene" @close="showInventory = false" />

    <div class="fixed bottom-4 left-4 z-50 flex gap-2">
      <button v-if="store.stage < 5 && !isScene" class="bg-white/80 hover:bg-white rounded-lg px-3 py-1.5 text-sm shadow-md border border-gray-200 cursor-pointer transition-colors" @click="showInventory = !showInventory">
        🎒 背包 ({{ store.inventory.length }})
      </button>
    </div>

    <div v-if="store.defenseEffect" class="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div class="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-blue-200 flex items-center gap-3">
        <span class="text-3xl">{{ store.defenseEffect.emoji }}</span>
        <div>
          <div class="text-sm font-bold text-blue-800">{{ store.defenseEffect.name }}</div>
          <div class="text-xs text-blue-600">{{ store.defenseEffect.remaining }}秒后恢复</div>
        </div>
      </div>
    </div>

    <div class="fixed top-4 left-4 z-50 flex flex-col items-start gap-1 pointer-events-none">
      <TransitionGroup name="list">
        <div v-for="msg in toastMessages" :key="msg.id" class="bg-gray-800 text-white px-4 py-2 rounded-xl shadow-lg text-base whitespace-nowrap">
          {{ msg.text }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useGameTimer } from '@/composables/useGameTimer'
import { useStageManager, getTargetWallet } from '@/composables/useStageManager'
import { useAudio } from '@/composables/useAudio'
import { stageConfigs } from '@/data/stageConfig'
import FactionBar from '@/components/HUD/FactionBar.vue'
import InventoryPanel from '@/components/InventoryPanel.vue'

const store = useGameStore()
const route = useRoute()
const timer = useGameTimer()
const stageManager = useStageManager()
const audio = useAudio()

const showInventory = ref(false)
const screenShaking = ref(false)
const blackoutState = ref('')
const toastMessages = ref<{ id: number; text: string }[]>([])
let toastId = 0
let shakeInterval: ReturnType<typeof setInterval> | null = null

const isScene = computed(() => route.path.startsWith('/scene/'))

const stageClasses = computed(() => {
  const classes: Record<string, boolean> = {
    'stage-1': store.stage === 1,
    'stage-2': store.stage === 2,
    'stage-3': store.stage === 3,
    'stage-4': store.stage === 4 && !store.stage4Late,
    'stage-4-late': store.stage === 4 && store.stage4Late,
    'stage-5': store.stage === 5,
    'ai-takeover-active': store.aiTakeover && store.stage === 4,
  }
  if (store.stage === 4) {
    const c = store.chaosLevel
    if (c >= 85) classes['stage-4-chaos-max'] = true
    else if (c >= 60) classes['stage-4-chaos-high'] = true
    else if (c >= 30) classes['stage-4-chaos-mid'] = true
  }
  return classes
})

function showToast(msg: string) {
  const id = ++toastId
  toastMessages.value.push({ id, text: msg })
  setTimeout(() => {
    const idx = toastMessages.value.findIndex((m) => m.id === id)
    if (idx !== -1) toastMessages.value.splice(idx, 1)
  }, 5000)
}

watch(() => store.lastToast, (msg) => { if (msg) showToast(msg) })

function syncStageUrl() {
  const target = `/stage/${store.stage}`
  if (route.path !== target) {
    route.meta.skipSync = true
  }
}

watch(() => store.stage, (s) => {
  showInventory.value = false
  if (isScene.value) audio.stopBgm()
  else if (s <= 4) audio.playBgm(s)
  else { audio.stopBgm(); audio.playSfx('endingFreeze') }
})

watch(() => store.attackCount, () => {
  if (store.stage === 4) {
    audio.playSfx('attack')
    screenShaking.value = true
    const duration = 300 + Math.min(store.chaosLevel * 3, 500)
    setTimeout(() => { screenShaking.value = false }, duration)
  }
})

watch(() => store.chaosLevel, (c) => {
  if (store.stage === 4 && c >= 40 && !store.stage4Late) {
    store.stage4Late = true
  }
})

watch(() => store.blackout, (val) => {
  console.log('[GameView] blackout changed:', val, 'stage:', store.stage)
  if (val && store.stage === 4) {
    blackoutState.value = 'blackout-active'
    setTimeout(() => {
      console.log('[GameView] transitioning to Stage 5')
      stageManager.transitionToStage(5)
      setTimeout(() => {
        blackoutState.value = 'blackout-fading'
      }, 500)
    }, 5500)
  }
})

watch(() => store.stage4Late, (late) => {
  if (late) {
    shakeInterval = setInterval(() => {
      screenShaking.value = true
      const duration = 400 + Math.min(store.chaosLevel * 4, 600)
      setTimeout(() => { screenShaking.value = false }, duration)
    }, Math.max(2000, 5000 - store.chaosLevel * 30))
  }
})

onMounted(() => {
  store.resetGame()
  const match = route.path.match(/\/stage\/(\d)/)
  if (match) store.stage = Number(match[1]) as import('@/types').GameStage
  timer.reset()
  timer.start()
  if (store.stage <= 4) audio.playBgm(store.stage)

  if (store.stage >= 3) {
    const target = getTargetWallet(store.stage)
    const deficit = Math.max(0, target - store.wallet)
    if (deficit > 0) {
      store.addMoney(deficit)
      showToast(`欢迎回来！你的账户收到一笔 ${deficit} 阿元的意外收入。`)
    }
  }

  showToast('欢迎来到阿原的普通市场！')
})
</script>
