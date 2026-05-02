import type { Product } from '@/types'

export const products: Product[] = [
  // Stage 1 - Daily items
  { id: 'milk', name: '纯牛奶', price: 12, category: 'daily', description: '新鲜牧场直供纯牛奶', emoji: '🥛', stage: 1, innerThought: '每天一杯奶，强壮中国人~' },
  { id: 'bread', name: '全麦面包', price: 8, category: 'daily', description: '健康全麦切片面包', emoji: '🍞', stage: 1, innerThought: '全麦的很营养，给家人当早餐刚好。' },
  { id: 'toilet_paper', name: '卷纸一提', price: 25, category: 'daily', description: '柔软三层卷纸一提', emoji: '🧻', stage: 1, innerThought: '家里的快用完了，先囤着吧。' },
  { id: 'eggs', name: '鸡蛋一盒', price: 15, category: 'daily', description: '散养土鸡蛋一盒12枚', emoji: '🥚', stage: 1, innerThought: '土鸡蛋营养高，早上煎一个正好。' },
  { id: 'detergent', name: '洗衣液', price: 30, category: 'daily', description: '薰衣草香洗衣液', emoji: '🧴', stage: 1, innerThought: '薰衣草味道好好闻，衣服香香的。' },
  { id: 'snack', name: '薯片大礼包', price: 20, category: 'daily', description: '多口味混合薯片大礼包', emoji: '🍿', stage: 2, innerThought: '晚上追剧的时候吃，爽歪歪！' },
  { id: 'instant_noodle', name: '泡面五连包', price: 18, category: 'daily', description: '经典牛肉面五连包', emoji: '🍜', stage: 2, innerThought: '加班回来懒得做饭，泡一碗刚好。' },
  { id: 'cola', name: '可乐一箱', price: 22, category: 'daily', description: '冰爽可乐24罐装', emoji: '🥤', stage: 2, innerThought: '夏天冰箱里怎么能没有可乐呢？' },

  // Stage 3 - Phones
  { id: 'lphone', name: 'lPhone', price: 800, category: 'phone', description: '封闭系统，拍照王者', emoji: '📱', stage: 3, innerThought: '拍照好看，系统顺畅，贵是贵了点但值得。' },
  { id: 'three_body', name: '3体 Galaxy', price: 650, category: 'phone', description: '跑分高还不限速', emoji: '📱', stage: 3, innerThought: '参数是真的猛，性价比也高，自由度高！' },
  { id: 'java_phone', name: '爪哇大神', price: 600, category: 'phone', description: '稳定耐用的国民手机', emoji: '📱', stage: 3, innerThought: '性价比高，皮实耐用，用个三五年没问题。' },
  { id: 'dami_note', name: '大麦 Note', price: 500, category: 'phone', description: '性价比之王，1999交个朋友', emoji: '📱', stage: 3, innerThought: '这价格还要什么自行车？交个朋友！' },

  // Stage 3-4 Attack items (kept for stage 3 compatibility)
  { id: 'label_sticker', name: '智商税标签粘贴器', price: 200, category: 'attack', description: '给对手贴标签', emoji: '🏷️', stage: 3, innerThought: '只要你给他们贴上标签，你就赢了。' },
  { id: 'team_stick', name: '站队荧光棒', price: 150, category: 'attack', description: '选择阵营的入门道具', emoji: '🪄', stage: 3, innerThought: '选个阵营站进去，心里踏实多了。' },

  // Stage 4 - Cars (brand satire)
  { id: 'tailunsi', name: '泰伦斯 T-7', price: 8000, category: 'car', description: '全栈自研智能座驾，OTA随时更新', emoji: '🏎️', stage: 4, innerThought: '科技感真的拉满了，开上它感觉像在开飞船！', attackDamage: 0 },
  { id: 'biaoyue', name: '标越 BY-5', price: 3000, category: 'car', description: '刀片电池安全无忧，国货之光', emoji: '🚗', stage: 4, innerThought: '国货之光！安全又靠谱，开出去有面子。', attackDamage: 0 },
  { id: 'bomu', name: '柏慕 BM-3', price: 7000, category: 'car', description: '纯粹驾趣，后驱标杆', emoji: '🚙', stage: 4, innerThought: '操控感无敌，每个弯道都是享受！', attackDamage: 0 },
  { id: 'licheng', name: '里程 L-6', price: 5000, category: 'car', description: '移动的家，冰箱彩电大沙发', emoji: '🚐', stage: 4, innerThought: '一家人坐里面太舒服了，真的是移动的家！', attackDamage: 0 },
  { id: 'mida', name: '觅达 S-1', price: 4000, category: 'car', description: '生态互联，年轻人的第一台智能车', emoji: '⚡', stage: 4, innerThought: '手机遥控开车门，万物互联真方便！', attackDamage: 0 },
  { id: 'zhonghan', name: '众瀚 Z-1', price: 1500, category: 'car', description: '外观大气，价格实在', emoji: '🛵', stage: 4, innerThought: '这价位能做到这外观，真的很值！', attackDamage: 0 },

  // Stage 4 - Accessories (phase 2)
  { id: 'floor_mat', name: '全包围脚垫', price: 80, category: 'accessory', description: '防水防泥全包围脚垫', emoji: '🟫', stage: 4, innerThought: '脏了就冲水，比洗车便宜多了。' },
  { id: 'seat_cover', name: '品牌座套', price: 120, category: 'accessory', description: '透气冰丝四季通用座套', emoji: '💺', stage: 4, innerThought: '夏天不烫屁股，冬天不冻屁股。' },
  { id: 'dash_cam', name: '行车记录仪', price: 200, category: 'accessory', description: '4K高清夜视行车记录仪', emoji: '📷', stage: 4, innerThought: '碰瓷克星，有它心里踏实。' },
  { id: 'phone_mount', name: '磁吸手机支架', price: 50, category: 'accessory', description: '强力磁吸手机支架', emoji: '📱', stage: 4, innerThought: '导航必备，不用低头看手机了。' },
  { id: 'car_freshener', name: '车载香薰', price: 60, category: 'accessory', description: '固体香薰持久留香', emoji: '🌸', stage: 4, innerThought: '新车味太重，熏一熏就好了。' },
  { id: 'window_tint', name: '隔热贴膜', price: 150, category: 'accessory', description: '前挡隔热防晒贴膜', emoji: '🪟', stage: 4, innerThought: '夏天不变成烤箱，全靠这层膜。' },

  // Stage 4 - Attack items (phase 3)
  { id: 'brand_horn', name: '品牌粉丝大喇叭', price: 150, category: 'attack', description: '循环播放品牌口号扰敌', emoji: '📣', stage: 4, innerThought: '我家品牌天下第一！不接受反驳！', attackDamage: 150, attackDamageMin: 80, attackDamageMax: 180 },
  { id: 'sarcastic_voice', name: '阴阳怪气语音包', price: 100, category: 'attack', description: '自动生成阴阳怪气评论', emoji: '🎤', stage: 4, innerThought: '不直接骂，但每句话都让人不舒服。', attackDamage: 100, attackDamageMin: 50, attackDamageMax: 150 },
  { id: 'screenshot_cutter', name: '断章取义截图器', price: 300, category: 'attack', description: '截取片段制造舆论', emoji: '✂️', stage: 4, innerThought: '截一半的话，意思就完全不一样了呢。', attackDamage: 250, attackDamageMin: 150, attackDamageMax: 350 },
  { id: 'block_card', name: '拉黑威胁卡', price: 200, category: 'attack', description: '威胁拉黑制造心理压力', emoji: '🚫', stage: 4, innerThought: '不跟我一队的人，直接拉黑就好了。', attackDamage: 180, attackDamageMin: 100, attackDamageMax: 260 },
  { id: 'moral_rope', name: '道德绑架绳索', price: 250, category: 'attack', description: '"你开那破车，你对得起家人吗？"', emoji: '🪢', stage: 4, innerThought: '用道德压人，对方再有理也说不出话来。', attackDamage: 200, attackDamageMin: 120, attackDamageMax: 280 },
  { id: 'old_account_glass', name: '翻旧账放大镜', price: 350, category: 'attack', description: '翻出对方品牌黑历史攻击', emoji: '🔍', stage: 4, innerThought: '谁的品牌还没点黑历史呢？', attackDamage: 300, attackDamageMin: 180, attackDamageMax: 420 },
  { id: 'water_army', name: '水军刷评团', price: 500, category: 'attack', description: '雇佣水军刷差评轰炸', emoji: '🤖', stage: 4, innerThought: '买500条差评只要500块，划算！', attackDamage: 400, attackDamageMin: 250, attackDamageMax: 550 },
  { id: 'persona_destroyer', name: '车主人设崩塌器', price: 800, category: 'attack', description: '黑入对方社交媒体全方位攻击', emoji: '💥', stage: 4, innerThought: '连你开什么车都要管，管得真宽。', attackDamage: 600, attackDamageMin: 400, attackDamageMax: 800 },
  { id: 'mob_summon', name: '群体围攻召集令', price: 600, category: 'attack', description: '召唤一群品牌铁粉围攻', emoji: '📢', stage: 4, innerThought: '一群人骂总比一个人骂效率高！', attackDamage: 500, attackDamageMin: 300, attackDamageMax: 700 },
  { id: 'brand_riot', name: '品牌大战挑拨器', price: 700, category: 'attack', description: '同时激怒两个品牌粉丝互掐', emoji: '🔥', stage: 4, innerThought: '让他们打起来，我坐山观虎斗。', attackDamage: 550, attackDamageMin: 350, attackDamageMax: 750 },

  // Defense items
  { id: 'rational_shield', name: '理性护盾', price: 0, category: 'defense', description: '初始防御道具', emoji: '🛡️', stage: 4, innerThought: '理性是最坚固的防线。' },
  { id: 'zen_headphone', name: '佛系耳机', price: 600, category: 'defense', description: '使用后30秒内免疫攻击', emoji: '🎧', stage: 4, innerThought: '戴上耳机，世界清净了，谁也骂不到我。' },
  { id: 'shutup_redpack', name: '闭嘴红包', price: 300, category: 'defense', description: '让一个小人暂时消失', emoji: '🧧', stage: 4, innerThought: '花点小钱让他们闭嘴，多省心。' },
]

