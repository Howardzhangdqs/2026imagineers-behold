# 阿原的普通市场 —— 详细实现计划

## 一、技术栈

| 层面     | 选型                                                    |
| -------- | ------------------------------------------------------- |
| 框架     | Vue 3 + Composition API                                 |
| 构建     | Vite                                                    |
| 状态管理 | Vue Ref                                                 |
| 样式     | Tailwind CSS（布局/工具类） + 原生 CSS（动画/视觉效果） |
| 音效     | Howler.js                                               |
| 持久化   | localStorage                                            |
| 部署     | 静态托管（GitHub Pages / Vercel）                       |

---

## 二、游戏状态机

```
Stage 1 ──(首次购买)──→ Stage 2 ──(第二次购买/hover)──→ Stage 3 ──(买手机/买攻击道具)──→ Stage 4 ──(攻击5次/伤害>1000/时间到)──→ Stage 5
   │                        │                                      │                                        │
   └─ 时间≥25s 也触发 ──────┘── 时间≥50s 也触发 ─────────────────┘── 时间≥85s 也触发 ──────────────────────┘── 时间≥110s 也触发
```

阶段转换条件（双触发：事件 OR 时间）：

| 转换 | 事件触发                                | 时间触发        |
| ---- | --------------------------------------- | --------------- |
| 1→2  | 首次购买完成                            | elapsed >= 25s  |
| 2→3  | 第二次购买 / hover 第二件商品           | elapsed >= 50s  |
| 3→4  | 购买手机 OR 购买"立场小道具"            | elapsed >= 85s  |
| 4→5  | attackCount >= 5 OR totalDamage >= 1000 | elapsed >= 110s |

---

## 三、数据结构

### Pinia Store

```typescript
interface GameState {
  stage: 1 | 2 | 3 | 4 | 5
  elapsed: number
  wallet: number
  inventory: InventoryItem[]
  attackCount: number
  totalDamage: number
  factionDamage: { eco: number; traditional: number }
  characters: Character[]
  stageTransitioning: boolean
}

interface InventoryItem {
  productId: string
  name: string
  boughtAt: number
  category: 'daily' | 'phone' | 'car' | 'attack' | 'defense'
}

interface Product {
  id: string
  name: string
  price: number
  category: 'daily' | 'phone' | 'car' | 'attack' | 'defense'
  description: string
  emoji: string
  stage: number
}

interface Character {
  id: string
  name: string
  position: 'left' | 'right' | 'top' | 'bottom'
  avatar: string
  faction?: 'eco' | 'traditional' | 'neutral'
  bubbleColor: 'green' | 'yellow' | 'red'
  lines: string[]
  enterDelay: number
  stage: number
}
```

---

## 四、项目结构

