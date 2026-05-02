import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { GameStage, InventoryItem, Character as CharacterType } from '@/types'
import { INITIAL_WALLET } from '@/data/stageConfig'

export const useGameStore = defineStore('game', () => {
  const stage = ref<GameStage>(1)
  const elapsed = ref(0)
  const wallet = ref(INITIAL_WALLET)
  const inventory = ref<InventoryItem[]>([])
  const attackCount = ref(0)
  const totalDamage = ref(0)
  const chaosLevel = ref(0)
  const lastPurchaseEmoji = ref<string | null>(null)
  const lastPurchaseCategory = ref<string>('daily')
  const purchaseImpactTrigger = ref(0)
  const lastPurchaseCardPos = ref<{ x: number; y: number } | null>(null)
  const aiTakeover = ref(false)
  const attackPhaseStartElapsed = ref(0)
  const activeCharacters = ref<CharacterType[]>([])
  const stageTransitioning = ref(false)
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const stage4Late = ref(false)
  const showRedFlash = ref(false)
  const selectedProductId = ref<string | null>(null)
  const lastToast = ref('')
  const lastBoughtProductId = ref<string | null>(null)
  const hoveredProductId = ref<string | null>(null)
  const characterTriggers = reactive<Record<string, number>>({})
  const fadeOverlay = ref(false)
  const blackout = ref(false)
  const hiddenCharacterIds = ref<Set<string>>(new Set())
  const defenseEffect = ref<{ emoji: string; name: string; remaining: number } | null>(null)

  function addToInventory(item: InventoryItem) {
    inventory.value.push(item)
    lastBoughtProductId.value = item.productId
  }

  function removeFromInventory(productId: string) {
    const idx = inventory.value.findIndex((i) => i.productId === productId)
    if (idx !== -1) inventory.value.splice(idx, 1)
  }

  function hasItem(productId: string): boolean {
    return inventory.value.some((i) => i.productId === productId)
  }

  function hasDefenseItem(): boolean {
    return inventory.value.some(
      (i) => i.category === 'defense' && i.productId !== 'rational_shield',
    )
  }

  function addMoney(amount: number) {
    wallet.value += amount
  }

  function spendMoney(amount: number): boolean {
    if (wallet.value >= amount) {
      wallet.value -= amount
      return true
    }
    return false
  }

  function forceSpendMoney(amount: number) {
    wallet.value -= amount
  }

  function addChaos(amount: number) {
    chaosLevel.value += amount
  }

  function resetGame() {
    stage.value = 1
    elapsed.value = 0
    wallet.value = INITIAL_WALLET
    inventory.value = []
    attackCount.value = 0
    totalDamage.value = 0
    chaosLevel.value = 0
    lastPurchaseEmoji.value = null
    lastPurchaseCategory.value = 'daily'
    lastPurchaseCardPos.value = null
    purchaseImpactTrigger.value = 0
    aiTakeover.value = false
    attackPhaseStartElapsed.value = 0
    activeCharacters.value = []
    stageTransitioning.value = false
    isPlaying.value = false
    isPaused.value = false
    stage4Late.value = false
    showRedFlash.value = false
    blackout.value = false
    hiddenCharacterIds.value = new Set()
    defenseEffect.value = null
    selectedProductId.value = null
    lastToast.value = ''
    for (const k in characterTriggers) delete characterTriggers[k]
  }

  function saveToLocalStorage() {
    const data = {
      stage: stage.value,
      elapsed: elapsed.value,
      wallet: wallet.value,
      inventory: inventory.value,
      attackCount: attackCount.value,
      totalDamage: totalDamage.value,
      chaosLevel: chaosLevel.value,
      isPlaying: isPlaying.value,
    }
    localStorage.setItem('ayuan-game-state', JSON.stringify(data))
  }

  function loadFromLocalStorage(): boolean {
    const raw = localStorage.getItem('ayuan-game-state')
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      stage.value = data.stage || 1
      elapsed.value = data.elapsed || 0
      wallet.value = data.wallet || INITIAL_WALLET
      inventory.value = data.inventory || []
      attackCount.value = data.attackCount || 0
      totalDamage.value = data.totalDamage || 0
      chaosLevel.value = data.chaosLevel || 0
      isPlaying.value = data.isPlaying || false
      return true
    } catch {
      return false
    }
  }

  function clearSave() {
    localStorage.removeItem('ayuan-game-state')
  }

  return {
    stage,
    elapsed,
    wallet,
    inventory,
    attackCount,
    totalDamage,
    chaosLevel,
    lastPurchaseEmoji,
    lastPurchaseCategory,
    purchaseImpactTrigger,
    lastPurchaseCardPos,
    aiTakeover,
    attackPhaseStartElapsed,
    activeCharacters,
    stageTransitioning,
    isPlaying,
    isPaused,
    stage4Late,
    showRedFlash,
    selectedProductId,
    lastToast,
    lastBoughtProductId,
    hoveredProductId,
    characterTriggers,
    fadeOverlay,
    blackout,
    hiddenCharacterIds,
    defenseEffect,
    addToInventory,
    removeFromInventory,
    hasItem,
    hasDefenseItem,
    addMoney,
    spendMoney,
    forceSpendMoney,
    addChaos,
    resetGame,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearSave,
  }
})
