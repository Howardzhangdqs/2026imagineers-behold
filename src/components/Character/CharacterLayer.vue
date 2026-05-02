<template>
  <div class="absolute inset-0 pointer-events-none z-30">
    <div v-if="leftChars.length"
      class="absolute left-4 pointer-events-none"
      style="top: 50%; transform: translateY(-50%)">
      <div class="flex flex-col gap-3">
        <Character v-for="char in leftChars" :key="char.id" :character="char"
          class="transition-opacity duration-1000" :class="charOpacityClass" />
      </div>
    </div>

    <div v-if="rightChars.length"
      class="absolute right-4 pointer-events-none"
      style="top: 50%; transform: translateY(-50%)">
      <div class="flex flex-col gap-3">
        <Character v-for="char in rightChars" :key="char.id" :character="char"
          class="transition-opacity duration-1000" :class="charOpacityClass" />
      </div>
    </div>

    <div v-if="bottomChars.length" class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
      <Character v-for="char in bottomChars" :key="char.id" :character="char"
        class="transition-opacity duration-1000" :class="charOpacityClass" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import Character from './Character.vue'

const store = useGameStore()

const charOpacityClass = computed(() => {
  return store.hiddenCharacterIds.size > 0 ? 'opacity-0' : 'opacity-100'
})

const leftChars = computed(() => store.activeCharacters.filter((c) => c.position === 'left'))
const rightChars = computed(() => store.activeCharacters.filter((c) => c.position === 'right'))
const bottomChars = computed(() => store.activeCharacters.filter((c) => c.position === 'bottom'))
</script>
