<template>
  <div class="absolute inset-0 top-20 flex items-center justify-center pb-16">
    <div class="w-full max-w-2xl px-4">
      <div v-if="currentProducts.length === 0" class="text-center text-gray-400 py-12">
        暂无商品
      </div>

      <div
        v-else
        :class="[
          'grid gap-4',
          productGridClass,
        ]"
      >
        <ProductCard
          v-for="product in currentProducts"
          :key="product.id"
          :product="product"
          @buy="handleBuy"
          @select="handleSelect"
        />
      </div>
    </div>

    <PurchaseDialog
      v-if="selectedProduct"
      :product="selectedProduct"
      @confirm="handleConfirmPurchase"
      @cancel="selectedProduct = null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { getCurrentStageProducts, getProductById } from '@/data/products'
import { useWallet } from '@/composables/useWallet'
import { useAudio } from '@/composables/useAudio'
import ProductCard from './ProductCard.vue'
import PurchaseDialog from './PurchaseDialog.vue'
import type { Product } from '@/types'

const store = useGameStore()
const { buyItem } = useWallet()
const audio = useAudio()

const selectedProduct = ref<Product | null>(null)
const emit = defineEmits<{
  purchaseMade: []
}>()

const currentProducts = computed(() => getCurrentStageProducts(store.stage))

const productGridClass = computed(() => {
  if (store.stage <= 2) return 'grid-cols-3'
  if (store.stage === 3) return 'grid-cols-2'
  return 'grid-cols-3'
})

function handleSelect(productId: string) {
  store.selectedProductId = productId
}

function handleBuy(productId: string) {
  const product = getProductById(productId)
  if (!product) return
  selectedProduct.value = product
}

function handleConfirmPurchase() {
  if (!selectedProduct.value) return
  const result = buyItem(selectedProduct.value.id)
  if (result.success) {
    audio.playSfx('buy')
    emit('purchaseMade')
  } else {
    store.lastToast = result.message
  }
  selectedProduct.value = null
}

watch(
  () => currentProducts.value,
  (products) => {
    if (store.selectedProductId && !products.find((p) => p.id === store.selectedProductId)) {
      store.selectedProductId = null
    }
  },
)
</script>