export function getProductsByStage(stage: number): Product[] {
  return products.filter((p) => {
    if (p.stage > stage) return false
    if (p.stage < stage && stage >= 4) return true
    if (p.stage === stage) return true
    if (p.stage < stage && p.stage <= 2) return stage >= 2
    return p.stage <= stage
  })
}

export function getCurrentStageProducts(stage: number): Product[] {
  if (stage === 1) return products.filter((p) => p.stage === 1)
  if (stage === 2) return products.filter((p) => p.stage <= 2)
  if (stage === 3) return products.filter((p) => p.stage === 3 && p.category === 'phone')
  return []
}

export function getStage4Products(hasCar: boolean, accessoryCount: number, revealedAttackIds: string[] = []): Product[] {
  if (!hasCar) return products.filter((p) => p.stage === 4 && p.category === 'car')
  if (accessoryCount === 0) return products.filter((p) => p.stage === 4 && p.category === 'accessory')
  const accessories = products.filter((p) => p.stage === 4 && p.category === 'accessory')
  const attackItems = products.filter((p) => p.stage === 4 && p.category === 'attack' && revealedAttackIds.includes(p.id))
  return [...accessories, ...attackItems]
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getRandomDamage(productId: string): number {
  const product = getProductById(productId)
  if (!product) return 0
  const min = product.attackDamageMin ?? product.attackDamage ?? 100
  const max = product.attackDamageMax ?? product.attackDamage ?? 200
  return Math.floor(Math.random() * (max - min + 1)) + min
}
