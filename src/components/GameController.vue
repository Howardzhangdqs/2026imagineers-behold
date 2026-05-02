<template>
  <div class="game-root" :class="stageClasses">
    <div class="rust-overlay"></div>

    <div v-if="store.showRedFlash" class="red-flash"></div>

    <div
      v-if="store.stage < 5"
      class="absolute top-0 left-0 right-0 z-50 flex items-center justify-end px-4 py-2"
    >
      <WalletDisplay />
    </div>

    <FactionBar v-if="store.stage >= 4 && store.stage < 5" />

    <div class="game-main relative w-full h-full" :class="{ 'screen-shake': screenShaking }">
      <ShopView v-if="store.stage < 5" />

      <CharacterLayer v-if="store.stage < 5" />

      <AttackAnimation v-if="store.stage >= 4 && store.stage < 5" />

      <UIBreakdownOverlay v-if="store.stage >= 4 && store.stage < 5" />

      <EndingScreen v-if="store.stage === 5" />
    </div>

    <InventoryPanel v-if="showInventory && store.stage < 5" @close="showInventory = false" />

    <div
      class="fixed bottom-4 left-4 z-50 flex gap-2"
    >
      <button
        v-if="store.stage < 5"
        class="bg-white/80 hover:bg-white rounded-lg px-3 py-1.5 text-sm shadow-md border border-gray-200 cursor-pointer transition-colors"
        @click="showInventory = !showInventory"
      >
        🎒 背包 ({{ store.inventory.length }})
      </button>
      <button
        v-if="store.isPlaying && store.stage === 5"
        class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-1.5 text-sm shadow-md cursor-pointer transition-colors"
        @click="restartGame"
      >
        重新开始
      </button>
    </div>

    <!-- Toast messages in top-left -->
    <div class="fixed top-4 left-4 z-50 flex flex-col items-start gap-1 pointer-events-none">
      <TransitionGroup name="list">
        <div
          v-for="msg in toastMessages"
          :key="msg.id"
          class="bg-gray-800 text-white px-4 py-2 rounded-xl shadow-lg text-base whitespace-nowrap"
        >
          {{ msg.text }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useGameTimer } from '@/composables/useGameTimer'
import { useStageManager } from '@/composables/useStageManager'
import { useAudio } from '@/composables/useAudio'
import WalletDisplay from './HUD/WalletDisplay.vue'
import FactionBar from './HUD/FactionBar.vue'
import ShopView from './Shop/ShopView.vue'
import CharacterLayer from './Character/CharacterLayer.vue'
import AttackAnimation from './AttackAnimation.vue'
import InventoryPanel from './InventoryPanel.vue'
import UIBreakdownOverlay from './UIBreakdownOverlay.vue'
import EndingScreen from './EndingScreen.vue'
import { getCharactersByStage } from '@/data/characters'

const store = useGameStore()
const timer = useGameTimer()
const stageManager = useStageManager()
const audio = useAudio()

const showInventory = ref(false)
const screenShaking = ref(false)
const toastMessages = ref<{ id: number; text: string }[]>([])
let toastId = 0
let shakeInterval: ReturnType<typeof setInterval> | null = null

const stageClasses = computed(() => ({
  'stage-1': store.stage === 1,
  'stage-2': store.stage === 2,
  'stage-3': store.stage === 3,
  'stage-4': store.stage === 4 && !store.stage4Late,
  'stage-4-late': store.stage === 4 && store.stage4Late,
  'stage-5': store.stage === 5,
}))

function showToast(msg: string) {
  const id = ++toastId
  toastMessages.value.push({ id, text: msg })
  setTimeout(() => {
    const idx = toastMessages.value.findIndex((m) => m.id === id)
    if (idx !== -1) toastMessages.value.splice(idx, 1)
  }, 5000)
}

function startGame() {
  store.resetGame()
  timer.reset()
  timer.start()
  audio.playBgm(1)
  showToast('欢迎来到阿原的普通市场！')
}

function restartGame() {
  if (shakeInterval) clearInterval(shakeInterval)
  store.resetGame()
  timer.reset()
  showInventory.value = false
  timer.start()
  audio.playBgm(1)
  showToast('重新开始！')
}

watch(
  () => store.lastToast,
  (msg) => {
    if (msg) showToast(msg)
  },
)

watch(
  () => store.stage,
  (newStage) => {
    showInventory.value = false
    if (newStage >= 1 && newStage <= 4) {
      audio.playBgm(newStage)
    }
    if (newStage === 5) {
      audio.stopBgm()
      audio.playSfx('endingFreeze')
    }
  },
)

watch(
  () => store.attackCount,
  () => {
    if (store.stage === 4) {
      audio.playSfx('attack')
      screenShaking.value = true
      setTimeout(() => {
        screenShaking.value = false
      }, 500)
    }
  },
)

// Stage 4 screen shake interval
watch(
  () => store.stage4Late,
  (late) => {
    if (late) {
      shakeInterval = setInterval(() => {
        screenShaking.value = true
        setTimeout(() => {
          screenShaking.value = false
        }, 600)
      }, 5000)
    }
  },
)

// Auto-start fresh game on mount
startGame()

// Spawn characters on each purchase
watch(
  () => store.lastBoughtProductId,
  () => {
    if (!store.lastBoughtProductId) return
    const stageChars = getCharactersByStage(store.stage)
    stageChars.forEach((c) => {
      if (!store.activeCharacters.some((ac) => ac.id === c.id)) {
        setTimeout(() => {
          store.activeCharacters.push(c)
        }, c.enterDelay)
      }
    })
  },
)
</script>
