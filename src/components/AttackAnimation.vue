<template>
  <div class="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
    <div
      v-for="anim in activeAnims"
      :key="anim.id"
      ref="animRefs"
      class="absolute"
      :style="{
        left: anim.startX + 'px',
        top: anim.startY + 'px',
        fontSize: anim.isAttack ? '3rem' : '2rem',
        transform: 'translate(-50%, -50%)',
      }"
    >
      {{ anim.emoji }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/game'

interface FlyUpAnim {
  id: number
  emoji: string
  startX: number
  startY: number
  endX: number
  endY: number
  isAttack: boolean
}

const store = useGameStore()
const activeAnims = ref<FlyUpAnim[]>([])
let animId = 0

function getFactionBarCenter(): { x: number; y: number } {
  const bar = document.querySelector('[data-faction-bar]')
  if (bar) {
    const rect = bar.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: window.innerWidth / 2, y: 40 }
}

watch(
  () => store.purchaseImpactTrigger,
  async () => {
    if (store.stage < 4) return
    const id = ++animId
    const emoji = store.lastPurchaseEmoji ?? '📦'
    const isAttack = store.lastPurchaseCategory === 'attack'
    const cardPos = store.lastPurchaseCardPos ?? { x: window.innerWidth / 2, y: window.innerHeight * 0.6 }
    const endPos = getFactionBarCenter()

    const anim: FlyUpAnim = {
      id,
      emoji,
      startX: cardPos.x,
      startY: cardPos.y,
      endX: endPos.x,
      endY: endPos.y,
      isAttack,
    }
    activeAnims.value.push(anim)

    await nextTick()

    const el = document.querySelector(`[data-anim-id="${id}"]`) as HTMLElement
    if (!el) {
      const els = document.querySelectorAll('.fixed.inset-0.pointer-events-none > div')
      const last = els[els.length - 1] as HTMLElement
      if (last) {
        last.setAttribute('data-anim-id', String(id))
        flyAnimate(last, anim)
      }
    } else {
      flyAnimate(el, anim)
    }

    setTimeout(() => {
      activeAnims.value = activeAnims.value.filter((a) => a.id !== id)
    }, 900)
  },
)

function flyAnimate(el: HTMLElement, anim: FlyUpAnim) {
  const scale = anim.isAttack ? 1.5 : 1
  el.animate(
    [
      { transform: 'translate(-50%, -50%) scale(' + scale + ')', opacity: 0.9 },
      { transform: `translate(calc(${anim.endX - anim.startX}px - 50%), calc(${anim.endY - anim.startY}px - 50%)) scale(${scale * 1.3})`, opacity: 1, offset: 0.4 },
      { transform: `translate(calc(${anim.endX - anim.startX}px - 50%), calc(${anim.endY - anim.startY}px - 50%)) scale(${scale * 1.5})`, opacity: 0.7, offset: 0.7 },
      { transform: `translate(calc(${anim.endX - anim.startX}px - 50%), calc(${anim.endY - anim.startY}px - 50%)) scale(0)`, opacity: 0 },
    ],
    { duration: 800, easing: 'ease-out', fill: 'forwards' },
  )
  console.log('[AttackAnimation] fly from', anim.startX, anim.startY, 'to', anim.endX, anim.endY)
}
</script>
