import { useGameStore } from '@/stores/game'
import { getProductById } from '@/data/products'

export function useWallet() {
  const store = useGameStore()

  function buyItem(productId: string): { success: boolean; message: string } {
    const product = getProductById(productId)
    if (!product) return { success: false, message: '商品不存在' }

    if (store.hasItem(productId)) {
      return { success: false, message: '你已经拥有这个商品了' }
    }

    if (product.category === 'attack') {
      store.forceSpendMoney(product.price)
    } else {
      if (store.wallet < product.price) {
        return { success: false, message: '余额不足' }
      }

      if (!store.spendMoney(product.price)) {
        return { success: false, message: '购买失败' }
      }
    }

    store.addToInventory({
      productId: product.id,
      name: product.name,
      boughtAt: store.elapsed,
      category: product.category,
    })

    return { success: true, message: `成功购买 ${product.name}！` }
  }

  function sellItem(productId: string): { success: boolean; message: string } {
    const item = store.inventory.find((i) => i.productId === productId)
    if (!item) return { success: false, message: '背包中没有此物品' }

    const product = getProductById(productId)
    if (!product) return { success: false, message: '商品不存在' }

    const sellPrice = Math.floor(product.price * 0.5)
    store.removeFromInventory(productId)
    store.addMoney(sellPrice)
    return { success: true, message: `卖出 ${item.name}，获得 ${sellPrice} 阿元` }
  }

  return { buyItem, sellItem }
}
