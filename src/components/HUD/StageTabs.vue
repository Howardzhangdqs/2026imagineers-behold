<template>
  <div class="flex gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-md border border-gray-200">
    <button
      v-for="tab in tabs"
      :key="tab.stage"
      class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
      :class="tab.active ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'"
      @click="store.stage = tab.stage as GameStage"
    >
      {{ tab.label }}
      <span v-if="tab.stage === 4 && store.stage < 4" class="ml-1 text-xs">🔒</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import type { GameStage } from '@/types'

const store = useGameStore()

const tabs = computed(() => [
  { stage: 1, label: '日用品', active: store.stage === 1 || store.stage === 2 },
  { stage: 3, label: '数码', active: store.stage === 3 },
  { stage: 4, label: '车市', active: store.stage === 4 },
])
</script>
