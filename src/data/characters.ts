import type { Character } from '@/types'

export const characters: Character[] = [
  // Stage 2
  {
    id: 'fitness_coach',
    name: '健身教练朋友',
    position: 'right',
    avatar: 'fitness_coach',
    bubbleColor: 'green',
    lines: [
      { text: '纯牛奶？不是说喝牛奶长痘吗？', condition: { boughtProductIds: ['milk'] } },
      { text: '买面包？全麦的热量也不低啊兄弟...', condition: { boughtProductIds: ['bread'] } },
      { text: '鸡蛋胆固醇高你不知道吗？还敢买！', condition: { boughtProductIds: ['eggs'] } },
      { text: '洗衣液？你是来超市进货的吧...', condition: { boughtProductIds: ['detergent'] } },
      { text: '卷纸都买？家里是没纸了吗哈哈。', condition: { boughtProductIds: ['toilet_paper'] } },
      { text: '薯片？你不是说要减肥吗？', condition: { boughtProductIds: ['snack'] } },
      { text: '泡面...这也太没营养了吧。', condition: { boughtProductIds: ['instant_noodle'] } },
      { text: '可乐？健身的人最恨看见这个。', condition: { boughtProductIds: ['cola'] } },
    ],
    fallbackLines: [
      '天呐，你居然在超市买这个？太不健康了！',
      '我就随口一说，你别往心里去~',
    ],
    goodbyeLines: [
      '哈哈，我开玩笑的，别往心里去~',
      '其实吃什么不重要，开心就好！',
      '好吧我走了，不打扰你购物~',
    ],
    enterDelay: 0,
    stage: 2,
  },

  // Stage 3
  {
    id: 'geek_glasses',
    name: '戴眼镜极客',
    position: 'left',
    avatar: 'geek_glasses',
    faction: 'neutral',
    bubbleColor: 'yellow',
    lines: [
      { text: 'lPhone？系统封闭，交智商税！参数党不削。', condition: { boughtProductIds: ['lphone'] } },
      { text: '3体跑分碾压全场，性能怪兽！', condition: { boughtProductIds: ['three_body'] } },
      { text: '爪哇大神？稳定是稳定，但系统太无聊了。', condition: { boughtProductIds: ['java_phone'] } },
      { text: '大麦Note参数还行，但品控堪忧。', condition: { boughtProductIds: ['dami_note'] } },
    ],
    fallbackLines: [
      '参数党无敌！你们这些看颜值的根本不懂技术。',
    ],
    goodbyeLines: [
      '算了不争了，你喜欢就好~',
      '反正花的不是我的钱，关我啥事。',
      '别听我的，买啥都行！',
    ],
    enterDelay: 0,
    stage: 3,
  },
  {
    id: 'fashionista',
    name: '时尚达人',
    position: 'right',
    avatar: 'fashionista',
    faction: 'neutral',
    bubbleColor: 'yellow',
    lines: [
      { text: 'lPhone拍照好看啊，买手机不就图个开心？', condition: { boughtProductIds: ['lphone'] } },
      { text: '3体？太直男了，配色丑到哭。', condition: { boughtProductIds: ['three_body'] } },
      { text: '爪哇大神造型中规中矩，没什么设计感。', condition: { boughtProductIds: ['java_phone'] } },
      { text: '大麦Note外观还行，但总觉得差点意思。', condition: { boughtProductIds: ['dami_note'] } },
    ],
    fallbackLines: [
      '颜值即正义，参数再多不如拿在手里好看。',
    ],
    goodbyeLines: [
      '哈哈，我就喜欢好看的，审美不同嘛~',
      '不说了，我要去研究新滤镜了。',
      '人各有爱，何必争来争去呢？',
    ],
    enterDelay: 200,
    stage: 3,
  },
  {
    id: 'melon_eater',
    name: '吃瓜群众',
    position: 'bottom',
    avatar: 'melon_eater',
    faction: 'neutral',
    bubbleColor: 'yellow',
    lines: [
      { text: '哎哟，又吵起来了，我啃个瓜。' },
      { text: '你们继续，我看得津津有味~' },
    ],
    fallbackLines: [],
    goodbyeLines: [
      '瓜吃完了，走了走了~',
      '你们可真有意思，下次还来看。',
      '散了散了，没瓜了。',
    ],
    enterDelay: 400,
    stage: 3,
  },
  {
    id: 'dami_fan',
    name: '大麦粉',
    position: 'left',
    avatar: 'dami_fan',
    faction: 'neutral',
    bubbleColor: 'yellow',
    lines: [
      { text: 'lPhone那个价格，我大麦Note买三台！', condition: { boughtProductIds: ['lphone'] } },
      { text: '3体是不错，但性价比还是我大麦强！', condition: { boughtProductIds: ['three_body'] } },
      { text: '爪哇大神？大麦Note才叫性价比之王好吧！', condition: { boughtProductIds: ['java_phone'] } },
      { text: '大麦Note！1999交个朋友，碾压一切！', condition: { boughtProductIds: ['dami_note'] } },
    ],
    fallbackLines: [
      '性价比是王道，参数不输价格砍半，香不香？',
    ],
    goodbyeLines: [
      '交个朋友嘛，话别说那么绝~',
      '性价比是王道，但你们开心就好。',
      '我也就随便推荐一下，别较真。',
    ],
    enterDelay: 600,
    stage: 3,
  },

  // Stage 4 - Brand fanatics
  {
    id: 'tailunsi_fan',
    name: '泰伦斯铁粉',
    position: 'left',
    avatar: 'aurora_girl',
    bubbleColor: 'red',
    lines: [
      { text: 'T-7！全栈自研，智能驾驶遥遥领先！', condition: { boughtProductIds: ['tailunsi'] } },
      { text: '标越？不就是电池厂造的车吗？', condition: { boughtProductIds: ['biaoyue'] } },
      { text: '柏慕？情怀税！智能化被甩三条街。', condition: { boughtProductIds: ['bomu'] } },
      { text: '觅达连车都造不明白就敢卖？', condition: { boughtProductIds: ['mida'] } },
      { text: '众瀚那也叫车？塑料感拉满。', condition: { boughtProductIds: ['zhonghan'] } },
    ],
    fallbackLines: [
      '不是泰伦斯不买！智能驾驶改变生活！',
      '自动驾驶你试过吗？试过就回不去了。',
    ],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['泰伦斯天下第一！谁反对谁就是敌人和韭菜！', '其他品牌的车主都是被洗脑了！'] },
      { minChaos: 60, lines: ['你们这些蠢货懂什么？！泰伦斯是信仰！', '不支持泰伦斯的人不配拥有驾照！！', '我的人生就是为泰伦斯而活的！！！'] },
      { minChaos: 85, lines: ['啊啊啊啊泰伦斯泰伦斯泰伦斯！！！', '烧烧烧！把其他品牌全烧了！！！', '谁敢说泰伦斯一个不字我就和他拼命！！！'] },
    ],
    goodbyeLines: [
      '算了，泰伦斯车主不屑于争。',
      '我回去等OTA更新了，再见。',
    ],
    enterDelay: 0,
    stage: 4,
  },
  {
    id: 'biaoyue_loyal',
    name: '标越死忠',
    position: 'right',
    avatar: 'carbon_uncle',
    bubbleColor: 'red',
    lines: [
      { text: 'BY-5！刀片电池安全无忧，国货之光！', condition: { boughtProductIds: ['biaoyue'] } },
      { text: '泰伦斯？经常降价的韭菜车，买了就亏。', condition: { boughtProductIds: ['tailunsi'] } },
      { text: '柏慕维修费够买台标越了，人傻钱多。', condition: { boughtProductIds: ['bomu'] } },
      { text: '里程？冰箱彩电大沙发，这不是车这是移动客厅。', condition: { boughtProductIds: ['licheng'] } },
    ],
    fallbackLines: [
      '买标越就对了！销量冠军不会错！',
      '国产车已经碾压合资了，醒醒吧！',
    ],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['标越销量碾压一切！数据不会骗人！', '不买标越的都是跟风狗！'] },
      { minChaos: 60, lines: ['你们这些车黑给我闭嘴！！标越是神车！！', '谁敢说标越不好我就投诉谁！！', '销量就是真理！你们不配拥有意见！！'] },
      { minChaos: 85, lines: ['标越标越标越！！！信仰之车！！！', '把所有说标越不好的人全部拉黑！！！', '销量百万辆！你们这些蝼蚁懂什么！！！'] },
    ],
    goodbyeLines: [
      '销量说明一切，不跟你们争了。',
      '我去充电了，标越充电贼快。',
    ],
    enterDelay: 200,
    stage: 4,
  },
  {
    id: 'bomu_veteran',
    name: '柏慕老炮',
    position: 'right',
    avatar: 'old_driver_wang',
    bubbleColor: 'red',
    lines: [
      { text: 'BM-3！纯粹驾趣！弯道之王！这才是驾驶！', condition: { boughtProductIds: ['bomu'] } },
      { text: '泰伦斯？大号遥控车而已，没有灵魂。', condition: { boughtProductIds: ['tailunsi'] } },
      { text: '标越？出租车专用车吧。', condition: { boughtProductIds: ['biaoyue'] } },
      { text: '觅达造车？手机都没造明白就想造车了？', condition: { boughtProductIds: ['mida'] } },
    ],
    fallbackLines: [
      '不懂操控的人不配聊车。',
      '开了二十年车，只有柏慕让我心动。',
    ],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['柏慕的操控感，你们这些菜鸟永远不懂！', '开过柏慕的人，其他车都是垃圾！'] },
      { minChaos: 60, lines: ['操控才是灵魂！！其他都是花架子！！', '你们只会看参数表，根本不懂什么叫人车合一！！', '柏慕弯道封神！！不服来赛道见！！'] },
      { minChaos: 85, lines: ['赛道之王！！！柏慕永远是神！！！', '你们这些电子狗只配开移动棺材！！！', '后驱！后驱！！后驱才是正义！！！'] },
    ],
    goodbyeLines: [
      '你们不懂驾驶乐趣，懒得说了。',
      '我去跑山了，赛道见。',
    ],
    enterDelay: 400,
    stage: 4,
  },
  {
    id: 'mida_believer',
    name: '觅达生态信徒',
    position: 'left',
    avatar: 'mech_nostalgia',
    bubbleColor: 'red',
    lines: [
      { text: 'S-1！生态互联！万物智驾！', condition: { boughtProductIds: ['mida'] } },
      { text: '泰伦斯价格虚高，觅达一半价格同样的体验。', condition: { boughtProductIds: ['tailunsi'] } },
      { text: '标越设计太丑了，觅达的设计语言领先一个时代。', condition: { boughtProductIds: ['biaoyue'] } },
      { text: '柏慕？老古董了，智能化约等于零。', condition: { boughtProductIds: ['bomu'] } },
    ],
    fallbackLines: [
      '觅达生态打通一切！手机、家电、汽车无缝连接！',
      '雷总说了，造车是认真的！',
    ],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['觅达生态碾压一切！不用觅达的都是原始人！', '雷总的每一句话都是真理，不容质疑！'] },
      { minChaos: 60, lines: ['生态的力量你们根本理解不了！！', '不用觅达手机就不配用觅达汽车！！', '信仰充值中……一切为了生态！！！'] },
      { minChaos: 85, lines: ['雷总是神！！！觅达是光！！！', '没有觅达我的世界就是一片黑暗！！！', '生态万物互联！！让其他品牌统统消失！！！'] },
    ],
    goodbyeLines: [
      '生态的力量你们不懂，走了。',
      '我去看看觅达出了什么新品。',
    ],
    enterDelay: 600,
    stage: 4,
  },
  {
    id: 'licheng_dad',
    name: '里程奶爸',
    position: 'bottom',
    avatar: 'zero_waste_mom',
    bubbleColor: 'red',
    lines: [
      { text: 'L-6！移动的家！带娃神器！', condition: { boughtProductIds: ['licheng'] } },
      { text: '泰伦斯后排连个平板都没有，怎么带娃？', condition: { boughtProductIds: ['tailunsi'] } },
      { text: '柏慕后排硬得像板凳，孩子坐了直哭。', condition: { boughtProductIds: ['bomu'] } },
    ],
    fallbackLines: [
      '有孩子的家庭就选里程，别纠结了！',
      '车里能看电视能热奶，这才叫家庭用车。',
    ],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['里程是唯一适合家庭的车！其他都不安全！', '不为孩子着想的人根本不配当父母！'] },
      { minChaos: 60, lines: ['你们这些没孩子的懂什么！！里程是家庭之光！！', '不选里程就是在虐待孩子！！你良心不会痛吗！！', '冰箱彩电大沙发！这才是汽车该有的样子！！'] },
      { minChaos: 85, lines: ['里程里程里程！！！家庭第一！！！', '车里就是家！！！其他车都是移动监狱！！！', '孩子说好才是真的好！！！你们都是单身狗不懂！！！'] },
    ],
    goodbyeLines: [
      '不说了，孩子该喝奶了。',
      '家庭第一，不跟你们争了。',
    ],
    enterDelay: 800,
    stage: 4,
  },

  // Stage 4 - Instigators / neutral
  {
    id: 'instigator',
    name: '煽风点火者',
    position: 'bottom',
    avatar: 'heat_hunter',
    bubbleColor: 'red',
    lines: [
      { text: '哎！泰伦斯车主说你们标越是垃圾呢！' },
      { text: '你们不觉得柏慕车主都特别装吗？' },
      { text: '听说觅达又要降价了，刚买的哭晕在厕所。' },
    ],
    fallbackLines: [],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['快打起来！这波流量我要上热搜！', '谁骂得最狠我给谁刷礼物！'] },
      { minChaos: 60, lines: ['咬！咬死他们！！我要拍视频！！', '骂啊！怎么不骂了！！骂得再脏一点！！', '流量！流量！！全部都是流量！！！'] },
      { minChaos: 85, lines: ['杀杀杀！！！打打打！！！我要十万播放！！！', '互相网暴！人肉搜索！！让全网都看到！！！', '毁灭吧！！越混乱越好！！！我要当网红！！！'] },
    ],
    goodbyeLines: [
      '打起来打起来！我还要录视频呢。',
      '你们继续，我去别的车行煽……参观。',
    ],
    enterDelay: 1000,
    stage: 4,
  },
  {
    id: 'zen_observer',
    name: '佛系观察员',
    position: 'bottom',
    avatar: 'zen_observer',
    bubbleColor: 'red',
    lines: [
      { text: '阿弥陀佛，车不过代步工具，何必执着。' },
      { text: '诸法空相，你们争来争去，最后都要报废的。' },
    ],
    fallbackLines: [],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['唉……你们太执迷了，放下吧。', '争什么争……到最后都是废铁。'] },
      { minChaos: 60, lines: ['完了完了……全完了……人类没救了……', '我劝了……没人听……随你们去吧……', '佛祖啊……原谅这些迷途的羔羊吧……'] },
      { minChaos: 85, lines: ['啊啊啊啊……为什么……为什么不能停下来……', '这个世界疯了……彻底疯了……我要逃离……', '我不看了……我不听了……什么都听不见……'] },
    ],
    goodbyeLines: [
      '喝口茶，静静心，走了。',
      '人生苦短，何必争执。',
    ],
    enterDelay: 1200,
    stage: 4,
  },
  {
    id: 'repost_editor',
    name: '搬运工小编',
    position: 'left',
    avatar: 'repost_editor',
    bubbleColor: 'red',
    lines: [
      { text: '素材来了！截图截图，这波流量赚大了。' },
      { text: '标题起什么好呢……\u201C震惊！车圈又开撕了！\u201D' },
    ],
    fallbackLines: [],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['完了完了！这波素材价值连城！', '标题我都想好了："车圈大战！谁才是终极韭菜？"'] },
      { minChaos: 60, lines: ['快！快截图！！全是黑料！！', '我要开十个号同时发！！全网轰炸！！', '流量就是金钱！！骂得越凶我赚越多！！'] },
      { minChaos: 85, lines: ['哈哈哈哈哈！！全网的流量都是我的！！！', '人血馒头真香！！我要造谣！我要传谣！！！', '十万加！！百万加！！！我要成为自媒体之王！！！'] },
    ],
    goodbyeLines: [
      '标题取好了，我回去发稿了！',
      '记得给我点赞转发哦~',
    ],
    enterDelay: 1400,
    stage: 4,
  },
  {
    id: 'passerby_a',
    name: '路人甲',
    position: 'bottom',
    avatar: 'passerby_a',
    bubbleColor: 'red',
    lines: [
      { text: '我就是来逛个街，怎么打起来了…' },
      { text: '你们开心就好，我先走了。' },
    ],
    fallbackLines: [],
    chaosFallbackLines: [
      { minChaos: 30, lines: ['你们能不能消停点……我只是来逛街的……', '怎么越来越可怕了……我要回家……'] },
      { minChaos: 60, lines: ['救命啊！！有人管管吗！！', '别打了别打了！！我要报警了！！', '这个世界怎么了……我好害怕……'] },
      { minChaos: 85, lines: ['啊啊啊啊不要过来！！不要过来！！！', '我什么都没看见！！放过我！！！', '妈妈！！我要回家！！这里全是疯子！！！'] },
    ],
    goodbyeLines: [
      '我溜了溜了，太吓人了。',
      '冤冤相报何时了，何必呢。',
    ],
    enterDelay: 1600,
    stage: 4,
  },
]

export function getCharactersByStage(stage: number): Character[] {
  return characters.filter((c) => c.stage === stage)
}
