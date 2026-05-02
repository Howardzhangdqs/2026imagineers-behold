<template>
  <div ref="viewport" class="absolute inset-0 z-50 overflow-hidden">
    <div ref="creditsTrack" class="ending-allow-animation w-full flex flex-col items-center">
      <div class="h-screen"></div>

      <div v-for="(line, index) in lines" :key="index" class="text-center px-8 py-1.5 w-full">
        <p class="mb-1 text-shadow-credits"
          :class="index === 0 ? 'text-3xl font-bold text-amber-100' : 'text-lg font-semibold text-amber-100'">
          {{ line }}
        </p>
      </div>

      <div class="mt-16 text-center">
        <div class="text-amber-200 text-sm font-medium space-y-1 text-shadow-credits">
          <p>你购买了 {{ store.inventory.length }} 件商品</p>
          <p>发动了 {{ store.attackCount }} 次攻击</p>
          <p>造成了 {{ store.totalDamage }} 点总伤害</p>
          <p>最终魔怔值 {{ Math.round(store.chaosLevel).toLocaleString() }}%</p>
          <p class="mt-2 text-lg font-bold text-amber-100">{{ conclusion }}</p>
        </div>
      </div>

      <div ref="restartBtn" class="mt-16 mb-20">
        <button
          class="px-8 py-3 rounded-xl bg-amber-700/80 text-white font-bold text-lg cursor-pointer hover:bg-amber-800 transition-colors shadow-lg backdrop-blur-sm"
          @click="restart">
          重新开始
        </button>
      </div>

      <div class="h-screen"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
const emit = defineEmits<{ restart: [] }>()

const viewport = ref<HTMLElement | null>(null)
const creditsTrack = ref<HTMLElement | null>(null)
const restartBtn = ref<HTMLElement | null>(null)
let rafId = 0

const lines = [
  '消费，本该是件快乐的事',
  '可我们总在不经意间',
  '卷入了无尽的争论和站队。',
  '从牛奶到手机，从汽车到价值观——',
  '每一笔消费，都变成了一场战争。',
  '你选择的每一个商品，不再只是为了自己，',
  '而是为了对抗、为了表达、为了证明。',
  '可是……真的有必要吗？',
  // '',
  // '也许，真正的自由，',
  // '是不需要别人认同的选择。',
]

const conclusion = computed(() => {
  if (store.chaosLevel < 20) return '你几乎没引起任何波澜，市场依然平静。'
  if (store.attackCount === 0) return '你选择了和平，世界因你而安静。'
  if (store.chaosLevel < 100) return '你只是轻轻参与了一下争论。'
  if (store.chaosLevel < 1000) return '你卷入了这场无尽的消费战争。'
  if (store.chaosLevel < 5000) return '你彻底搅乱了整个市场！天下大乱！'
  return '你亲手引爆了一场史诗级的消费混战！'
})

onMounted(() => {
  const delay = 1500
  setTimeout(startScroll, delay)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

function startScroll() {
  const container = viewport.value
  const track = creditsTrack.value
  const target = restartBtn.value
  if (!container || !track || !target) return

  const vh = container.clientHeight
  const bottomMargin = 60
  const targetY = target.offsetTop + target.offsetHeight / 2 - vh + bottomMargin

  let offset = 0
  const baseSpeed = 1.2
  let currentSpeed = baseSpeed
  const decelDistance = vh * 0.6
  let lastTime = performance.now()

  function tick(now: number) {
    const dt = Math.min(now - lastTime, 50)
    lastTime = now

    if (offset >= targetY) {
      track.style.transform = `translateY(-${targetY}px)`
      console.log('[EndingScreen] scroll stopped, button at bottom')
      return
    }

    const distToTarget = targetY - offset
    if (distToTarget < decelDistance) {
      const ratio = distToTarget / decelDistance
      currentSpeed = baseSpeed * (0.05 + 0.95 * ratio)
    }

    offset += currentSpeed * (dt / 16)
    offset = Math.min(offset, targetY)
    track.style.transform = `translateY(-${offset}px)`

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)
}

function restart() {
  store.resetGame()
  emit('restart')
}
</script>