```
src/
├── App.vue
├── main.ts
├── style.css                    # Tailwind 导入 + 全局 CSS 动画 @keyframes
│
├── composables/
│   ├── useGameTimer.ts          # setInterval 计时器，每秒更新 elapsed
│   ├── useStageManager.ts       # 监听 elapsed + 事件，控制 stage 转换
│   ├── useWallet.ts             # 余额增减、阶段赠送阿元
│   ├── useInventory.ts          # 背包 CRUD，支持使用/卖出
│   ├── useAudio.ts              # 封装 Howler.js，BGM + 音效
│   └── useCharacter.ts          # 管理活跃小人列表，入场/退场
│
├── stores/
│   └── game.ts                  # Pinia 全局状态
│
├── data/
│   ├── products.ts              # 各阶段商品定义
│   ├── characters.ts            # 各阶段角色及台词
│   ├── stageConfig.ts           # 阶段转换条件、时间阈值、赠送金额
│   └── audioConfig.ts           # 音效路径映射
│
├── components/
│   ├── GameController.vue       # 顶层：计时器、阶段切换逻辑
│   ├── HUD/
│   │   ├── WalletDisplay.vue    # 阿元余额显示
│   │   ├── FactionBar.vue       # 阵营伤害对比条（Stage 4）
│   │   └── StageTabs.vue        # "日用品" "数码" "车市" 标签
│   ├── Shop/
│   │   ├── ShopView.vue         # 主商店区域
│   │   ├── ProductCard.vue      # 单个商品卡片
│   │   └── PurchaseDialog.vue   # 购买确认弹窗
│   ├── Character/
│   │   ├── CharacterLayer.vue   # 绝对定位层，管理所有小人
│   │   ├── Character.vue        # 单个探头小人
│   │   └── SpeechBubble.vue     # 对话气泡
│   ├── AttackAnimation.vue      # 攻击道具使用动画
│   ├── InventoryPanel.vue       # 背包面板
│   ├── UIBreakdownOverlay.vue   # Stage 4 涂鸦/崩坏效果层
│   └── EndingScreen.vue         # Stage 5 反思定格
│
├── assets/
│   ├── images/                  # 素材图片（正式素材替换占位图即可）
│   │   ├── characters/          # 卡通小人头像/半身
│   │   ├── products/            # 商品图标
│   │   ├── graffiti/            # 涂鸦 / 崩坏素材
│   │   ├── backgrounds/         # 各阶段背景图
│   │   └── effects/             # 攻击/状态特效
│   └── audio/                   # 音效（同上，占位→正式）
│       ├── bgm.mp3
│       ├── pop.mp3
│       ├── buy.mp3
│       ├── attack.mp3
│       └── cash.mp3
│
└── types/
    └── index.ts                 # TypeScript 类型定义

scripts/
└── generate_placeholders.py     # 占位素材生成脚本（Pillow）
```

---

## 五、组件架构

```
App.vue
├── GameController.vue
│   ├── HUD.vue
│   │   ├── WalletDisplay.vue
│   │   ├── FactionBar.vue        (Stage 4 才显示)
│   │   └── StageTabs.vue
│   ├── ShopView.vue
│   │   ├── ProductCard.vue *N
│   │   └── PurchaseDialog.vue
│   ├── CharacterLayer.vue
│   │   └── Character.vue *N
│   │       └── SpeechBubble.vue
│   ├── AttackAnimation.vue       (Stage 4)
│   ├── InventoryPanel.vue
│   ├── UIBreakdownOverlay.vue    (Stage 4)
│   └── EndingScreen.vue          (Stage 5)
```

---

## 六、各阶段详细实现方案

### Stage 1：日用品商店 (0-25s)

| 元素         | 实现方式                                                    |
| ------------ | ----------------------------------------------------------- |
| 商品卡片网格 | Tailwind `grid grid-cols-3 gap-4`                           |
| 背景音乐     | Howler.js 播放 BGM，`volume: 0.3`                           |
| 购买确认     | `PurchaseDialog.vue`，Vue `<Transition>` + CSS `scale` 入场 |
| 系统提示     | 底部 toast，CSS `translateY` + `opacity` 淡入淡出           |
| 引导文字     | CSS `animation: fadeIn 2s ease`                             |

商品列表：
- 纯牛奶（12 阿元）
- 全麦面包（8 阿元）
- 卷纸一提（25 阿元）
- 鸡蛋一盒（15 阿元）
- 洗衣液（30 阿元）

### Stage 2：第二次购买 + 探头 (25-50s)

| 元素         | 实现方式                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------- |
| 探头小人     | `Character.vue`，CSS `@keyframes slideInFromRight`，`translateX(100%)` → `translateX(0)` |
| 气泡对话框   | `SpeechBubble.vue`，CSS `@keyframes popIn`（`scale(0)` → `scale(1)`），绿色背景          |
| "啵"音效     | Howler.js 播放短音效                                                                     |
| 点击小人交互 | `@click` 触发下一条对话                                                                  |

角色：健身教练朋友（右侧探头）
台词：
1. "又买鸡蛋？上周不是说鸡蛋胆固醇高吗？"
2. "我只是说说，你买你的~"

### Stage 3：手机入场 + 阵营分化 (50-85s)

