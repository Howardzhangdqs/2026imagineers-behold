<template>
  <div class="absolute inset-0 pointer-events-none z-20">
    <div
      v-for="graffiti in visibleGraffiti"
      :key="graffiti.id"
      class="absolute"
      :style="{
        left: graffiti.x + '%',
        top: graffiti.y + '%',
        width: graffiti.size + 'px',
        height: graffiti.size + 'px',
        opacity: graffiti.opacity,
        transform: `rotate(${graffiti.rotation}deg)`,
        animation: 'graffitiSpread 2s ease-out',
      }"
    >
      <img
        :src="graffiti.src"
        :alt="graffiti.id"
        class="w-full h-full object-contain"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()

interface GraffitiElement {
  id: string
  src: string
  x: number
  y: number
  size: number
  rotation: number
  opacity: number
}

const graffitiList = ref<GraffitiElement[]>([])

const graffitiFiles = [
  'graffiti_scribble',
  'graffiti_cross',
  'graffiti_angry',
  'graffiti_label',
  'graffiti_crack',
  'graffiti_blood',
  'graffiti_rust',
  'graffiti_warning',
  'graffiti_chaos',
]

const visibleGraffiti = computed(() => graffitiList.value)

function addGraffiti() {
  const file = graffitiFiles[graffitiList.value.length % graffitiFiles.length]
  const g: GraffitiElement = {
    id: `g-${graffitiList.value.length}`,
    src: `${import.meta.env.BASE_URL}images/graffiti/${file}.png`,
    x: Math.random() * 85,
    y: Math.random() * 80,
    size: 80 + Math.random() * 150,
    rotation: Math.random() * 40 - 20,
    opacity: 0.2 + Math.random() * 0.4,
  }
  graffitiList.value.push(g)
}

function clearGraffiti() {
  graffitiList.value = []
}

watch(
  () => store.stage,
  (stage) => {
    if (stage === 4) {
      const interval = setInterval(() => {
        if (store.stage !== 4) {
          clearInterval(interval)
          return
        }
        const chaos = store.chaosLevel
        const maxGraffiti = chaos > 60 ? 50 : 30
        const spawnChance = chaos < 30 ? 0.3 : chaos < 60 ? 0.6 : chaos < 85 ? 0.8 : 1.0
        if (graffitiList.value.length < maxGraffiti && Math.random() < spawnChance) {
          addGraffiti()
        }
      }, 1500)
    } else if (stage < 4) {
      clearGraffiti()
    }
  },
)
</script>
