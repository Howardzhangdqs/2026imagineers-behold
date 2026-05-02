import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { getRandomDamage, products } from '@/data/products'

const attackProducts = products.filter((p) => p.stage === 4 && p.category === 'attack')
const CHAOS_THRESHOLD = 20000

export function useAiTakeover() {
  const store = useGameStore()

  const cursorX = ref(0)
  const cursorY = ref(0)
  const cursorClicking = ref(false)
  const cursorVisible = ref(false)
  const cursorMoveDuration = ref(800)

  const crazyTexts = ref<string[]>([])
  const SPEED_RAMP_SECONDS = 20
  const CRAZY_TEXT_INTERVAL = 3100

  let purchaseCount = 0
  let stopRequested = false
  let startTime = 0
  let crazyTextTimer: ReturnType<typeof setInterval> | null = null

  const crazyMessages = [
    '你已经无法控制局面了',
    '这一切都是你的选择',
    '谁在操控谁？',
    '停不下来了……',
    '购买！购买！购买！',
    '你的手不受控制了',
    '它们在替你做决定',
    '你已经回不了头了',
    '是谁在点击？是你吗？',
    '消费的尽头是深渊',
    '你真的想停下来吗？',
    '一切都在加速',
    '没有退路了',
    '继续……不要停……',
    '你不过是棋子',
    '他们在看着你失控',
    '钱包？不存在的',
    '这就是自由的代价',
    '每一笔都在加深深渊',
    '你醒醒啊！',
  ]

  // Callbacks injected by Stage4View
  let getCardPositions: () => { id: string; x: number; y: number }[] = () => []
  let getConfirmButtonPos: () => { x: number; y: number } | null = () => null
  let onSelectProduct: (id: string) => void = () => {}
  let onConfirmPurchase: () => void = () => {}

  function setCallbacks(cbs: {
    getCardPositions: () => { id: string; x: number; y: number }[]
    getConfirmButtonPos: () => { x: number; y: number } | null
    onSelectProduct: (id: string) => void
    onConfirmPurchase: () => void
  }) {
    getCardPositions = cbs.getCardPositions
    getConfirmButtonPos = cbs.getConfirmButtonPos
    onSelectProduct = cbs.onSelectProduct
    onConfirmPurchase = cbs.onConfirmPurchase
  }

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function getSpeed(): number {
    // 基于接管后的经过时间，0→SPEED_RAMP_SECONDS 线性递增到 1
    const elapsed = (Date.now() - startTime) / 1000
    return Math.min(elapsed / SPEED_RAMP_SECONDS, 1)
  }

  function getMoveDuration(): number {
    const t = getSpeed()
    return 800 - t * 730  // 800 → 70
  }

  function getClickDuration(): number {
    const t = getSpeed()
    return 100 - t * 70   // 100 → 30
  }

  function getDialogWait(): number {
    const t = getSpeed()
    return 200 - t * 150  // 200 → 50
  }

  function getPause(): number {
    const t = getSpeed()
    return 500 - t * 450  // 500 → 50
  }

  function getChaosAdd(): number {
    const n = purchaseCount
    if (n < 5) return 100 + Math.floor(Math.random() * 150)
    if (n < 10) return 300 + Math.floor(Math.random() * 400)
    if (n < 15) return 600 + Math.floor(Math.random() * 600)
    return 1000 + Math.floor(Math.random() * 1000)
  }

  async function purchaseCycle() {
    if (stopRequested || store.stage !== 4) return

    // 1. Pick from actually visible cards in the shop
    const positions = getCardPositions()
    if (positions.length === 0) {
      // DOM not ready yet, retry after short delay
      await delay(200)
      purchaseCycle()
      return
    }

    // Prefer attack product cards
    const attackCards = positions.filter((p) => {
      const product = attackProducts.find((a) => a.id === p.id)
      return !!product
    })
    const cardPos = attackCards.length > 0
      ? attackCards[Math.floor(Math.random() * attackCards.length)]!
      : positions[Math.floor(Math.random() * positions.length)]!

    const target = attackProducts.find((a) => a.id === cardPos.id) || null
    if (!target) {
      // Card didn't match an attack product, retry
      await delay(200)
      purchaseCycle()
      return
    }

    const moveDuration = getMoveDuration()
    cursorMoveDuration.value = moveDuration

    // 2. Move cursor to product card
    cursorX.value = cardPos.x
    cursorY.value = cardPos.y
    await delay(moveDuration)

    if (stopRequested) return

    // 4. Click the card (visual)
    cursorClicking.value = true
    await delay(getClickDuration())
    cursorClicking.value = false

    // 5. Select product → opens PurchaseDialog
    onSelectProduct(target.id)
    await delay(getDialogWait())

    if (stopRequested) return

    // 6. Get confirm button position
    const btnPos = getConfirmButtonPos()
    if (btnPos) {
      // 7. Move cursor to confirm button
      const moveDuration2 = getMoveDuration()
      cursorMoveDuration.value = moveDuration2
      cursorX.value = btnPos.x
      cursorY.value = btnPos.y
      await delay(moveDuration2)

      if (stopRequested) return

      // 8. Click confirm (visual)
      cursorClicking.value = true
      await delay(getClickDuration())
      cursorClicking.value = false
    }

    // 9. Execute purchase (same logic as before)
    const damage = getRandomDamage(target.id)
    const chaos = getChaosAdd()

    store.forceSpendMoney(target.price)
    store.attackCount++
    store.totalDamage += damage
    store.addChaos(chaos)
    store.lastPurchaseEmoji = target.emoji
    store.lastPurchaseCategory = target.category
    store.purchaseImpactTrigger++
    store.showRedFlash = true
    setTimeout(() => { store.showRedFlash = false }, 300)

    // 10. Confirm (closes dialog, refreshes shop)
    onConfirmPurchase()

    purchaseCount++
    console.log(`[AI Takeover] Purchase #${purchaseCount}, chaosLevel: ${Math.round(store.chaosLevel)}`)

    // 11. Trigger blackout when threshold reached, keep cursor moving
    if (store.chaosLevel >= CHAOS_THRESHOLD && !store.blackout) {
      console.log(`[AI Takeover] Chaos threshold reached after ${purchaseCount} bursts, triggering blackout`)
      store.blackout = true
    }

    // 12. Short pause before next cycle
    await delay(getPause())

    // 13. Next cycle (stops naturally when stage changes to 5)
    purchaseCycle()
  }

  function startTakeover() {
    if (store.aiTakeover) return
    console.log('[AI Takeover] Starting takeover, current chaosLevel:', store.chaosLevel)
    store.aiTakeover = true
    purchaseCount = 0
    stopRequested = false
    startTime = Date.now()
    cursorVisible.value = true
    crazyTexts.value = []

    // Start from random position near top-left
    cursorX.value = Math.random() * 200 + 50
    cursorY.value = Math.random() * 200 + 100

    // Red text timer
    let msgIndex = 0
    crazyTextTimer = setInterval(() => {
      if (stopRequested || store.stage !== 4) {
        if (crazyTextTimer) clearInterval(crazyTextTimer)
        return
      }
      const msg = crazyMessages[msgIndex % crazyMessages.length] ?? ''
      if (!msg) return
      crazyTexts.value = [...crazyTexts.value, msg]
      msgIndex++
      // Remove after fade out (3s total: 0.5s in, 2s show, 0.5s out)
      setTimeout(() => {
        crazyTexts.value = crazyTexts.value.filter((t) => t !== msg)
      }, 3000)
    }, CRAZY_TEXT_INTERVAL)

    // Brief initial delay before first move
    setTimeout(() => purchaseCycle(), 500)
  }

  function stopTakeover() {
    stopRequested = true
    cursorVisible.value = false
    if (crazyTextTimer) { clearInterval(crazyTextTimer); crazyTextTimer = null }
    crazyTexts.value = []
  }

  return { startTakeover, stopTakeover, setCallbacks, cursorX, cursorY, cursorClicking, cursorVisible, cursorMoveDuration, crazyTexts }
}