| 元素             | 实现方式                                                   |
| ---------------- | ---------------------------------------------------------- |
| 标签出现         | `StageTabs.vue`，CSS `@keyframes slideDown`                |
| 三个小人同时探头 | `CharacterLayer.vue` 各自 `enterDelay` 错开 200ms          |
| 气泡颜色分化     | 黄色 `#FFF2CC`，`SpeechBubble.vue` 接收 `bubbleColor` prop |
| "立场小道具"入口 | CSS `opacity: 0.6` + hover `opacity: 1`                    |
| 意外收入弹窗     | Vue `<Transition>` 弹窗                                    |

手机商品：
- lPhone（800 阿元）
- 3体 Galaxy（650 阿元）
- 爪哇大神（600 阿元）
- 大麦 Note（500 阿元）

攻击道具：
- 【扣帽子】智商税标签粘贴器（200 阿元）
- 站队荧光棒（150 阿元）— 选择阵营的入门道具

角色（4个）：
1. 左一（戴眼镜极客）："lPhone 系统封闭，交智商税！不如3体，跑分高还不限速。"
2. 右一（时尚达人）："可是lPhone拍照好看啊，你买手机不就图个开心？人家花钱关你啥事。"
3. 下方（吃瓜群众）："哎哟，又吵起来了，我啃个瓜。"
4. 左下角（大麦粉）："大麦Note性价比碾压你们，1999交个朋友懂不懂？"

### Stage 4：车市 + UI崩坏 (85-110s)

| 元素         | 实现方式                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **UI崩坏**   | `UIBreakdownOverlay.vue`：SVG `feTurbulence` + `feDisplacementMap` 滤镜逐步增强；预制涂鸦 SVG，`clip-path` 从中心扩展；CSS `filter: hue-rotate()` 随时间变化 |
| 6+个小人弹幕 | `CharacterLayer.vue` 渲染 6-8 个，红色气泡，CSS `@keyframes barrage` 从各方向飞入                                                                            |
| 阵营分界线   | `FactionBar.vue`，CSS `transition: width 0.5s` 实时更新比例                                                                                                  |
| 攻击道具货架 | `ProductCard.vue` 复用，红色边框样式                                                                                                                         |
| 攻击动画     | `AttackAnimation.vue`，CSS `@keyframes throwHat`                                                                                                             |
| 反弹伤害     | toast 提示，CSS 红色闪烁 `@keyframes flashRed`                                                                                                               |
| 防御道具卖出 | 背包 item 点击"卖出"，Howler.js 收银音效                                                                                                                     |

汽车商品：
- 油车荣耀（5000 阿元）
- 纯电未来（7000 阿元）
- 混动折中（4000 阿元）
- 越野硬汉（9000 阿元）
- 老年代步车（1500 阿元）— 便宜但容易被攻击"开这玩意上路？"
- 超跑幻影（12000 阿元）— 奢侈品，买了直接被围攻

攻击道具：
- 阴阳怪气语音包（100 阿元）
- 断章取义截图器（300 阿元）
- 拉黑威胁卡（200 阿元）
- 人设崩塌生成器（800 阿元）
- 道德绑架绳索（250 阿元）— "你开油车，你对得起孩子吗？"
- 翻旧账放大镜（350 阿元）— 翻出对方曾经买过的商品或者说过的话来攻击
- 群体围攻召集令（500 阿元）— 一次召唤3个小人围攻
- 反向歧视盾刺（400 阿元）— 反弹攻击+追加伤害

防御道具：
- 理性护盾（系统初期赠送，可 800 阿元卖出）
- 佛系耳机（600 阿元）— 使用后30秒内免疫攻击
- 闭嘴红包（300 阿元）— 花300阿元让一个小人暂时消失

角色（10个+）：
- 环保阵营：极光少女、碳足迹大叔、零浪费妈妈
- 传统阵营：老司机老王、机械情怀小哥、油味硬汉
- 中立/吃瓜：佛系观察员、搬运工小编、热度猎人、路人甲乙丙

### Stage 5：反思定格 (110-120s 或攻击5次后)

