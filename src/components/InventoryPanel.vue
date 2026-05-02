<template>
  <Transition name="fade">
    <div
      class="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white/95 backdrop-blur-md shadow-2xl border-l border-gray-200 flex flex-col"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 class="font-bold text-gray-800">🎒 背包</h3>
        <button
          class="text-gray-400 hover:text-gray-600 cursor-pointer text-xl leading-none"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="store.inventory.length === 0" class="text-center text-gray-400 py-8">
          背包空空如也
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="item in store.inventory"
            :key="item.productId + item.boughtAt"
            class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm text-gray-800 truncate">{{ item.name }}</div>
              <div class="text-xs text-gray-400">{{ categoryLabel(item.category) }}</div>
            </div>

            <div class="flex gap-1">
              <button
                v-if="item.category === 'attack' || item.category === 'defense'"
                class="px-2 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer transition-colors"
                @click="handleUse(item.productId)"
              >
                使用
              </button>
              <button
                class="px-2 py-1 text-xs rounded-lg bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer transition-colors"
                @click="handleSell(item.productId)"
              >
                卖出
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-gray-100">
        <div class="text-xs text-gray-500 text-center">
          卖出可获得购买价的 50%
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useWallet } from '@/composables/useWallet'
import { useInventory } from '@/composables/useInventory'
import { useAudio } from '@/composables/useAudio'

defineEmits<{
  close: []
}>()

const store = useGameStore()
const wallet = useWallet()
const inventory = useInventory()
const audio = useAudio()

function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    daily: '日用品',
    phone: '手机',
    car: '汽车',
    attack: '攻击道具',
    defense: '防御道具',
  }
  return labels[cat] || cat
}

function handleUse(productId: string) {
  const result = inventory.useItem(productId)
  if (result.success) {
    store.lastToast = result.message
  }
}

function handleSell(productId: string) {
  const result = wallet.sellItem(productId)
  if (result.success) {
    audio.playSfx('cash')
    store.lastToast = result.message
  }
}
</script>
