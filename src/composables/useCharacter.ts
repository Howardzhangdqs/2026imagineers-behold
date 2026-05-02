import { useGameStore } from '@/stores/game'
import type { Character as CharacterType } from '@/types'

export function useCharacter() {
  const store = useGameStore()

  function getActiveCharacters(): CharacterType[] {
    return store.activeCharacters
  }

  function addCharacter(character: CharacterType) {
    if (!store.activeCharacters.find((c) => c.id === character.id)) {
      store.activeCharacters.push(character)
    }
  }

  function removeCharacter(characterId: string) {
    store.activeCharacters = store.activeCharacters.filter((c) => c.id !== characterId)
  }

  function clearAll() {
    store.activeCharacters = []
  }

  return { getActiveCharacters, addCharacter, removeCharacter, clearAll }
}
