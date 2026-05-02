import type { AudioConfig } from '@/types'

export const audioConfig: AudioConfig = {
  bgm: {
    '1': 'bgm_stage1',
    '2': 'bgm_stage1',
    '3': 'bgm_stage3',
    '4': 'bgm_stage4',
  },
  sfx: {
    pop: 'pop',
    buy: 'buy',
    attack: 'attack',
    counter: 'counter',
    cash: 'cash',
    stageTransition: 'stage_transition',
    endingFreeze: 'ending_freeze',
  },
}

export const audioFiles: Record<string, string> = {
  bgm_stage1: 'bgm_stage1.mp3',
  bgm_stage3: 'bgm_stage3.mp3',
  bgm_stage4: 'bgm_stage4.mp3',
  pop: 'pop.mp3',
  buy: 'buy.mp3',
  attack: 'attack.mp3',
  counter: 'counter.mp3',
  cash: 'cash.mp3',
  stage_transition: 'stage_transition.mp3',
  ending_freeze: 'ending_freeze.mp3',
}

export function getAudioPath(key: string): string {
  const filename = audioFiles[key]
  if (!filename) return ''
  return new URL(`@/assets/audio/${filename}`, import.meta.url).href
}
