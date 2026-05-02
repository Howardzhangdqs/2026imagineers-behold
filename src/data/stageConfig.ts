import type { StageConfig } from '@/types'

export const stageConfigs: Record<number, StageConfig> = {
  1: {
    timeThreshold: 25,
    nextStage: 2,
    eventTrigger: '首次购买完成',
    bonusMoney: 0,
    bonusDescription: '',
  },
  2: {
    timeThreshold: 50,
    nextStage: 3,
    eventTrigger: '第二次购买 / hover 第二件商品',
    bonusMoney: 100,
    bonusDescription: '',
  },
  3: {
    timeThreshold: 85,
    nextStage: 4,
    eventTrigger: '购买手机 OR 购买"立场小道具"',
    bonusMoney: 600,
    bonusDescription: '',
  },
  4: {
    timeThreshold: 110,
    nextStage: 5,
    eventTrigger: 'attackCount >= 5 OR totalDamage >= 1000',
    bonusMoney: 2000,
    bonusDescription: '',
  },
}

export const MAX_TIME = 120

export const INITIAL_WALLET = 100

export const STAGE_NAMES: Record<number, string> = {
  1: '日用品',
  2: '日用品',
  3: '数码',
  4: '车市',
  5: '反思',
}
