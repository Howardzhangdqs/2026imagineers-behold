<template>
  <div class="absolute inset-0 top-20 pb-30 flex justify-center">
    <div class="w-full max-w-3xl h-full overflow-y-auto px-4 scrollbar-stage-4" :style="scrollbarStyle">
      <div class="min-h-full flex flex-col justify-center">
        <div class="mb-4 text-center">
          <span v-if="phase === 'car'" class="text-lg text-white/80 font-bold">先挑一辆车吧</span>
          <span v-else-if="phase === 'accessory'"
            class="text-4xl text-white/80 font-bold text-shadow-black text-shadow-md">给爱车配点装备？</span>
          <span v-else class="text-lg text-red-400 animate-pulse font-bold">战争开始了……选择你的武器</span>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="p in visibleProducts" :key="p.id + '_' + shopRefreshKey" :data-product-id="p.id"
            :class="{ 'attack-sway': phase === 'attack' && p.category === 'attack' }" :style="attackShakeStyle(p)">
            <ProductCard :product="p" @buy="handleBuy" />
          </div>
        </div>
      </div>
    </div>
    <PurchaseDialog v-if="selected" :product="selected" @confirm="confirmBuy" @cancel="selected = null" />

    <!-- Attack reminder after 60s idle -->
    <div v-if="showAttackReminder" class="fixed inset-0 z-[99980] flex items-center justify-center pointer-events-auto"
      @click="showAttackReminder = false">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative bg-gradient-to-b from-red-900 to-red-950 border-2 border-red-500 rounded-2xl px-10 py-8 text-center shadow-2xl max-w-md animate-[popIn_0.3s_ease]">
        <div class="text-5xl mb-4">⚠️</div>
        <p class="text-white text-xl font-bold mb-2">还在犹豫什么？</p>
        <p class="text-red-300 text-base mb-6">快购买攻击商品，把狂热值推上去！</p>
        <button class="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-lg transition-colors cursor-pointer">
          我知道了
        </button>
      </div>
    </div>
  </div>

  <!-- Virtual cursor for AI takeover -->
  <div v-if="aiTakeover.cursorVisible.value" class="ai-cursor"
    :class="{ 'ai-cursor-clicking': aiTakeover.cursorClicking.value }" :style="{
      left: aiTakeover.cursorX.value + 'px',
      top: aiTakeover.cursorY.value + 'px',
      transitionDuration: aiTakeover.cursorMoveDuration.value + 'ms',
    }">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" overflow="visible">
      <defs>
        <filter id="shadow-classic" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="rgba(0,0,0,0.4)" />
        </filter>
      </defs>
      <path d="M7.5,4.5 L7.5,22.5 L11,18.5 L14,27 L17,26 L14,17.5 L20,17.5 Z" fill="#ffffff" stroke="#000000"
        stroke-width="1" stroke-linejoin="round" filter="url(#shadow-classic)" />
    </svg>
  </div>

  <!-- Crazy red text messages during AI takeover - show only the latest -->
  <div v-if="aiTakeover.crazyTexts.value.length" :key="aiTakeover.crazyTexts.value[aiTakeover.crazyTexts.value.length - 1]" class="crazy-text">
    {{ aiTakeover.crazyTexts.value[aiTakeover.crazyTexts.value.length - 1] }}
  </div>

  <CharacterLayer />
  <AttackAnimation />
  <!-- <UIBreakdownOverlay /> -->
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useWallet } from '@/composables/useWallet'
import { useAudio } from '@/composables/useAudio'
import { useStageManager } from '@/composables/useStageManager'
import { useAiTakeover } from '@/composables/useAiTakeover'
import { getProductById, getRandomDamage, products } from '@/data/products'
import { getCharactersByStage } from '@/data/characters'
import ProductCard from '@/components/Shop/ProductCard.vue'
import PurchaseDialog from '@/components/Shop/PurchaseDialog.vue'
import CharacterLayer from '@/components/Character/CharacterLayer.vue'
import AttackAnimation from '@/components/AttackAnimation.vue'
import UIBreakdownOverlay from '@/components/UIBreakdownOverlay.vue'
import type { Product } from '@/types'

const SHOP_SIZE = 6

const store = useGameStore()
const { buyItem } = useWallet()
const audio = useAudio()
const { checkStageTransition } = useStageManager()
const aiTakeover = useAiTakeover()