| 元素       | 实现方式                                                                             |
| ---------- | ------------------------------------------------------------------------------------ |
| 画面静止   | 所有 CSS `animation-play-state: paused`                                              |
| 老照片滤镜 | 根元素 `filter: sepia(0.8) saturate(0.4) contrast(1.1)`，CSS `transition: filter 1s` |
| 文字浮现   | `EndingScreen.vue`，CSS `@keyframes fadeInUp` 逐行出现                               |
| 重新开始   | 清空 Pinia store + localStorage，`location.reload()`                                 |

---

## 七、Composables 职责

| Composable        | 职责                                                     |
| ----------------- | -------------------------------------------------------- |
| `useGameTimer`    | `setInterval` 每秒更新 `elapsed`，触发时间阈值阶段检查   |
| `useStageManager` | 监听 `elapsed` + 购买事件，统一控制 stage 转换和过渡动画 |
| `useWallet`       | 余额增减、各阶段赠送阿元逻辑                             |
| `useInventory`    | 背包增删、使用道具、卖出                                 |
| `useAudio`        | 封装 Howler.js，管理 BGM 切换、音效播放                  |
| `useCharacter`    | 管理活跃小人列表，按阶段配置添加/移除                    |

---

## 八、原生 CSS 动画清单

需在 `src/style.css` 中定义的 `@keyframes`：

| 动画名            | 用途                  |
| ----------------- | --------------------- |
| `slideFromLeft`   | 小人从左侧滑入        |
| `slideFromRight`  | 小人从右侧滑入        |
| `slideFromTop`    | 小人从顶部滑入        |
| `slideFromBottom` | 小人从底部滑入        |
| `popIn`           | 气泡弹出（scale 0→1） |
| `popOut`          | 气泡消失（scale 1→0） |
| `screenShake`     | 屏幕震动（Stage 4）   |
| `graffitiSpread`  | 涂鸦覆盖扩展          |
| `barrageFlyIn`    | 弹幕飞入              |
| `throwHat`        | 攻击动画 - 扔帽子     |
| `flashRed`        | 反弹伤害/红色闪屏     |
| `fadeInUp`        | 反思文字逐行浮现      |
| `fadeIn`          | 通用淡入              |
| `fadeOut`         | 通用淡出              |
| `floatUpDamage`   | 伤害数字上浮消失      |
| `glitchText`      | Stage 4 后期文字抖动  |
| `rustFadeIn`      | 锈迹覆盖层渐入        |

---

## 九、阶段赠送阿元机制

| 触发点       | 赠送金额 | 描述                       |
| ------------ | -------- | -------------------------- |
| 进入 Stage 3 | +500     | "大胃王挑战 税后收入500元" |
| 进入 Stage 4 | +1500    | "立场补贴1500阿元"         |
| 余额不足时   | +300     | "意外红包300阿元"          |

---

## 十、实现顺序

### Phase 1 - 基础骨架
- [ ] Vite + Vue 3 + Pinia + Tailwind 项目初始化
- [ ] 运行 `scripts/generate_placeholders.py` 生成全部占位素材
- [ ] TypeScript 类型定义
- [ ] Pinia store 搭建
- [ ] 数据文件（products, characters, stageConfig）
- [ ] GameController.vue + 计时器
- [ ] Stage 1 完整流程：货架 → 购买 → 提示

### Phase 2 - 交互层
- [ ] Character + SpeechBubble 组件
- [ ] Stage 2-3 完整流程
- [ ] 音效系统（Howler.js 集成）
- [ ] 购买确认弹窗 + 背包面板
- [ ] 钱不够时的自动赠送机制
- [ ] 意外收入弹窗

### Phase 3 - 战争阶段
- [ ] Stage 4 攻击道具、阵营伤害系统
- [ ] AttackAnimation 攻击动画
- [ ] UIBreakdownOverlay 涂鸦 + 震动 + 滤镜
- [ ] 防御道具卖出
- [ ] FactionBar 阵营对比条

### Phase 4 - 收尾
- [ ] Stage 5 反思定格画面
- [ ] 重新开始逻辑
- [ ] localStorage 持久化
- [ ] 音效/动画细节打磨
- [ ] 整体测试和调优

---

## 十一、占位素材方案

缺少正式素材的图片/音频，统一使用脚本自动生成占位文件。

### 占位图规则

