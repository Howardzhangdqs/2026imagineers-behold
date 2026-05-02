import { useGameStore } from '@/stores/game'
import { getProductById } from '@/data/products'

export function useInventory() {
  const store = useGameStore()

  function useItem(productId: string): { success: boolean; message: string } {
    const item = store.inventory.find((i) => i.productId === productId)
    if (!item) return { success: false, message: '背包中没有此物品' }

    const product = getProductById(productId)
    if (!product) return { success: false, message: '商品不存在' }

    if (item.category === 'attack') {
      store.attackCount++
      const damage = Math.floor(Math.random() * 200) + 50
      store.totalDamage += damage
      store.addChaos(Math.floor(damage / 10))
      store.lastToast = `使用 ${item.name}，造成 ${damage} 点伤害！`

      store.removeFromInventory(productId)
      return { success: true, message: store.lastToast }
    }

    if (item.category === 'defense' && productId === 'zen_headphone') {
      store.removeFromInventory(productId)
      hideAllCharacters(product.emoji, product.name, 5)
      return { success: true, message: '佛系耳机已使用，所有角色暂时消失！' }
    }

    if (item.category === 'defense' && productId === 'shutup_redpack') {
      store.removeFromInventory(productId)
      hideAllCharacters(product.emoji, product.name, 5)
      return { success: true, message: '闭嘴红包已使用，所有角色暂时消失！' }
    }

    if (item.category === 'defense' && productId === 'rational_shield') {
      hideAllCharacters(product.emoji, product.name, 5)
      return { success: true, message: '理性护盾激活，所有角色暂时消失！' }
    }

    return { success: false, message: '此物品无法使用' }
  }

  function hideAllCharacters(emoji: string, name: string, seconds: number) {
    const ids = store.activeCharacters.map((c) => c.id)
    store.hiddenCharacterIds = new Set(ids)
    store.defenseEffect = { emoji, name, remaining: seconds }

    console.log(`[Defense] ${name} activated, hiding ${ids.length} characters for ${seconds}s`)

    const interval = setInterval(() => {
      if (!store.defenseEffect) {
        clearInterval(interval)
        return
      }
      store.defenseEffect = { ...store.defenseEffect, remaining: store.defenseEffect.remaining - 1 }
      if (store.defenseEffect.remaining <= 0) {
        store.hiddenCharacterIds = new Set()
        store.defenseEffect = null
        clearInterval(interval)
      }
    }, 1000)
  }

  function getAttackItems() {
    return store.inventory.filter((i) => i.category === 'attack')
  }

  function getDefenseItems() {
    return store.inventory.filter((i) => i.category === 'defense')
  }

  return { useItem, getAttackItems, getDefenseItems }
}
