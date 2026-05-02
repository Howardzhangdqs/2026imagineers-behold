<template>
  <div class="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-yellow-200">
    <span class="text-yellow-600 text-lg">💰</span>
    <span class="font-bold text-gray-800">{{ store.wallet }}</span>
    <span class="text-gray-500 text-sm">阿元</span>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const store = useGameStore()
</script>
