<template>
  <div v-if="store.stage >= 4 && store.stage < 5" class="absolute top-1 left-0 right-0 z-40 px-4" data-faction-bar>
    <div class="max-w-lg mx-auto">
      <div class="relative h-8 rounded-lg overflow-hidden border-2" :class="[
        barTrackClass,
        { 'chaos-bar-pulse': store.chaosLevel > 60 },
        { 'chaos-bar-overflow': store.chaosLevel > 100 },
      ]">
        <div class="h-full transition-all duration-700 ease-out" :class="barFillClass"
          :style="{ width: barWidth + '%' }"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            :class="store.chaosLevel > 100 ? 'text-base' : 'text-sm'">
            {{ displayText }}
          </span>
        </div>
        <div v-if="impactFlash" class="absolute inset-0 bg-white/50 rounded-lg"
          style="animation: chaosImpact 0.4s ease-out forwards"></div>
      </div>
      <div class="flex items-center justify-between mt-1 px-1">
        <!-- <span class="text-white/40 text-xs">
          Damage: {{ store.totalDamage }}
        </span> -->
        <span v-if="store.aiTakeover" class="text-red-400 text-xs font-bold animate-pulse">
          你已经无法控制了......
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
const impactFlash = ref(false)

const chaosLabel = computed(() => {
  const c = store.chaosLevel
  if (c < 25) return ''
  if (c < 50) return '戾气值'
  if (c < 75) return '狂热值'
  return '魔怔值'
})

const chaosEmoji = computed(() => {
  const c = store.chaosLevel
  if (c < 25) return ''
  if (c < 50) return '🌊'
  if (c < 75) return '🔥'
  return '💀'
})

const barWidth = computed(() => Math.min(store.chaosLevel, 100))

const displayText = computed(() => {
  const pct = Math.round(store.chaosLevel)
  const emoji = chaosEmoji.value
  const label = chaosLabel.value
  if (label) return `${emoji} ${label}  ${pct.toLocaleString()}%`
  return `${pct}%`
})

const barTrackClass = computed(() => {
  const c = store.chaosLevel
  if (c < 50) return 'bg-gray-900/90 border-white/10'
  if (c < 75) return 'bg-gray-900/90 border-orange-500/30'
  if (c < 100) return 'bg-gray-900/90 border-red-500/40'
  return 'bg-gray-900/90 border-red-500/60'
})

const barFillClass = computed(() => {
  const c = store.chaosLevel
  if (c < 25) return 'bg-gradient-to-r from-gray-600 to-gray-500'
  if (c < 50) return 'bg-gradient-to-r from-cyan-600 to-blue-500'
  if (c < 75) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
  return 'bg-gradient-to-r from-red-500 to-red-800'
})

watch(() => store.purchaseImpactTrigger, () => {
  impactFlash.value = true
  setTimeout(() => { impactFlash.value = false }, 400)
})
</script>