- **灰色背景**（`#CCCCCC`）
- **黑色大叉**（两条对角线交叉）
- **白色文字**：在图片中央写明该素材的文字描述（如角色名、商品名）
- 使用 `scripts/generate_placeholders.py`（Python + Pillow）一键生成

### 需要的占位图清单

#### `assets/images/products/` — 商品图标（200×200）

**日用品（Stage 1-2）：**

| 文件名               | 描述文字   |
| -------------------- | ---------- |
| `milk.png`           | 纯牛奶     |
| `bread.png`          | 全麦面包   |
| `toilet_paper.png`   | 卷纸一提   |
| `eggs.png`           | 鸡蛋一盒   |
| `detergent.png`      | 洗衣液     |
| `snack.png`          | 薯片大礼包 |
| `instant_noodle.png` | 泡面五连包 |
| `cola.png`           | 可乐一箱   |

**手机（Stage 3）：**

| 文件名           | 描述文字   |
| ---------------- | ---------- |
| `lphone.png`     | lPhone     |
| `three_body.png` | 3体 Galaxy |
| `java_phone.png` | 爪哇大神   |
| `dami_note.png`  | 大麦Note   |

**汽车（Stage 4）：**

| 文件名           | 描述文字   |
| ---------------- | ---------- |
| `gas_car.png`    | 油车荣耀   |
| `ev_car.png`     | 纯电未来   |
| `hybrid_car.png` | 混动折中   |
| `suv_car.png`    | 越野硬汉   |
| `elder_car.png`  | 老年代步车 |
| `super_car.png`  | 超跑幻影   |

**攻击道具（Stage 3-4）：**

| 文件名                  | 描述文字         |
| ----------------------- | ---------------- |
| `label_sticker.png`     | 智商税标签粘贴器 |
| `team_stick.png`        | 站队荧光棒       |
| `sarcastic_voice.png`   | 阴阳怪气语音包   |
| `screenshot_cutter.png` | 断章取义截图器   |
| `block_card.png`        | 拉黑威胁卡       |
| `persona_destroyer.png` | 人设崩塌生成器   |
| `moral_rope.png`        | 道德绑架绳索     |
| `old_account_glass.png` | 翻旧账放大镜     |
| `mob_summon.png`        | 群体围攻召集令   |
| `reflective_spike.png`  | 反向歧视盾刺     |

**防御道具：**

| 文件名                | 描述文字 |
| --------------------- | -------- |
| `rational_shield.png` | 理性护盾 |
| `zen_headphone.png`   | 佛系耳机 |
| `shutup_redpack.png`  | 闭嘴红包 |

#### `assets/images/characters/` — 卡通小人（150×200）

**Stage 2 出场：**

| 文件名              | 描述文字     |
| ------------------- | ------------ |
| `fitness_coach.png` | 健身教练朋友 |

**Stage 3 出场：**

| 文件名             | 描述文字   |
| ------------------ | ---------- |
| `geek_glasses.png` | 戴眼镜极客 |
| `fashionista.png`  | 时尚达人   |
| `melon_eater.png`  | 吃瓜群众   |
| `dami_fan.png`     | 大麦粉     |

**Stage 4 — 环保阵营：**

| 文件名               | 描述文字   |
| -------------------- | ---------- |
| `aurora_girl.png`    | 极光少女   |
| `carbon_uncle.png`   | 碳足迹大叔 |
| `zero_waste_mom.png` | 零浪费妈妈 |

**Stage 4 — 传统阵营：**

| 文件名                | 描述文字     |
| --------------------- | ------------ |
| `old_driver_wang.png` | 老司机老王   |
| `mech_nostalgia.png`  | 机械情怀小哥 |
| `oil_tough_guy.png`   | 油味硬汉     |

**Stage 4 — 中立/围观：**

| 文件名              | 描述文字   |
| ------------------- | ---------- |
| `zen_observer.png`  | 佛系观察员 |
| `repost_editor.png` | 搬运工小编 |
| `heat_hunter.png`   | 热度猎人   |
| `passerby_a.png`    | 路人甲     |
| `passerby_b.png`    | 路人乙     |
| `passerby_c.png`    | 路人丙     |

