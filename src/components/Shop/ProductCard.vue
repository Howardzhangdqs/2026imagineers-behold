<template>
  <div
    class="relative rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-4 backdrop-blur-sm"
    :class="cardClasses" @click="onCardClick" @mouseenter="onMouseEnter" @mousemove="onMouseMove"
    @mouseleave="onMouseLeave">
    <div class="text-center">
      <div v-if="product.category !== 'car'" class="h-24 flex items-center justify-center mb-2">
        <div v-if="product.category === 'attack' || product.category === 'defense'" class="text-5xl leading-none">{{
          product.emoji }}</div>
        <img v-else :src="`${import.meta.env.BASE_URL}images/products/${product.id}.png`" :alt="product.name"
          class="max-h-full object-contain rounded-lg" />
      </div>
      <h3 class="font-bold text-sm text-gray-800 truncate">{{ product.name }}</h3>
      <p class="text-xs text-gray-800 mt-1 h-8 line-clamp-2">{{ product.description }}</p>
      <div class="mt-2">
        <span class="inline-block px-3 py-1 rounded-full text-sm font-bold" :class="priceClasses">
          {{ product.price }} 阿元
        </span>
        <span v-if="product.category === 'attack' && store.wallet < product.price"
          class="text-xs text-red-500 ml-1 font-bold">
          贷款购买
        </span>
      </div>
      <div v-if="owned" class="mt-1 text-xs text-green-500 font-medium">
        ✓ 已拥有
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  buy: [productId: string]
}>()

const store = useGameStore()

const owned = computed(() => store.hasItem(props.product.id))

let bubbleEl: HTMLDivElement | null = null

function onCardClick(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  store.lastPurchaseCardPos = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  }
  emit('buy', props.product.id)
}

function onMouseEnter(e: MouseEvent) {
  store.hoveredProductId = props.product.id
  bubbleEl = document.createElement('div')
  bubbleEl.className = 'fixed px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl text-sm text-gray-600 italic shadow-lg border border-gray-200 pointer-events-none whitespace-nowrap'
  bubbleEl.style.cssText = `z-index:99999; left:${e.clientX + 16}px; top:${e.clientY - 40}px;`
  bubbleEl.textContent = `💭 ${props.product.innerThought}`
  document.body.appendChild(bubbleEl)
}

function onMouseMove(e: MouseEvent) {
  if (!bubbleEl) return
  bubbleEl.style.left = `${e.clientX + 16}px`
  bubbleEl.style.top = `${e.clientY - 40}px`
}

function onMouseLeave() {
  store.hoveredProductId = null
  if (bubbleEl) {
    bubbleEl.remove()
    bubbleEl = null
  }
}

onUnmounted(() => {
  onMouseLeave()
})

const cardClasses = computed(() => {
  const base = 'border-gray-200 bg-white'
  if (props.product.category === 'attack') return 'border-red-400/50 bg-red-50/50'
  if (props.product.category === 'defense') return 'border-blue-400/50 bg-blue-50/50'
  if (props.product.category === 'phone') return 'border-purple-400/50 bg-purple-50/50'
  if (props.product.category === 'car') return 'border-orange-400/50 bg-orange-50/50'
  if (props.product.category === 'accessory') return 'border-cyan-400/50 bg-cyan-50/50'
  return base
})

const priceClasses = computed(() => {
  if (owned.value) return 'bg-gray-200 text-gray-500'
  if (props.product.category === 'attack') return 'bg-yellow-100 text-yellow-800'
  if (store.wallet >= props.product.price) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-400'
})
</script>
