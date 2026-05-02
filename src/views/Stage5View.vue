<template>
  <EndingScreen @restart="restart" />
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'
import EndingScreen from '@/components/EndingScreen.vue'

const store = useGameStore()
const router = useRouter()

function restart() {
  store.resetGame()
  router.push('/stage/1')
}
</script>
