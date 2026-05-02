<template>
  <div class="absolute inset-0 top-20 pb-16 flex justify-center">
    <div class="w-full max-w-2xl h-full overflow-y-auto px-4 scrollbar-stage-1">
      <div class="min-h-full flex flex-col justify-center">
        <div class="grid grid-cols-3 gap-4">
          <ProductCard v-for="p in products" :key="p.id" :product="p" @buy="handleBuy" />
        </div>
      </div>
    </div>
    <PurchaseDialog v-if="selected" :product="selected" @confirm="confirmBuy" @cancel="selected = null" />
  </div>

  <CharacterLayer />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useWallet } from '@/composables/useWallet'
import { useAudio } from '@/composables/useAudio'
import { useStageManager } from '@/composables/useStageManager'
import { getCurrentStageProducts } from '@/data/products'
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
</script>
