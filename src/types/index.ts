export interface Product {
  id: string
  name: string
  price: number
  category: 'daily' | 'phone' | 'car' | 'accessory' | 'attack' | 'defense'
  description: string
  emoji: string
  stage: number
  innerThought: string
  attackDamage?: number
  attackDamageMin?: number
  attackDamageMax?: number
}

export interface InventoryItem {
  productId: string
  name: string
  boughtAt: number
  category: 'daily' | 'phone' | 'car' | 'accessory' | 'attack' | 'defense'
}

export interface CharacterLine {
  text: string
  condition?: { boughtProductIds?: string[]; notBoughtProductIds?: string[] }
}

export interface Character {
  id: string
  name: string
  position: 'left' | 'right' | 'bottom'
  avatar: string
  faction?: 'eco' | 'traditional' | 'neutral'
  bubbleColor: 'green' | 'yellow' | 'red'
  lines: CharacterLine[]
  fallbackLines: string[]
  goodbyeLines: string[]
  chaosFallbackLines?: { minChaos: number; lines: string[] }[]
  enterDelay: number
  stage: number
}

export interface StageConfig {
  timeThreshold: number
  nextStage: number
  eventTrigger: string
  bonusMoney: number
  bonusDescription: string
}

export interface AudioConfig {
  bgm: Record<string, string>
  sfx: Record<string, string>
}

export type GameStage = 1 | 2 | 3 | 4 | 5

export interface GameState {
  stage: GameStage
  elapsed: number
  wallet: number
  inventory: InventoryItem[]
  attackCount: number
  totalDamage: number
  chaosLevel: number
  aiTakeover: boolean
  characters: Character[]
  stageTransitioning: boolean
  isPlaying: boolean
  isPaused: boolean
}
