import { ref, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { MAX_TIME } from '@/data/stageConfig'

export function useGameTimer() {
  const store = useGameStore()
  const timerHandle = ref<ReturnType<typeof setInterval> | null>(null)

  function start() {
    if (timerHandle.value) return
    store.isPlaying = true
    store.isPaused = false
    timerHandle.value = setInterval(() => {
      if (store.isPaused) return
      if (store.elapsed >= MAX_TIME) {
        stop()
        return
      }
      store.elapsed++
    }, 1000)
  }

  function pause() {
    store.isPaused = true
  }

  function resume() {
    store.isPaused = false
  }

  function stop() {
    if (timerHandle.value) {
      clearInterval(timerHandle.value)
      timerHandle.value = null
    }
    store.isPlaying = false
  }

  function reset() {
    stop()
    store.elapsed = 0
  }

  onUnmounted(() => {
    stop()
  })

  return { start, pause, resume, stop, reset }
}
