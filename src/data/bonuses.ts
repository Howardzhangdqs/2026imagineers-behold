import type { InventoryItem } from '@/types'

const bonusStories: Record<string, string[]> = {
  bread: [
    '你录了一段"一分钟吃完一整片干面包不喝水"的挑战视频，全网播放量破千万！获得{amount}阿元流量分成',
    '你发明的"面包蘸牛奶"新吃法被美食博主争相转载，获得{amount}阿元品牌推广费',
  ],
  milk: [
    '你用牛奶自制的护肤配方被美妆博主推荐，获得{amount}阿元广告合作费',
    '你拍的"牛奶拉花教程"在短视频平台爆了，获得{amount}阿元课程收入',
  ],
  eggs: [
    '你的"鸡蛋的一百种做法"系列视频收官，获得{amount}阿元平台签约费',
    '你的"单手打鸡蛋"绝技被综艺节目看中，获得{amount}阿元出场费',
  ],
  toilet_paper: [
    '你的"卷纸时装秀"视频走红网络，获得{amount}阿元纸巾品牌赞助',
    '你的"一卷纸的100种用法"系列收官，获得{amount}阿元出版社稿费',
  ],
  detergent: [
    '你的"洗衣液泡泡艺术"创作视频爆火，获得{amount}阿元广告收入',
    '你发明的"泡泡洗涤法"获得了专利，转让费{amount}阿元',
  ],
  snack: [
    '你举办的"薯片品鉴大会"获得了社区冠军，奖金{amount}阿元',
    '你的"薯片新吃法"视频播放量破百万，获得{amount}阿元流量分成',
  ],
  instant_noodle: [
    '你的"泡面满汉全席"视频上了热搜，获得{amount}阿元美食节目邀约费',
    '你的"三分钟泡面挑战"被综艺节目看中，获得{amount}阿元出场费',
  ],
  cola: [
    '你的"可乐喷泉实验"视频走红，获得{amount}阿元科学频道签约费',
    '你的可乐盲测视频被饮料品牌看中，获得{amount}阿元代言费',
  ],
  lphone: [
    '你的"lPhone深度评测"播放量破千万，获得{amount}阿元流量分成',
    '你的lPhone摄影作品获得了手机摄影大赛奖项，奖金{amount}阿元',
  ],
  three_body: [
    '你的"3体 Galaxy极限测试"视频爆火，获得{amount}阿元科技频道签约费',
    '你的3体手机摄影作品获了国际大奖，奖金{amount}阿元',
  ],
  java_phone: [
    '你的"爪哇大神暴力测试"视频火了，获得{amount}阿元流量分成',
    '你的爪哇大神长测报告被科技媒体转载，获得{amount}阿元稿费',
  ],
  dami_note: [
    '你的"大麦Note开箱"视频播放量破百万，获得{amount}阿元平台分成',
    '你发现的大麦手机彩蛋被官方转发，获得{amount}阿元社区奖励',
  ],
  _generic: [
    '你路边表演才艺被围观群众疯狂打赏，获得{amount}阿元',
    '你参加了社区幸运抽奖，意外中了{amount}阿元大奖',
    '你帮邻居找回走失的猫，获得了{amount}阿元感谢费',
    '你的旧物在二手平台卖出了好价钱，入账{amount}阿元',
    '你参加了商场举办的抽奖活动，中了{amount}阿元购物券',
    '你写的网文突然爆火，获得{amount}阿元签约费',
    '你的宠物猫突然成了网红，广告收入{amount}阿元',
  ],
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export function generateBonusDescription(inventory: InventoryItem[], amount: number): string {
  if (inventory.length === 0) {
    return pick(bonusStories._generic!).replace('{amount}', String(amount))
  }
  const item = pick(inventory)
  const stories = bonusStories[item.productId] ?? bonusStories._generic!
  return pick(stories).replace('{amount}', String(amount))
}
