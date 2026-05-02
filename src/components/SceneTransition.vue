<template>
  <div class="fixed inset-0 z-[100] bg-black flex items-center justify-center">
    <p class="max-w-xl px-8 text-center text-white/90 text-lg leading-relaxed transition-opacity duration-700" :style="{ opacity: visible ? 1 : 0 }">
      {{ currentLine }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const props = defineProps<{
  lines: string[]
  nextStage: number
  speed?: number
}>()

const router = useRouter()
const store = useGameStore()

const currentLine = ref('')
const visible = ref(false)
const s = props.speed ?? 1

onMounted(() => {
  let delay = 600 / s

  props.lines.forEach((line) => {
    setTimeout(() => {
      currentLine.value = line
      visible.value = true
    }, delay)
    delay += (800 + 2000) / s

    setTimeout(() => {
      visible.value = false
    }, delay)
    delay += (700 + 400) / s
  })

  setTimeout(() => {
    router.push(`/stage/${props.nextStage}`)
    store.fadeOverlay = false
    store.stageTransitioning = false
  }, delay + 400)
})
</script>
