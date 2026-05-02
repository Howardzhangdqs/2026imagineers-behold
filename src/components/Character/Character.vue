<template>
  <div
    ref="rootRef"
    class="pointer-events-auto"
    :class="[animationClass, collapsing ? 'overflow-hidden' : '']"
    :style="collapseStyle"
    @click="handleClick"
  >
    <div
      class="relative flex items-center gap-2"
      :class="character.position === 'left' ? 'flex-row' : character.position === 'right' ? 'flex-row-reverse' : 'flex-col'"
    >
      <div
        class="w-16 h-20 rounded-xl overflow-hidden transition-transform"
        :class="[avatarBorderClass, isGoodbye ? 'cursor-default' : 'cursor-pointer hover:scale-110']"
      >
        <img :src="avatarSrc" :alt="character.name" class="w-full h-full object-cover" />
      </div>
      <SpeechBubble v-if="showBubble" :text="currentLine" :color="character.bubbleColor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/game'
import SpeechBubble from './SpeechBubble.vue'
import type { Character as CharacterType } from '@/types'

const props = defineProps<{
  character: CharacterType
}>()

const store = useGameStore()
const rootRef = ref<HTMLElement | null>(null)
const lineIndex = ref(0)
const isPassive = props.character.stage === 3 && !props.character.lines.some((l) => l.condition)
const showBubble = ref(props.character.stage !== 3 || isPassive)
const isGoodbye = ref(false)
const collapsing = ref(false)
const collapseStyle = ref<Record<string, string>>({})

let leaveTimeout1: ReturnType<typeof setTimeout> | null = null

function clearLeaveTimeouts() {
  if (leaveTimeout1) { clearTimeout(leaveTimeout1); leaveTimeout1 = null }
}

function getConditionTargetId(): string | null {
  if (props.character.stage === 3) return store.hoveredProductId
  return store.lastBoughtProductId
}

function checkCondition(line: CharacterType['lines'][number]): boolean {
  if (!line.condition) return true
  if (line.condition.boughtProductIds) {
    const targetId = getConditionTargetId()
    if (!targetId) return false
    if (!line.condition.boughtProductIds.includes(targetId)) return false
  }
  if (line.condition.notBoughtProductIds) {
    const ids = store.inventory.map((i) => i.productId)
    if (line.condition.notBoughtProductIds.some((pid) => ids.includes(pid))) return false
  }
  return true
}

const matchedLines = computed(() =>
  props.character.lines.filter((l) => checkCondition(l)),
)

function getChaosLines(): string | null {
  const chaosLines = props.character.chaosFallbackLines
  if (!chaosLines?.length) return null
  const chaos = store.chaosLevel
  const matched = chaosLines
    .filter((c) => chaos >= c.minChaos)
    .sort((a, b) => b.minChaos - a.minChaos)
  if (matched.length > 0) {
    const lines = matched[0].lines
    return lines[lineIndex.value % lines.length] ?? ''
  }
  return null
}

const currentLine = computed(() => {
  if (isGoodbye.value) return goodbyeLine.value
  // Chaos lines override everything (including matched conditional lines)
  const chaosLine = getChaosLines()
  if (chaosLine) return chaosLine
  if (matchedLines.value.length > 0) {
    return matchedLines.value[lineIndex.value % matchedLines.value.length]?.text ?? ''
  }
  const fallback = props.character.fallbackLines
  return fallback[lineIndex.value % fallback.length] ?? ''
})

const goodbyeLine = computed(() => {
  const gl = props.character.goodbyeLines
  if (!gl || gl.length === 0) return '先走了，拜拜~'
  return gl[Math.floor(Math.random() * gl.length)] ?? '先走了，拜拜~'
})

const totalLines = computed(() =>
  matchedLines.value.length > 0 ? matchedLines.value.length : props.character.fallbackLines.length,
)

const avatarSrc = computed(() => `${import.meta.env.BASE_URL}images/characters/${props.character.avatar}.png`)

const animationClass = computed(() => {
  switch (props.character.position) {
    case 'left': return 'animate-[slideFromLeft_0.5s_ease-out]'
    case 'right': return 'animate-[slideFromRight_0.5s_ease-out]'
    case 'bottom': return 'animate-[slideFromBottom_0.5s_ease-out]'
  }
})

const avatarBorderClass = computed(() => {
  if (props.character.faction === 'eco') return 'border-green-400'
  if (props.character.faction === 'traditional') return 'border-orange-400'
  return 'border-yellow-300'
})

function resetDialogue(extraDelay = 0) {
  clearLeaveTimeouts()
  lineIndex.value = 0
  isGoodbye.value = false
  collapsing.value = false
  collapseStyle.value = {}
  showBubble.value = false
  setTimeout(() => { showBubble.value = true }, 100 + extraDelay)
}

watch(() => store.hoveredProductId, () => {
  if (props.character.stage === 3 && !isPassive) {
    clearLeaveTimeouts()
    lineIndex.value = 0
    isGoodbye.value = false
    collapsing.value = false
    collapseStyle.value = {}
    showBubble.value = false
  }
})

watch(() => store.lastBoughtProductId, () => {
  if (props.character.stage !== 3) resetDialogue()
})

watch(() => store.characterTriggers[props.character.id], () => {
  if (!isPassive) showBubble.value = true
})

function handleClick() {
  if (isGoodbye.value) return
  lineIndex.value++
  if (lineIndex.value >= totalLines.value || totalLines.value === 0) {
    isGoodbye.value = true
    showBubble.value = false
    setTimeout(() => { showBubble.value = true }, 100)
    leaveTimeout1 = setTimeout(startCollapse, 3000)
    return
  }
  showBubble.value = false
  setTimeout(() => { showBubble.value = true }, 100)
}

async function startCollapse() {
  const el = rootRef.value
  if (!el) return
  const height = el.offsetHeight

  collapseStyle.value = {
    height: height + 'px',
    marginBottom: '0px',
    opacity: '1',
    transition: 'height 0.4s ease, opacity 0.4s ease, margin-bottom 0.4s ease',
  }

  await nextTick()

  collapseStyle.value = {
    height: '0px',
    marginBottom: '-0.75rem',
    opacity: '0',
    transition: 'height 0.4s ease, opacity 0.4s ease, margin-bottom 0.4s ease',
  }

  collapsing.value = true

  setTimeout(() => {
    const idx = store.activeCharacters.findIndex((c) => c.id === props.character.id)
    if (idx !== -1) {
      store.activeCharacters.splice(idx, 1)
    }
  }, 400)
}
</script>