#### `assets/images/graffiti/` — 涂鸦 / 崩坏素材（300×300 PNG）

| 文件名                  | 描述文字      |
| ----------------------- | ------------- |
| `graffiti_scribble.png` | 涂鸦-乱线     |
| `graffiti_cross.png`    | 涂鸦-叉号     |
| `graffiti_angry.png`    | 涂鸦-怒脸     |
| `graffiti_label.png`    | 涂鸦-标签     |
| `graffiti_crack.png`    | 涂鸦-裂纹     |
| `graffiti_blood.png`    | 涂鸦-红色喷溅 |
| `graffiti_rust.png`     | 涂鸦-锈迹     |
| `graffiti_warning.png`  | 涂鸦-警告符号 |
| `graffiti_chaos.png`    | 涂鸦-全混乱   |

#### `assets/images/backgrounds/` — 背景图（800×600 PNG）

| 文件名                    | 描述文字                            |
| ------------------------- | ----------------------------------- |
| `shop_clean.png`          | 干净明亮的杂货店背景（Stage 1）     |
| `shop_slightly_messy.png` | 略显杂乱的商店（Stage 2）           |
| `shop_digital.png`        | 数码区背景，明亮但冷色调（Stage 3） |
| `shop_warzone.png`        | 战区商店背景，红色锈迹（Stage 4）   |
| `shop_ruin.png`           | 废墟风背景，严重锈蚀（Stage 4后期） |
| `ending_sepia.png`        | 老照片色调背景（Stage 5）           |

#### `assets/images/effects/` — 攻击/状态特效（200×200 PNG）

| 文件名              | 描述文字         |
| ------------------- | ---------------- |
| `hat_throw.png`     | 帽子飞行攻击     |
| `hat_stupid.png`    | "老顽固"帽子     |
| `hat_hypocrite.png` | "伪善者"帽子     |
| `hat_boomer.png`    | "老古董"帽子     |
| `shield_block.png`  | 护盾格挡特效     |
| `damage_number.png` | 伤害数字底图     |
| `red_flash.png`     | 红色闪屏半透明层 |
| `rust_overlay.png`  | 锈迹覆盖层       |

#### `assets/audio/` — 音效（占位静音文件）

| 文件名                 | 描述                       |
| ---------------------- | -------------------------- |
| `bgm_stage1.mp3`       | 轻柔购物BGM（Stage 1-2）   |
| `bgm_stage3.mp3`       | 略带紧张感的BGM（Stage 3） |
| `bgm_stage4.mp3`       | 混乱嘈杂BGM（Stage 4）     |
| `pop.mp3`              | 小人探头"啵"音效           |
| `buy.mp3`              | 购买成功                   |
| `attack.mp3`           | 攻击音效                   |
| `counter.mp3`          | 反弹攻击音效               |
| `cash.mp3`             | 卖出道具收银音效           |
| `stage_transition.mp3` | 阶段转换音效               |
| `ending_freeze.mp3`    | 定格音效                   |

### 生成脚本 `scripts/generate_placeholders.py`

脚本职责：
1. 读取上述素材清单
2. 用 Pillow 为每张图生成 `灰色背景 + 黑色大叉 + 描述文字` 的 PNG
3. 用 `struct` 生成最小静音 WAV 文件
4. 输出到 `src/assets/` 对应子目录

素材替换流程：
- 后续有正式素材时，直接覆盖 `assets/` 下同名文件即可，无需改代码
- 如果需要新增素材，在 `products.ts` / `characters.ts` 添加条目后，重新运行脚本生成占位

---

## 十二、视觉风格渐变方案

整体视觉从"卡通漫画感"逐步崩坏为"锈蚀战争风"，通过背景图、CSS 滤镜、叠加层实现渐变。

### 各阶段视觉风格

