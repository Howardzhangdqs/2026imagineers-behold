<template>
  <Transition name="scale">
    <div
      v-if="product"
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="$emit('cancel')"
    >
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <div class="text-center">
          <span class="text-5xl block mb-4">{{ product.emoji }}</span>
          <h2 class="text-xl font-bold text-gray-800">{{ product.name }}</h2>
          <p class="text-gray-500 mt-2">{{ product.description }}</p>
          <div class="mt-4 p-3 bg-yellow-50 rounded-xl">
            <span class="text-2xl font-bold text-yellow-700">{{ product.price }}</span>
            <span class="text-yellow-600 ml-1">阿元</span>
          </div>
          <div class="text-sm text-gray-400 mt-1">
            当前余额：{{ store.wallet }} 阿元
          </div>
          <div v-if="store.wallet < product.price" class="text-sm mt-1">
            <span v-if="product.category === 'attack'" class="text-orange-400">
              贷款购买
            </span>
            <span v-else class="text-red-400">余额不足！</span>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button
            class="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            @click="$emit('cancel')"
          >
            取消
          </button>
          <button
            data-ai-confirm
            class="flex-1 px-4 py-2.5 rounded-xl bg-yellow-500 text-white font-bold cursor-pointer hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="product.category !== 'attack' && store.wallet < product.price"
            @click="$emit('confirm')"
          >
            确认购买
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import type { Product } from '@/types'

defineProps<{
  product: Product | null
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()

const store = useGameStore()
</script>
