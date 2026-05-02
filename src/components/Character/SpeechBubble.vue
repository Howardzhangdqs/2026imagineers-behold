<template>
  <div
    class="px-4 py-2.5 rounded-2xl text-sm font-medium shadow-md max-w-52 animate-[popIn_0.3s_ease-out] cursor-pointer"
    :class="bubbleClasses"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'

const props = defineProps<{
  text: string
  color: 'green' | 'yellow' | 'red'
}>()

const bubbleClasses = computed(() => {
  switch (props.color) {
    case 'green': return 'bg-green-100 text-green-900 border border-green-200'
    case 'yellow': return 'bg-yellow-100 text-yellow-900 border border-yellow-200'
    case 'red': return 'bg-red-100 text-red-900 border border-red-200'
  }
})

let thoughtEl: HTMLDivElement | null = null

function onMouseEnter(e: MouseEvent) {
  thoughtEl = document.createElement('div')
  thoughtEl.className = 'fixed px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl text-sm text-gray-600 italic shadow-lg border border-gray-200 pointer-events-none whitespace-nowrap'
  thoughtEl.style.cssText = `z-index:99999; left:${e.clientX + 16}px; top:${e.clientY - 40}px;`
  thoughtEl.textContent = '💭 让ta安静一会儿'
  document.body.appendChild(thoughtEl)
}

function onMouseMove(e: MouseEvent) {
  if (!thoughtEl) return
  thoughtEl.style.left = `${e.clientX + 16}px`
  thoughtEl.style.top = `${e.clientY - 40}px`
}

function onMouseLeave() {
  if (thoughtEl) {
    thoughtEl.remove()
    thoughtEl = null
  }
}

onUnmounted(() => {
  onMouseLeave()
})
</script>