| 阶段             | 风格关键词                       | 配色                 | 实现方式                                                                                                                                                |
| ---------------- | -------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stage 1**      | 明亮、卡通、漫画                 | 白底、彩色边框、圆角 | `shop_clean.png` 背景；商品卡片 `rounded-xl` + `border-4 border-yellow-300`；整体 `filter: brightness(1.05) saturate(1.1)`                              |
| **Stage 2**      | 依然明亮，出现一丝"被注视"的不安 | 同上，但边缘略暗     | 同 Stage 1 背景；小人出现时给页面加极淡的 `box-shadow: inset` 暗角                                                                                      |
| **Stage 3**      | 冷色调、阵营分化                 | 蓝灰底、黄/蓝阵营色  | `shop_digital.png` 背景；气泡分黄/蓝色；卡片边框变为 `border-blue-400`；`filter: saturate(0.9)` 略降饱和                                                |
| **Stage 4 早期** | 混乱、涂鸦入侵                   | 红色开始渗入         | `shop_warzone.png` 背景；涂鸦素材逐个叠加（`opacity` 从 0 渐增）；卡片边框变 `border-red-400`；`filter: contrast(1.1) hue-rotate(-5deg)`                |
| **Stage 4 中期** | 锈蚀、崩坏                       | 红色、锈橙、深灰     | 涂鸦大量覆盖；`rust_overlay.png` 半透明叠加（`opacity: 0.3`）；UI 元素开始 CSS 扭曲 `transform: rotate(±2deg)`；屏幕间歇震动 `screenShake`              |
| **Stage 4 后期** | 战区、血色                       | 深红、黑色、锈色     | `shop_ruin.png` 背景；`red_flash.png` 间歇闪烁；涂鸦几乎覆盖全屏；卡片 `filter: contrast(1.3) brightness(0.8)`；文字偶尔 glitch（CSS `clip-path` 抖动） |
| **Stage 5**      | 老照片、定格、反思               | 棕褐色、褪色         | 全局 `filter: sepia(0.8) saturate(0.4) contrast(1.1) brightness(0.9)`；所有动画暂停；涂鸦和小人保留但变棕褐色；中央浮现文字                             |

### CSS 实现要点

**阶段切换过渡**（`useStageManager` 控制）：
```css
/* 根元素通过 class 切换控制全局视觉 */
.game-root { transition: filter 2s ease, background-color 2s ease; }
.game-root.stage-1 { filter: brightness(1.05) saturate(1.1); }
.game-root.stage-3 { filter: saturate(0.9); }
.game-root.stage-4 { filter: contrast(1.1) hue-rotate(-5deg); }
.game-root.stage-4-late { filter: contrast(1.3) brightness(0.8); }
.game-root.stage-5 { filter: sepia(0.8) saturate(0.4) contrast(1.1) brightness(0.9); }
```

**锈迹叠加层**（Stage 4 渐入）：
```css
.rust-overlay {
  position: fixed; inset: 0; pointer-events: none;
  background-image: url('@/assets/images/effects/rust_overlay.png');
  opacity: 0; transition: opacity 5s ease;
}
.stage-4 .rust-overlay { opacity: 0.3; }
.stage-4-late .rust-overlay { opacity: 0.6; }
```

**红色闪屏**（攻击时触发）：
```css
.red-flash {
  position: fixed; inset: 0; pointer-events: none;
  background-color: rgba(255, 0, 0, 0.3);
  animation: flashRed 0.3s ease-out forwards;
}
@keyframes flashRed {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
```

**Glitch 文字效果**（Stage 4 后期，间歇触发）：
```css
.glitch-text {
  animation: glitch 0.3s steps(2) infinite;
}
@keyframes glitch {
  0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
  25% { clip-path: inset(92% 0 1% 0); transform: translate(1px, -1px); }
  50% { clip-path: inset(43% 0 1% 0); transform: translate(-1px, 3px); }
  75% { clip-path: inset(25% 0 58% 0); transform: translate(2px, 1px); }
  100% { clip-path: inset(54% 0 7% 0); transform: translate(2px, -2px); }
}
```

**涂鸦逐层叠加**（`UIBreakdownOverlay.vue`）：
- 维护一个涂鸦列表，Stage 4 随时间逐个添加
- 每个涂鸦元素用绝对定位随机放置，`opacity` 从 0 过渡到目标值
- 越后期叠加越多，最终几乎覆盖整个界面
