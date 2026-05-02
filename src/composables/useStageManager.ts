import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'
import { generateBonusDescription } from '@/data/bonuses'
import type { GameStage } from '@/types'

const PHONE_MAX_PRICE = 800
const CAR_STAGE_MIN = 4350
const BUFFER_MIN = 10
const BUFFER_MAX = 20

export function getTargetWallet(targetStage: GameStage): number {
  const base = targetStage >= 4 ? CAR_STAGE_MIN : PHONE_MAX_PRICE
  return base + BUFFER_MIN + Math.floor(Math.random() * (BUFFER_MAX - BUFFER_MIN + 1))
}

const sceneRoutes: Partial<Record<number, string>> = {
  3: '/scene/2to3',
  4: '/scene/3to4',
}

export function useStageManager() {
  const store = useGameStore()
  const router = useRouter()

  function checkStageTransition() {
    if (store.stageTransitioning) return
    if (store.stage >= 5) return

    let eventTrigger = false

    switch (store.stage) {
      case 1:
        eventTrigger = store.inventory.length >= 2
        break
      case 2:
        eventTrigger = store.inventory.length >= 4
        break
      case 3:
        eventTrigger = store.inventory.some((i) => i.category === 'phone')
        break
      case 4:
        // Stage 4 only exits via AI takeover → blackout → Stage 5 path
        eventTrigger = false
        break
    }

    if (eventTrigger) {
      transitionToStage((store.stage + 1) as GameStage)
    }
  }

  function transitionToStage(targetStage: GameStage) {
    if (store.stageTransitioning) return
    store.stageTransitioning = true

    store.activeCharacters.splice(0)

    const target = getTargetWallet(targetStage)
    const deficit = Math.max(0, target - store.wallet)

    if (deficit > 0) {
      const description = generateBonusDescription(store.inventory, deficit)
      store.addMoney(deficit)
      store.lastToast = description
    }

    const sceneRoute = sceneRoutes[targetStage]
    if (sceneRoute) {
      store.fadeOverlay = true
      setTimeout(() => {
        store.stage = targetStage
        router.push(sceneRoute)
      }, 1500)
    } else {
      store.stage = targetStage
      router.push(`/stage/${targetStage}`)
      store.stageTransitioning = false
    }
  }

  function completeTransition(targetStage: GameStage) {
    router.push(`/stage/${targetStage}`)
    store.fadeOverlay = false
    store.stageTransitioning = false
  }

  function triggerStage4Late() {
    if (store.stage === 4 && !store.stage4Late) {
      store.stage4Late = true
    }
  }

  return { checkStageTransition, transitionToStage, completeTransition, triggerStage4Late }
}
