<template>
  <div class="absolute inset-0 top-20 pb-16 flex justify-center">
    <div class="w-full max-w-2xl h-full overflow-y-auto px-4 scrollbar-stage-3">
      <div class="min-h-full flex flex-col justify-center">
        <div class="grid grid-cols-2 gap-4">
          <ProductCard v-for="p in products" :key="p.id" :product="p" @buy="handleBuy" />
        </div>
      </div>
    </div>
    <PurchaseDialog v-if="selected" :product="selected" @confirm="confirmBuy" @cancel="selected = null" />
  </div>

  <CharacterLayer />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useWallet } from '@/composables/useWallet'
import { useAudio } from '@/composables/useAudio'
import { useStageManager } from '@/composables/useStageManager'
import { getCurrentStageProducts } from '@/data/products'
import { getCharactersByStage } from '@/data/characters'
import ProductCard from '@/components/Shop/ProductCard.vue'
import PurchaseDialog from '@/components/Shop/PurchaseDialog.vue'
import CharacterLayer from '@/components/Character/CharacterLayer.vue'
import type { Product } from '@/types'

const store = useGameStore()
const { buyItem } = useWallet()
const audio = useAudio()
const { checkStageTransition } = useStageManager()

const selected = ref<Product | null>(null)

const products = computed(() => getCurrentStageProducts(store.stage))

function handleBuy(productId: string) {
  const p = products.value.find((x) => x.id === productId)
  if (p) selected.value = p
}

function confirmBuy() {
  if (!selected.value) return
  const result = buyItem(selected.value.id)
  if (result.success) {
    audio.playSfx('buy')
    checkStageTransition()
  } else {
    store.lastToast = result.message
  }
  selected.value = null
}

function spawnCharacters() {
  const stage = store.stage
  store.activeCharacters = store.activeCharacters.filter((ac) => ac.stage === stage)
  const chars = getCharactersByStage(stage)
  chars.forEach((c) => {
    if (!store.activeCharacters.some((ac) => ac.id === c.id)) {
      store.activeCharacters.push(c)
    }
  })
}

function triggerDialogueSequence() {
  const chars = getCharactersByStage(store.stage).slice()
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = chars[i]!
    chars[i] = chars[j]!
    chars[j] = tmp
  }
  let acc = 0
  for (const c of chars) {
    const delay = acc
    acc += 200 + Math.floor(Math.random() * 101)
    setTimeout(() => {
      store.characterTriggers[c.id] = Date.now()
    }, delay)
  }
}

watch(
  () => store.hoveredProductId,
  (newId) => {
    if (store.stageTransitioning) return
    if (newId) {
      const product = products.value.find((p) => p.id === newId)
      if (!product) return
    }
    spawnCharacters()
    triggerDialogueSequence()
  },
)

onMounted(() => {
  spawnCharacters()
  triggerDialogueSequence()
})
</script>