const selected = ref<Product | null>(null)
const shopRefreshKey = ref(0)
const showAttackReminder = ref(false)

const hasCar = computed(() => store.inventory.some((i) => i.category === 'car'))
const hasNonCarItem = computed(() => store.inventory.some((i) => i.category !== 'car'))

const phase = computed<'car' | 'accessory' | 'attack'>(() => {
  if (!hasCar.value) return 'car'
  if (!hasNonCarItem.value) return 'accessory'
  return 'attack'
})

const allStage4AttackProducts = products.filter(
  (p) => p.stage === 4 && p.category === 'attack',
)

function shuffleProducts(arr: Product[], seed: string): Product[] {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    const j = hash % (i + 1)
      ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

const carId = computed(() => store.inventory.find((i) => i.category === 'car')?.productId ?? '')

function attackShakeStyle(p: Product) {
  if (phase.value !== 'attack' || p.category !== 'attack') return {}
  // 分段线性：0→10s, 100→1.5s, 500→0.4s
  const chaos = store.chaosLevel
  let duration: number
  if (chaos <= 100) {
    duration = 10 - (chaos / 100) * 8.5
  } else if (chaos <= 500) {
    duration = 1.5 - ((chaos - 100) / 400) * 1.1
  } else {
    duration = 0.4
  }
  // 用 id 哈希生成随机偏移，让每个商品节奏不同
  let hash = 0
  for (let i = 0; i < p.id.length; i++) hash = ((hash << 5) - hash + p.id.charCodeAt(i)) | 0
  const delay = -((Math.abs(hash) % 100) / 100) * duration
  return { animationDuration: `${duration}s`, animationDelay: `${delay}s` }
}

const scrollbarStyle = computed(() => {
  const t = Math.min(store.chaosLevel / 100, 1)
  const r = Math.round(140 + t * 115)
  const g = Math.round(140 - t * 100)
  const b = Math.round(140 - t * 100)
  const a = 0.35 + t * 0.2
  return { scrollbarColor: `rgba(${r}, ${g}, ${b}, ${a}) transparent` }
})

const visibleProducts = computed(() => {
  const bought = new Set(store.inventory.map((i) => i.productId))

  if (phase.value === 'car') {
    return products.filter((p) => p.stage === 4 && p.category === 'car' && !bought.has(p.id)).slice(0, SHOP_SIZE)
  }

  if (phase.value === 'accessory') {
    const items = products.filter(
      (p) => p.stage === 4 && (p.category === 'accessory' || p.category === 'defense') && !bought.has(p.id),
    )
    return shuffleProducts(items, carId.value + '_acc').slice(0, SHOP_SIZE)
  }

  // Attack phase: chaos >= 50 only show attack items
  if (store.chaosLevel >= 50) {
    return shuffleProducts([...allStage4AttackProducts], carId.value + '_' + shopRefreshKey.value).slice(0, SHOP_SIZE)
  }

  // Attack phase: accessories phase out, attack items always available (infinite)
  const allAccessories = products.filter(
    (p) => p.stage === 4 && p.category === 'accessory' && !bought.has(p.id),
  )
  const removeCount = Math.min(store.attackCount, allAccessories.length)
  const remainingAccessories = allAccessories.slice(removeCount)

  const defenseItems = products.filter(
    (p) => p.stage === 4 && p.category === 'defense' && !bought.has(p.id),
  )

  const pool = [...remainingAccessories, ...allStage4AttackProducts, ...defenseItems]
  const seed = carId.value + '_' + shopRefreshKey.value
  return shuffleProducts(pool, seed).slice(0, SHOP_SIZE)
})

function handleBuy(productId: string) {
  const p = getProductById(productId)
  if (p) selected.value = p
}

function confirmBuy() {
  if (!selected.value) return
  const product = selected.value

  if (product.category === 'attack') {
    // Attack items: infinite purchases, bypass inventory check
    store.forceSpendMoney(product.price)
    const damage = getRandomDamage(product.id)
    store.attackCount++
    store.totalDamage += damage
    store.addChaos(8 + Math.floor(damage / 150))
    store.showRedFlash = true
    setTimeout(() => { store.showRedFlash = false }, 300)

    audio.playSfx('buy')
    store.lastPurchaseEmoji = product.emoji
    store.lastPurchaseCategory = product.category
    store.purchaseImpactTrigger++
    shopRefreshKey.value++

    if (store.attackPhaseStartElapsed === 0) {
      store.attackPhaseStartElapsed = store.elapsed
    }

    spawnCharacters()
    checkStageTransition()
    selected.value = null
    return
  }

  // Non-attack items: normal buy flow
  const result = buyItem(product.id)
  if (result.success) {
    audio.playSfx('buy')
    store.lastPurchaseEmoji = product.emoji
    store.lastPurchaseCategory = product.category

    if (product.category === 'car') {
      store.addChaos(10)
    } else if (product.category === 'accessory') {
      store.addChaos(5)
    } else if (product.category === 'defense') {
      store.addChaos(3)
      hideAllCharacters(product.emoji, product.name, 5)
    } else {
      store.addChaos(5)
    }

    store.purchaseImpactTrigger++
    shopRefreshKey.value++

    if (phase.value === 'attack' && store.attackPhaseStartElapsed === 0) {
      store.attackPhaseStartElapsed = store.elapsed
    }

    spawnCharacters()
    checkStageTransition()
  } else {
    store.lastToast = result.message
  }
  selected.value = null
}

// --- AI Takeover callbacks ---
function getCardPositions(): { id: string; x: number; y: number }[] {
  const cards = document.querySelectorAll('[data-product-id]')
  return Array.from(cards).map((el) => {
    const rect = el.getBoundingClientRect()
    return {
      id: el.getAttribute('data-product-id') || '',
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  })
}

function getConfirmButtonPos(): { x: number; y: number } | null {
  const btn = document.querySelector('[data-ai-confirm]')
  if (!btn) return null
  const rect = btn.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

aiTakeover.setCallbacks({
  getCardPositions,
  getConfirmButtonPos,
  onSelectProduct: (id: string) => {
    console.log('[AI] onSelectProduct:', id)
    const p = getProductById(id)
    if (p) selected.value = p
  },
  onConfirmPurchase: () => {
    console.log('[AI] onConfirmPurchase')
    confirmBuy()
  },
})

// Primary trigger: AI takeover when chaos bar hits 100%
watch(() => store.chaosLevel, (c) => {
  if (store.aiTakeover || phase.value !== 'attack') return
  if (c >= 100) {
    console.log('[Stage4] chaosLevel >= 100, starting AI takeover')
    aiTakeover.startTakeover()
  }
})

// Fallback: remind user after 60 seconds if chaos didn't reach 100
watch(() => store.elapsed, (t) => {
  if (store.aiTakeover || showAttackReminder.value || phase.value !== 'attack') return
  if (store.attackPhaseStartElapsed > 0 && t - store.attackPhaseStartElapsed >= 60 && store.chaosLevel < 100) {
    console.log('[Stage4] 60s elapsed, showing attack reminder')
    showAttackReminder.value = true
  }
})

function hideAllCharacters(emoji: string, name: string, seconds: number) {
  const ids = store.activeCharacters.map((c) => c.id)
  store.hiddenCharacterIds = new Set(ids)
  store.defenseEffect = { emoji, name, remaining: seconds }
  console.log(`[Defense] ${name} purchased, hiding ${ids.length} characters for ${seconds}s`)

  const interval = setInterval(() => {
    if (!store.defenseEffect) {
      clearInterval(interval)
      return
    }
    store.defenseEffect = { ...store.defenseEffect, remaining: store.defenseEffect.remaining - 1 }
    if (store.defenseEffect.remaining <= 0) {
      store.hiddenCharacterIds = new Set()
      store.defenseEffect = null
      clearInterval(interval)
    }
  }, 1000)
}

function spawnCharacters() {
  const stage = store.stage
  store.activeCharacters = store.activeCharacters.filter((ac) => ac.stage === stage)
  const chars = getCharactersByStage(stage)
  chars.forEach((c) => {
    if (!store.activeCharacters.some((ac) => ac.id === c.id)) {
      setTimeout(() => store.activeCharacters.push(c), c.enterDelay)
    }
  })
}

onMounted(() => {
  nextTick(() => spawnCharacters())
})

onUnmounted(() => {
  aiTakeover.stopTakeover()
})
</script>
