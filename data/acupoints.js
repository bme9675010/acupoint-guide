// 十二時辰子午流注資料
export const ZIWU_LIUZHU = [
  { startHour: 23, endHour: 1, zhi: '子時', meridian: '足少陽膽經', organ: '膽', tip: '宜熟睡養膽氣，忌熬夜。睡前可輕敲大腿外側或按揉風池穴放鬆。', recommendedIds: ['GB20', 'GB21'] },
  { startHour: 1, endHour: 3, zhi: '丑時', meridian: '足厥陰肝經', organ: '肝', tip: '肝血推陳出新之時。若易醒多夢，日間可多按揉太衝穴疏肝理氣。', recommendedIds: ['LR3'] },
  { startHour: 3, endHour: 5, zhi: '寅時', meridian: '手太陰肺經', organ: '肺', tip: '肺朝百脈，氣血由靜轉動。呼吸道敏感或喉嚨乾癢可多按列缺、魚際。', recommendedIds: ['LU7', 'LU10', 'LI20'] },
  { startHour: 5, endHour: 7, zhi: '卯時', meridian: '手陽明大腸經', organ: '大腸', tip: '宜晨起飲溫水、排便清腸。按揉合谷穴有助喚醒身體與腸道蠕動。', recommendedIds: ['LI4', 'LI20'] },
  { startHour: 7, endHour: 9, zhi: '辰時', meridian: '足陽明胃經', organ: '胃', tip: '胃經當令，吃溫熱早餐最養胃氣。飯後一小時按足三里、豐隆健脾祛濕。', recommendedIds: ['ST36', 'ST40'] },
  { startHour: 9, endHour: 11, zhi: '巳時', meridian: '足太陰脾經', organ: '脾', tip: '脾主運化，大腦思緒最清晰。久坐水腫或婦科保養可按三陰交、血海。', recommendedIds: ['SP6', 'SP10'] },
  { startHour: 11, endHour: 13, zhi: '午時', meridian: '手少陰心經', organ: '心', tip: '心經當令，宜小憩 15-30 分鐘養心神，按揉神門、勞宮舒緩心悸焦慮。', recommendedIds: ['HT7', 'PC8'] },
  { startHour: 13, endHour: 15, zhi: '未時', meridian: '手太陽小腸經', organ: '小腸', tip: '分清泌濁吸收營養。下午伏案肩頸僵硬時，按揉後谿穴最能鬆開督脈與肩背。', recommendedIds: ['SI3'] },
  { startHour: 15, endHour: 17, zhi: '申時', meridian: '足太陽膀胱經', organ: '膀胱', tip: '人體最重要排毒與記憶黃金期，多喝溫水，按委中、崑崙、攢竹舒緩腰背與眼疲勞。', recommendedIds: ['BL40', 'BL60', 'BL2'] },
  { startHour: 17, endHour: 19, zhi: '酉時', meridian: '足少陰腎經', organ: '腎', tip: '腎藏精，宜放慢步調。按揉湧泉穴、太谿穴引火歸元、改善手腳冰冷。', recommendedIds: ['KI1', 'KI3'] },
  { startHour: 19, endHour: 21, zhi: '戌時', meridian: '手厥陰心包經', organ: '心包', tip: '護心舒壓時段，最適合散步談心、按揉內關、勞宮緩解胸悶與胃脹。', recommendedIds: ['PC6', 'PC8'] },
  { startHour: 21, endHour: 23, zhi: '亥時', meridian: '手少陽三焦經', organ: '三焦', tip: '百脈休養生息，宜泡腳、按揉印堂、翳風與百會準備入眠。', recommendedIds: ['EX-HN3', 'TE17', 'GV20'] }
];

// 症狀組合處方籤 (支援整套連續自動跟練播放清單)
export const SYMPTOM_PRESETS = [
  {
    id: 'office-neck',
    title: '辦公室肩頸急救',
    subtitle: '低頭族、落枕、肩背鐵板一塊',
    icon: '🌿',
    points: ['GB20', 'GB21', 'SI3', 'LU7']
  },
  {
    id: 'headache-eye',
    title: '偏頭痛・3C 護眼方',
    subtitle: '太陽穴脹痛、乾眼酸澀、腦脹',
    icon: '🍵',
    points: ['BL2', 'EX-HN5', 'EX-HN3', 'LI4']
  },
  {
    id: 'sleep-calm',
    title: '安神助眠・解焦慮',
    subtitle: '翻來覆去、多夢易醒、心煩掌熱',
    icon: '🌙',
    points: ['EX-HN3', 'HT7', 'PC8', 'KI1']
  },
  {
    id: 'stomach-relief',
    title: '胃脹消食・祛濕消腫',
    subtitle: '吃太飽脹氣、暈車想吐、下半身水腫',
    icon: '🌾',
    points: ['PC6', 'ST36', 'ST40', 'SP6']
  },
  {
    id: 'cold-womens',
    title: '暖宮活血・手腳冰冷',
    subtitle: '經期悶痛、氣血虛寒、臉色暗沉',
    icon: '🔥',
    points: ['SP10', 'SP6', 'KI3', 'LR3']
  },
  {
    id: 'nose-throat',
    title: '換季鼻塞・清肺止咳',
    subtitle: '過敏打噴嚏、耳鳴頭重、喉嚨乾痛',
    icon: '🍃',
    points: ['LI20', 'LU10', 'LU7', 'LI4']
  }
];

// 核心 22 大黃金穴位資料庫（支援正/背/頭面/手部/足腿 5 大視圖）
export const ACUPOINTS = [
  {
    id: 'LI4',
    name: '合谷',
    pinyin: 'Hé Gǔ',
    meridian: '手陽明大腸經',
    attribute: '原穴・四總穴（「面口合谷收」）',
    views: {
      front: { x: 108, y: 315 },
      hand: { x: 205, y: 215 }
    },
    location: {
      anatomical: '手背第 1、2 掌骨間，當第二掌骨橈側（靠近拇指側）的中點處。',
      quickFind: '先摸到手背食指延伸下來的長骨頭（第二掌骨），取這根骨頭的「正中間點」，往虎口側骨頭邊緣下方摳進去就是！（千萬別按在虎口軟肉正中央）',
      cunReference: '以另一手大拇指指間關節橫紋貼住虎口蹼緣，拇指尖下壓處；更準確是直接摸「第二掌骨全長的 1/2 中點」。',
      boneTip: '第二掌骨中點橈側緣（往食指骨頭底下摳，不是垂直壓虎口肉）',
      steps: [
        '①【摸骨頭】在手背找到連接食指的那根長骨頭（第二掌骨），從指根摸到手腕端，找出骨頭「正中間 1/2 處」。',
        '②【卡骨縫】大拇指從虎口肌肉往食指骨頭方向推，卡在骨頭邊緣下方的凹縫。',
        '③【斜向壓】施力方向朝向「小指方向」（往食指骨頭底緣斜頂進去），不要垂直往手掌心壓。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：才按一點力，就會出現強烈的「痠、麻、脹」感，甚至像觸電一樣傳到食指尖！',
        wrong: '❌ 常見按偏：如果只覺得「皮肉緊痛」而沒有痠麻感，代表你按太靠近虎口軟肉中央了，請往食指骨頭邊緣退一點。'
      }
    },
    benefits: {
      tcmFunctions: ['疏風解表', '行氣活血', '通絡鎮痛', '清泄肺氣'],
      symptoms: ['頭痛', '牙痛', '肩頸痠痛', '鼻塞流涕', '經痛', '便秘']
    },
    massageGuide: {
      technique: '點按結合揉動 (深按朝向小指側)',
      fingerToUse: '用對側大拇指指腹，施力方向朝向「小指方向」（緊貼第二掌骨底緣）深按。',
      sensation: '明顯的痠、麻、脹感，常會像電流般傳導至食指尖或手腕。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'LR3', comboName: '開四關', purpose: '合谷配太衝（雙手雙腳共四穴），大開周身氣機，專治壓力型頭痛、失眠、情緒鬱悶。' },
      { partnerId: 'LI20', comboName: '通鼻方', purpose: '合谷配迎香，快速緩解過敏性鼻炎、鼻塞。' }
    ],
    contraindications: {
      pregnancyForbidden: true,
      notes: '⚠️ 孕婦禁按！合谷行氣活血力強，易刺激子宮收縮。'
    }
  },
  {
    id: 'LU10',
    name: '魚際',
    pinyin: 'Yú Jì',
    meridian: '手太陰肺經',
    attribute: '滎穴（清肺火、利咽喉、緩解拇指媽媽手要穴）',
    views: {
      front: { x: 102, y: 308 },
      hand: { x: 235, y: 245 }
    },
    location: {
      anatomical: '手外側，第 1 掌骨橈側中點赤白肉際處。',
      quickFind: '攤開手掌，大拇指根部有一大塊像魚肚一樣豐厚的肌肉（大魚際）；摸到大拇指連下來的骨頭（第一掌骨），在骨頭「正中間 1/2 處」、手掌白肉與手背紅肉交界邊緣就是魚際。',
      cunReference: '第一掌骨全長之 1/2 中點，緊貼掌骨邊緣赤白肉際。',
      boneTip: '第一掌骨中點內側緣（往大拇指掌骨底下推按）',
      steps: [
        '①【摸拇指骨】在大拇指根部外側，摸到第一掌骨這根長骨頭。',
        '②【取正中點】找出大拇指指根關節到手腕橫紋連線的「正中間 1/2 點」。',
        '③【摳骨邊】用對側大拇指指尖，從魚際肌肉往第一掌骨骨頭邊緣深按（或兩手魚際對搓至發燙）。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：整個大拇指根部出現強烈痠脹感（常滑手機的人這裡有一條筋特別痠痛），按開後咽喉乾癢與手指緊繃明顯緩解。',
        wrong: '❌ 常見按偏：不要只按在掌心軟肉正中央，要貼著外側「第一掌骨邊緣」按才準。'
      }
    },
    benefits: {
      tcmFunctions: ['清肺瀉火', '利咽止咳', '舒筋活絡'],
      symptoms: ['咽喉乾痛', '咳嗽氣喘', '媽媽手拇指痠痛', '失聲']
    },
    massageGuide: {
      technique: '拇指深按骨緣 或 雙手魚際對搓發熱',
      fingerToUse: '用對側大拇指指腹緊貼第一掌骨中點深揉；呼吸道保養可將雙手魚際貼合快速對搓 60 下至發燙。',
      sensation: '大魚際深層痠脹並伴隨溫熱感。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'LU7', comboName: '清肺利咽方', purpose: '魚際配列缺，緩解感冒喉嚨痛與乾咳。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '滑手機過度導致拇指肌腱發炎時，力道宜溫和緩揉。'
    }
  },
  {
    id: 'PC8',
    name: '勞宮',
    pinyin: 'Láo Gōng',
    meridian: '手厥陰心包經',
    attribute: '滎穴（清心瀉火、瞬間平復緊張焦慮之要穴）',
    views: {
      front: { x: 112, y: 318 },
      hand: { x: 162, y: 235 }
    },
    location: {
      anatomical: '手掌心，當第 2、3 掌骨之間偏於第 3 掌骨，握拳屈指時中指尖處。',
      quickFind: '自然握拳（不要刻意用力緊握），看你的「中指指尖」在手掌心點到的那個凹窩（剛好在食指與中指掌骨中間偏中指側），就是勞宮穴！',
      cunReference: '自然握拳屈指時，中指指尖所指掌心凹陷處。',
      boneTip: '手掌心第 2、3 掌骨之間（偏第 3 掌骨側凹窩）',
      steps: [
        '①【自然握拳】把四根手指自然往手掌心彎曲握起。',
        '②【看中指尖】找到中指指尖接觸手掌心的那個點，用另一手大拇指壓住做記號。',
        '③【張掌深按】把手指張開，大拇指在剛才記號處（第 2、3 掌骨縫隙）垂直往手背方向深壓。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：掌心深處會有一股痠脹帶微麻感，深呼吸按 1 分鐘，心跳加速與緊張冒汗會迅速平復。',
        wrong: '❌ 常見按偏：不要用無名指尖定位（那是少府穴），勞宮穴是以「中指尖」為準。'
      }
    },
    benefits: {
      tcmFunctions: ['清心瀉火', '安心定神', '醒腦開竅'],
      symptoms: ['失眠焦慮', '胸悶心悸', '口舌生瘡', '手心燥熱流汗']
    },
    massageGuide: {
      technique: '拇指垂直深按 或 以勞宮對搓腳底湧泉',
      fingerToUse: '開會緊張或失眠時，用對側大拇指垂直深按掌心勞宮穴，配合慢吸慢吐；睡前可用勞宮穴摩擦腳底湧泉穴。',
      sensation: '手掌心產生明顯痠脹感，隨即擴散為手心溫熱感。',
      rhythm: { pressSeconds: 5, releaseSeconds: 3, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'KI1', comboName: '心腎相交助眠方', purpose: '手心勞宮搓腳底湧泉，引心火下行溫腎水，專治心煩失眠。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '隨時隨地皆可按揉，特別適合上台報告前或睡前思緒紛亂時。'
    }
  },
  {
    id: 'LU7',
    name: '列缺',
    pinyin: 'Liè Quē',
    meridian: '手太陰肺經',
    attribute: '絡穴・八脈交會穴（通任脈，「頭項尋列缺」）',
    views: {
      front: { x: 116, y: 292 },
      hand: { x: 192, y: 342 }
    },
    location: {
      anatomical: '前臂橈側緣，橈骨莖突上方，腕橫紋上 1.5 寸，當肱橈肌與拇長展肌腱之間。',
      quickFind: '把兩手虎口張開、自然垂直交叉互扣，一手食指自然伸直搭在另一手大拇指根部後方的手腕側面硬骨頭（橈骨莖突）上，食指指尖點到的「骨頭小裂縫凹窩」就是列缺！',
      cunReference: '兩手虎口交叉，食指尖所達之橈骨莖突上方骨縫（腕橫紋上 1.5 寸）。',
      boneTip: '手腕大拇指側凸骨（橈骨莖突）上方的小骨頭裂縫凹陷',
      steps: [
        '①【兩手虎口交叉】左右手虎口張開，互相垂直卡住。',
        '②【食指伸直】上方那隻手的食指自然貼在下方手腕的側面（大拇指延伸下來那一側）。',
        '③【摸骨頭裂縫】在食指尖摸到的地方，用指腹前後微搓，會摸到硬骨頭上有一個明顯的「小裂縫凹槽」，用指甲側緣輕掐或指腹揉動。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：骨頭小裂縫裡有一條小筋，撥動時會有明顯痠痛微麻感，偏頭痛與後頸緊繃會隨之舒緩。',
        wrong: '❌ 常見按偏：它不在手掌正面也不在手背，而是在手腕「大拇指外側正側面」的骨頭裂縫裡！'
      }
    },
    benefits: {
      tcmFunctions: ['宣肺解表', '通經活絡', '通調任脈'],
      symptoms: ['肩頸痠痛', '頭痛', '咳嗽氣喘', '咽喉乾痛', '落枕']
    },
    massageGuide: {
      technique: '拇指指尖橫向撥揉骨縫',
      fingerToUse: '用對側大拇指指端卡進橈骨莖突上方的小骨縫中，做垂直於骨頭方向的輕微撥揉。',
      sensation: '局部出現清脆的痠痛感，並向大拇指或前臂延伸。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'LI4', comboName: '疏風止頭痛方', purpose: '列缺配合谷（原絡配穴），感冒頭痛與頸項僵硬首選。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '皮下即為骨膜與肌腱，用指腹撥揉即可，勿用尖指甲刮傷表皮。'
    }
  },
  {
    id: 'PC6',
    name: '內關',
    pinyin: 'Nèi Guān',
    meridian: '手厥陰心包經',
    attribute: '絡穴・八脈交會穴（「胸脇內關謀」）',
    views: {
      front: { x: 125, y: 288 },
      hand: { x: 145, y: 360 }
    },
    location: {
      anatomical: '前臂掌側，當曲澤與大陵的連線上，腕橫紋上 2 寸，掌長肌腱與橈側腕屈肌腱之間。',
      quickFind: '手掌朝上用力握拳並往內彎手腕，手腕內側中間會浮出「兩條明顯大筋」；從最靠近手掌的那條手腕橫紋，往手肘方向放「三根手指寬」，兩條筋正中間的縫隙就是內關。',
      cunReference: '食指、中指、無名指三指併攏（以中指中節寬度為準）= 2 寸。',
      boneTip: '腕橫紋下三橫指，掌長肌腱與橈側腕屈肌腱「兩筋正中間」',
      steps: [
        '①【浮兩筋】手掌朝上、用力握拳微彎手腕，讓手腕正中央浮出兩條明顯的硬筋（肌腱）。',
        '②【量三指】另一手「食指、中指、無名指」三指併攏，食指貼齊手腕第一條橫紋，看無名指邊緣落點。',
        '③【按筋縫】手拳放鬆，用大拇指指尖垂直插入無名指邊緣、「兩條筋正中間」的深溝裡。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：兩筋之間深處有明顯痠麻脹感，甚至有一股麻感往中指尖或手肘內側放射，打嗝或噁心感隨之減輕。',
        wrong: '❌ 常見按偏：如果覺得指尖頂到硬邦邦的筋條、只痛不痠，代表偏左或偏右壓在肌腱上了，要退回兩條筋正中央的軟縫。'
      }
    },
    benefits: {
      tcmFunctions: ['寧心安神', '和胃降逆', '寬胸理氣'],
      symptoms: ['胃脹噁心', '暈車想吐', '失眠焦慮', '胸悶心悸', '打嗝']
    },
    massageGuide: {
      technique: '垂直緩慢點按 (配合深呼吸)',
      fingerToUse: '以對側大拇指指尖垂直按入兩筋之間，吸氣時微收力、吐氣時深按。',
      sensation: '前臂內側深層產生痠脹感，有時會往上延伸至手肘或往下至中指。',
      rhythm: { pressSeconds: 5, releaseSeconds: 3, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'ST36', comboName: '和胃止嘔方', purpose: '內關配足三里，胃脹氣、溢赤酸、暈車嘔吐首選組合。' },
      { partnerId: 'HT7', comboName: '寧心助眠方', purpose: '內關配神門，平復自律神經亢奮與睡前心悸。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '力道宜柔和深沉，切勿用指甲用力猛掐以免傷及正中神經表淺支。'
    }
  },
  {
    id: 'HT7',
    name: '神門',
    pinyin: 'Shén Mén',
    meridian: '手少陰心經',
    attribute: '原穴・輸穴（養心安神第一要穴）',
    views: {
      front: { x: 136, y: 302 },
      hand: { x: 112, y: 315 }
    },
    location: {
      anatomical: '腕前區，腕掌側遠端橫紋尺側端（小指側），尺側腕屈肌腱的橈側凹陷處。',
      quickFind: '手掌朝上，在小指這一側的手腕橫紋上，先摸到一顆圓圓凸出的小骨頭（豌豆骨），骨頭下緣有一條硬筋，硬筋「靠無名指（內側）那一邊」的小凹窩就是神門。',
      cunReference: '無需量寸，直接以「小指與無名指指縫延伸線」與「手腕橫紋」交點凹窩定穴。',
      boneTip: '豌豆骨下緣、尺側腕屈肌腱「內側（靠大拇指側）」小凹窩',
      steps: [
        '①【畫直線】手掌朝上，順著「小指與無名指之間的指縫」畫一條直線往下到手腕橫紋。',
        '②【摸豌豆骨】在手腕橫紋小指側邊緣，摸到一顆圓硬的「豌豆骨」與連接它的一條大筋。',
        '③【摳內窩】用大拇指指尖卡進那條大筋的「內側緣（靠手腕中間側）」凹陷處，朝小指骨頭方向輕摳。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：凹窩雖小但一摳進去會有細微且深層的痠楚感，小指側會有溫熱放鬆感。',
        wrong: '❌ 常見按偏：很多人按到手腕正中間或壓在豌豆骨硬骨頭上；記住它是貼著「小指側大筋的內邊緣」。'
      }
    },
    benefits: {
      tcmFunctions: ['養心安神', '清心瀉火', '通絡定悸'],
      symptoms: ['失眠焦慮', '多夢易醒', '胸悶心悸', '健忘']
    },
    massageGuide: {
      technique: '輕柔畫圓按揉 (睡前最佳)',
      fingerToUse: '穴位較淺且在肌腱旁，用對側大拇指指端輕輕摳住凹陷處，小幅度畫圓揉動。',
      sensation: '微痠微脹，伴隨心情逐漸平緩放鬆。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'SP6', comboName: '交通心腎安眠方', purpose: '神門配三陰交，滋陰養血安神，改善思慮過度型失眠。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '睡前 30 分鐘配合腹式呼吸按揉效果最佳，力道宜輕緩忌暴烈。'
    }
  },
  {
    id: 'SI3',
    name: '後谿',
    pinyin: 'Hòu Xī',
    meridian: '手太陽小腸經',
    attribute: '輸穴・八脈交會穴（通督脈，治頸項強痛奇穴）',
    views: {
      back: { x: 294, y: 315 },
      hand: { x: 88, y: 245 }
    },
    location: {
      anatomical: '手內側，第 5 掌指關節尺側近端赤白肉際凹陷中。',
      quickFind: '把拳頭握起來，看小指外側手掌邊緣，會折出兩條明顯橫紋；後面（靠近手腕側，也就是手掌感情線延伸出來）那條橫紋盡頭凸起肉球的正後方骨縫凹窩。',
      cunReference: '握拳時感情線在手掌外側摺出的「尖端終點」加上第五掌骨小頭後方骨縫。',
      boneTip: '小指根部關節（第五掌骨小頭）後方尺側凹陷，紅白肉交界處',
      steps: [
        '①【微握拳】將手掌微握拳，觀察小指外側邊緣（手刀砍下去的那一側）。',
        '②【看感情線】找到手掌心「感情線」延伸到手刀邊緣所折出的那條最深橫紋盡頭。',
        '③【頂骨頭下】在橫紋盡頭處摸到小指根部凸出的關節骨頭，往骨頭「後方（靠近手腕側）底下」用力頂進去！'
      ],
      hitCheck: {
        correct: '✅ 按對體感：把這個點壓在書桌稜角上滾動，會有極強烈的痠痛感，一邊滾一邊轉動脖子，脖子僵硬會瞬間鬆一半！',
        wrong: '❌ 常見按偏：不要按到手背皮膚上，要在手掌肉（白肉）與手背皮（紅肉）交界的「手刀正側面骨頭下緣」。'
      }
    },
    benefits: {
      tcmFunctions: ['通督脈氣血', '舒筋利竅', '清熱解痙'],
      symptoms: ['肩頸痠痛', '落枕', '急性閃腰', '用眼過度']
    },
    massageGuide: {
      technique: '桌緣滾壓法 或 拇指掐揉 + 轉動脖子',
      fingerToUse: '【上班族神技】直接把雙手小指尺側後谿穴靠在書桌邊緣來回滾動按壓，同時緩慢左右轉動脖子！',
      sensation: '小指掌側邊緣有強烈痠痛感，同時頸部後側僵硬感會明顯鬆開。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'GB20', comboName: '落枕速解方', purpose: '一邊按揉後谿穴活動頸部，一邊放鬆風池穴，落枕急救首選。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '按壓時同步緩慢活動肩頸或腰部（動氣療法），效果加倍。'
    }
  },
  {
    id: 'GV20',
    name: '百會',
    pinyin: 'Bǎi Huì',
    meridian: '督脈',
    attribute: '諸陽之會（三陽五會，提振陽氣與醒腦要穴）',
    views: {
      front: { x: 200, y: 38 },
      back: { x: 200, y: 38 },
      head: { x: 200, y: 58 }
    },
    location: {
      anatomical: '頭部，當前髮際正中直上 5 寸，或兩耳尖連線的中點處。',
      quickFind: '把兩邊耳朵往前折，找到耳朵最高尖端（耳尖）；雙手大拇指壓住兩耳尖，兩隻中指往頭頂正中央連線交會，摸到頭骨上有一個像綠豆大小的微凹窩就是百會。',
      cunReference: '兩耳尖直上連線 × 鼻尖眉心正中線，十字交會點。',
      boneTip: '頭頂正中央，頂骨骨縫交界處的小凹窩',
      steps: [
        '①【定耳尖】雙手大拇指分別按住左右兩邊耳朵的最高點（耳尖）。',
        '②【十字交會】兩手中指順著頭頂往上伸直相碰，並對準鼻子、眉心往上延伸的正中線。',
        '③【摸小凹窩】用中指指腹在交會點前後微移 0.5 公分，會摸到頭骨上有一個微小凹陷（按下去最痠脹處）。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：垂直往下壓時，頭頂中心有一股明顯的「重脹微痠感」，按完眼睛跟腦袋會有發亮清醒感。',
        wrong: '❌ 常見按偏：不要抓髮旋（每個人的髮旋位置不同，多數偏後），一定要用「兩耳尖連線 × 鼻樑中線」十字定位！'
      }
    },
    benefits: {
      tcmFunctions: ['升陽舉陷', '醒腦開竅', '安神定志', '平肝熄風'],
      symptoms: ['頭痛', '頭暈腦脹', '失眠焦慮', '下午昏沉嗜睡']
    },
    massageGuide: {
      technique: '指腹端坐緩壓 或 五指拿捏叩擊',
      fingerToUse: '以中指或大拇指指腹垂直置於百會穴，先順時針揉 30 圈、再逆時針揉 30 圈；或以五指微彎如梳子輕敲頭頂。',
      sensation: '頭頂有溫熱脹感，腦部緊繃感隨之散開。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: false }
    },
    pairings: [
      { partnerId: 'GB20', comboName: '清腦明目方', purpose: '百會配風池，改善用腦過度、頭昏沉重。' },
      { partnerId: 'KI1', comboName: '上下引火歸元', purpose: '百會配腳底湧泉，平衡上熱下寒。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '血壓極高發作期不適合重叩，宜改為輕柔撫按。'
    }
  },
  {
    id: 'EX-HN3',
    name: '印堂',
    pinyin: 'Yìn Táng',
    meridian: '經外奇穴（入督脈）',
    attribute: '安神定驚要穴（舒緩眉心緊鎖、失眠與鼻塞奇穴）',
    views: {
      front: { x: 200, y: 60 },
      head: { x: 200, y: 185 }
    },
    location: {
      anatomical: '額部，當兩眉頭連線的中點處。',
      quickFind: '看著鏡子，找到左右兩邊眉毛內側起點（眉頭），兩眉頭連線的「正中央 1/2 處」就是印堂穴。',
      cunReference: '兩眉頭內側端連線之正中點。',
      boneTip: '額骨鼻部正中央（摸下去骨頭平坦微凹處）',
      steps: [
        '①【找雙眉頭】用食指與中指分別點住左右兩側眉毛的內側起點。',
        '②【取正中央】移到兩眉頭連線的正中間點。',
        '③【往上輕推或揪捏】用中指指腹按住印堂，由下往上朝額頭方向緩慢推抹，或用拇指與食指輕輕把印堂皮肉往上提捏。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：眉心緊繃感瞬間鬆開，閉著眼睛往上慢推 20 下，會產生明顯的睡意與呼吸深長感。',
        wrong: '❌ 常見按偏：不要往下壓在鼻樑骨凹陷最深處（那是山根），印堂在「兩眉頭水平連線正中間」。'
      }
    },
    benefits: {
      tcmFunctions: ['鎮靜安神', '清頭明目', '宣通鼻竅'],
      symptoms: ['失眠焦慮', '頭痛', '鼻塞流涕', '用眼過度']
    },
    massageGuide: {
      technique: '中指由下往上慢推（開天門）或 指腹畫圓',
      fingerToUse: '閉上雙眼，用右手食中二指從印堂穴開始，順著額頭正中線往上慢推到髮際線（小兒推拿稱「開天門」），重複 36 次。',
      sensation: '眉心微痠溫熱，緊鎖的眉頭與前額瞬間舒展。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: false }
    },
    pairings: [
      { partnerId: 'HT7', comboName: '秒睡安神方', purpose: '印堂配神門，專治睡前大腦停不下來、眉心緊繃。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '力道宜輕柔緩慢，有助誘發副交感神經放鬆。'
    }
  },
  {
    id: 'EX-HN5',
    name: '太陽',
    pinyin: 'Tài Yáng',
    meridian: '經外奇穴',
    attribute: '頭面奇穴（偏頭痛與眼疲勞急救穴）',
    views: {
      front: { x: 173, y: 66 },
      head: { x: 112, y: 205 }
    },
    location: {
      anatomical: '顳部，當眉梢與目外眥（眼尾）之間，向後約一橫指的凹陷處。',
      quickFind: '找到「眉毛尾端」與「外眼角」兩個點，取這兩點連線的中間，往耳朵方向橫移「一根大拇指寬」，摸到眼眶骨外側後方有一個明顯凹窩（咬牙時肉會鼓起來的地方）。',
      cunReference: '眉梢與外眼角連線中點，向後約 1 寸（一拇指寬）凹陷處。',
      boneTip: '眼眶外側骨緣後方凹窩（咬緊牙關時顳肌隆起處）',
      steps: [
        '①【找中點】看著鏡子，找到眉毛尾巴（眉梢）與外眼角連線的正中心。',
        '②【後移一指】從這個中心點往耳朵方向滑動約 1 根手指寬，越過眼眶外側硬骨頭。',
        '③【咬牙確認】在凹窩處輕按，試著上下咬緊牙齒，感覺指腹下有肌肉鼓動，那個凹窩中心就是太陽穴。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：指腹畫圈揉動時，會有溫和的痠脹感延伸到同側眼眶與頭側，緊繃的偏頭痛隨之舒緩。',
        wrong: '❌ 常見按偏：若按到硬骨頭代表太靠前（壓在眼眶骨上）；往後滑進軟凹窩才對。'
      }
    },
    benefits: {
      tcmFunctions: ['清肝明目', '疏風解表', '通絡止痛'],
      symptoms: ['頭痛', '用眼過度', '頭暈腦脹']
    },
    massageGuide: {
      technique: '雙手拇指或中指輕柔打圈按揉',
      fingerToUse: '雙手中指指腹同時置於兩側太陽穴，閉眼深呼吸，由輕到重緩慢畫圓揉動。',
      sensation: '眼眶周圍與太陽穴出現舒爽的微痠脹感。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'BL2', comboName: '3C 護眼方', purpose: '太陽配攢竹，輪刮眼眶，迅速緩解乾眼與視力模糊。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '太陽穴下方骨板較薄且有顳淺動脈經過，只宜指腹溫和揉按，嚴禁暴力撞擊。'
    }
  },
  {
    id: 'BL2',
    name: '攢竹',
    pinyin: 'Cuán Zhú',
    meridian: '足太陽膀胱經',
    attribute: '明目要穴（眼保健操第一穴）',
    views: {
      front: { x: 191, y: 63 },
      head: { x: 168, y: 192 }
    },
    location: {
      anatomical: '面部，當眉頭陷中，眶上切迹處。',
      quickFind: '把大拇指放在兩邊眉毛內側起點（眉頭），往眼窩上方的眉骨下緣摸，會摸到骨頭邊緣有一個小小的「米粒狀缺口凹槽（眶上切迹）」，往上頂超痠的那個點！',
      cunReference: '內眼角直上，眉頭正中眼眶骨上緣凹槽。',
      boneTip: '眉頭下方、眼眶骨上緣內側的「骨頭小凹槽（眶上切迹）」',
      steps: [
        '①【對內眼角】雙手大拇指從左右內眼角垂直往上滑到眉頭。',
        '②【摸骨凹槽】用大拇指指腹沿著眉頭下方的眼眶骨邊緣左右微摸，找到骨頭上一個明顯的小凹槽。',
        '③【朝額頭頂】大拇指從下往上「朝額頭方向」頂住眉骨凹槽（注意：是往上頂骨頭，絕對不是往裡壓眼球！）。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：一往上頂，整個眉心跟眼窩上方會出現極其痠爽的脹感，原本乾澀的眼睛會自然分泌淚水濕潤。',
        wrong: '❌ 常見按偏：如果只摸到眉毛皮膚表面沒感覺，是因為施力角度平貼臉部；要把拇指放到眉骨「下緣」往上頂！'
      }
    },
    benefits: {
      tcmFunctions: ['清熱明目', '祛風通絡'],
      symptoms: ['用眼過度', '頭痛', '鼻塞流涕']
    },
    massageGuide: {
      technique: '雙拇指由下往上頂推眉骨',
      fingerToUse: '雙手大拇指指腹抵住眉頭下方的眼眶骨凹槽，朝「額頭上方」微用力頂按，切勿壓迫眼球。',
      sensation: '眉頭與眼窩深處立刻產生明顯痠脹感，眼睛隨之濕潤放鬆。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'EX-HN5', comboName: '明目舒眉方', purpose: '由攢竹順著眉弓一路推摩至太陽穴，解除皺眉肌緊繃。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '施力方向務必朝向額骨上方，絕對不可按壓眼球本身。'
    }
  },
  {
    id: 'LI20',
    name: '迎香',
    pinyin: 'Yíng Xiāng',
    meridian: '手陽明大腸經',
    attribute: '手足陽明交會穴（「不聞香臭從何治，迎香二穴可堪攻」）',
    views: {
      front: { x: 193, y: 76 },
      head: { x: 175, y: 262 }
    },
    location: {
      anatomical: '面部，鼻翼外緣中點旁，當鼻唇溝（法令紋）中。',
      quickFind: '對鏡子微笑露出法令紋，找到左右鼻翼最寬處的「外側中點」，卡在鼻翼軟肉與臉頰骨頭交界的法令紋溝裡，往鼻樑內上方頂進去。',
      cunReference: '鼻翼外緣中點旁開約 0.5 寸，鼻唇溝（法令紋）凹陷處。',
      boneTip: '鼻翼最寬處外側、上頜骨鼻根凹陷邊緣',
      steps: [
        '①【找鼻翼中點】先看鼻子兩側鼓起的鼻翼，找到鼻翼上下高度的「正中間點」。',
        '②【卡法令紋】從鼻翼外緣往外移約 0.3 公分，剛好落在法令紋溝裡。',
        '③【向鼻根頂】用食指指尖「斜向內上方（朝對側眼睛內角方向）」壓住上顎骨邊緣。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：鼻腔深處跟門牙上方會有明顯痠脹感，按住 10 秒放開，塞住的鼻孔會突然通氣！',
        wrong: '❌ 常見按偏：不要只把鼻翼軟骨壓扁（那樣反而把鼻孔捏住），要按在鼻翼外側的臉頰骨溝裡。'
      }
    },
    benefits: {
      tcmFunctions: ['宣肺通鼻', '疏散風熱', '通利鼻竅'],
      symptoms: ['鼻塞流涕', '過敏打噴嚏', '臉部浮腫']
    },
    massageGuide: {
      technique: '食指點揉 + 順鼻樑上下搓熱',
      fingerToUse: '雙手食指指腹同時按住兩側迎香穴，向內上方（鼻根方向）頂按，或沿鼻翼兩側上下快速搓擦至發熱。',
      sensation: '鼻腔內側有痠脹感，原本塞住的鼻道會瞬間通氣。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'LI4', comboName: '過敏鼻炎方', purpose: '迎香配同屬大腸經的合谷穴，標本兼顧通鼻竅。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '鼻翼若有青春痘發炎破皮時暫停搓揉。'
    }
  },
  {
    id: 'TE17',
    name: '翳風',
    pinyin: 'Yì Fēng',
    meridian: '手少陽三焦經',
    attribute: '手足少陽交會穴（消臉部水腫、止耳鳴、解牙關緊繃要穴）',
    views: {
      back: { x: 174, y: 74 },
      head: { x: 105, y: 278 }
    },
    location: {
      anatomical: '頸部，耳垂後方，乳突下端前方凹陷中。',
      quickFind: '把耳垂往後壓貼在皮膚上，耳垂邊緣點到的位置後面，剛好是「耳朵後方凸骨（乳突）」跟「下巴骨後緣（下頷角）」夾住的一個超深小凹窩，張嘴時凹窩會變大！',
      cunReference: '耳垂後方，張口時下頜角後緣與乳突間之明顯凹陷處。',
      boneTip: '耳後乳突骨下緣與下顎骨支後緣之間的深凹窩',
      steps: [
        '①【貼耳垂】摸到左右耳垂正後方。',
        '②【微張嘴找凹窩】嘴巴稍微張開「啊—」，耳垂後方、下巴骨後緣會立刻出現一個明顯凹洞。',
        '③【朝對耳頂】嘴巴閉上放鬆，用中指或食指指腹塞進凹洞，朝「頭顱內部斜上方」溫和點揉。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：耳根深處與舌根會有極為強烈的痠脹感（愛咬牙切齒或臉水腫的人一按就超痠），按完下巴線條與耳朵頓時輕鬆。',
        wrong: '❌ 常見按偏：不要用力猛戳到太下面的頸部血管，就是緊貼著「耳垂正後方」那個骨頭凹洞！'
      }
    },
    benefits: {
      tcmFunctions: ['聰耳通竅', '散內瀉熱', '舒緩咬肌與臉部浮腫'],
      symptoms: ['耳鳴重聽', '臉部浮腫', '牙痛', '頭暈腦脹', '磨牙牙關緊']
    },
    massageGuide: {
      technique: '食中指腹溫和深揉',
      fingerToUse: '雙手食指或中指指腹扣住兩側耳垂後翳風穴，先深按 5 秒再小幅畫圈揉開。',
      sensation: '耳道深處與下顎關節出現明顯痠脹溫熱感。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'GB20', comboName: '聰耳清頭方', purpose: '翳風配風池，改善耳鳴、頭暈與頸部淋巴循環。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '深層有面神經幹經過，力道以「痠脹舒適」為度，忌用硬物重戳。'
    }
  },
  {
    id: 'GB20',
    name: '風池',
    pinyin: 'Fēng Chí',
    meridian: '足少陽膽經',
    attribute: '手足少陽與陽維脈交會穴（治風、解頸僵第一要穴）',
    views: {
      back: { x: 184, y: 80 },
      head: { x: 132, y: 318 }
    },
    location: {
      anatomical: '項部，當枕骨之下，胸鎖乳突肌與斜方肌上端之間的凹陷處。',
      quickFind: '雙手大拇指從後腦勺骨頭往下滑，滑到頭骨結束、變成脖子軟肉的交界處；在脖子正中央兩條粗筋（斜方肌）的外側，會摸到左右各一個能塞進大拇指的「大凹窩」就是風池。',
      cunReference: '後髮際正中旁開約 2 寸，與耳垂齊平的顱底凹窩。',
      boneTip: '後腦勺枕骨下緣，斜方肌與胸鎖乳突肌兩大筋之間的凹窩',
      steps: [
        '①【滑下頭骨】雙手十指交叉抱住後腦勺，兩隻大拇指順著後腦硬骨頭往下滑，直到掉進脖子上緣的軟溝。',
        '②【跨過大筋】大拇指從脖子正中間往左右兩側撥，越過正後方那兩條粗硬的直筋（斜方肌），落進外側的大凹窩（高度約與耳垂齊平）。',
        '③【朝對眼推】左大拇指朝「右眼珠」方向、右大拇指朝「左眼珠」方向，斜向上往頭骨底部頂進去！'
      ],
      hitCheck: {
        correct: '✅ 按對體感：只要角度有「斜向上朝對側眼睛頂」，痠脹感會直接穿透後腦勺直達眼眶後方，超解頸僵與眼酸！',
        wrong: '❌ 常見按偏：如果平平地往脖子前方壓，只會壓到脖子肌肉甚至壓迫喉嚨不舒服；一定要「往上頂頭骨底緣」！'
      }
    },
    benefits: {
      tcmFunctions: ['祛風解表', '清頭明目', '通絡鬆頸'],
      symptoms: ['肩頸痠痛', '落枕', '頭痛', '用眼過度', '感冒初期畏寒']
    },
    massageGuide: {
      technique: '雙手抱頭、拇指朝對側眼睛方向深推',
      fingerToUse: '雙手十指交叉抱住後腦勺，兩隻大拇指剛好扣在左右風池穴，施力方向要「斜向上朝對側眼睛（左拇指朝右眼、右拇指朝左眼）」頂按揉動。',
      sensation: '後腦勺與眼眶深處出現極為痠爽的得氣感，脖子緊繃立刻緩解。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'GB21', comboName: '疏通肩頸膽經方', purpose: '風池配肩井，從後腦一路鬆到肩膀。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '施力請朝斜上方顱底邊緣，切勿直接重壓前側頸動脈竇。'
    }
  },
  {
    id: 'GB21',
    name: '肩井',
    pinyin: 'Jiān Jǐng',
    meridian: '足少陽膽經',
    attribute: '手足少陽與陽維脈交會穴（肩背氣血樞紐）',
    views: {
      front: { x: 162, y: 122 },
      back: { x: 162, y: 122 }
    },
    location: {
      anatomical: '肩上，前直乳中，當大椎與肩峰端連線的中點上。',
      quickFind: '低頭摸到脖子後方根部最凸出的脊椎骨（大椎穴），再摸到肩膀最外側的骨頭尖端（肩峰），這兩點連線的「正中間 1/2 處」（也是肩膀肌肉最高處）。',
      cunReference: '頸後最高骨（第七頸椎大椎）與肩膀最外側骨尖（肩峰）連線正中點。',
      boneTip: '大椎與肩峰連線 1/2 中點，斜方肌上束最高點',
      steps: [
        '①【摸頸椎凸骨】低頭，用中指摸到脖子後方根部最凸出的那顆大骨頭（第七頸椎）。',
        '②【摸肩峰外端】再摸到肩膀外側最邊緣的骨頭頂點（肩峰）。',
        '③【折半下壓】取這兩個骨頭連線的「正中間點」，用對側手的中指垂直往下深按（或四指抓起整塊斜方肌往上提捏）。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：一壓下去會有「整塊肩膀又痠又軟、忍不住想聳肩或嘆氣」的強烈得氣感。',
        wrong: '❌ 常見按偏：太靠前會壓到鎖骨骨頭（痛而不痠），太靠後會滑到肩胛骨硬板上；要在肩膀正上方肌肉最厚處的正中間。'
      }
    },
    benefits: {
      tcmFunctions: ['祛風清熱', '活絡消腫', '調暢氣機'],
      symptoms: ['肩頸痠痛', '落枕', '手臂麻木', '頭痛']
    },
    massageGuide: {
      technique: '對側手四指拿捏提拉 或 中指深按',
      fingerToUse: '用右手食、中、無名指扣住左肩肩井穴（反之亦然），往後下方沉肩的同時用指腹深按，或配合大拇指做「拿肩井」提捏放鬆。',
      sensation: '整個肩膀與上背會產生強烈痠麻感，放鬆後肩頭明顯變輕。',
      rhythm: { pressSeconds: 5, releaseSeconds: 3, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'SI3', comboName: '上下解痙方', purpose: '肩井配後谿，一上一下快速鬆開斜方肌。' }
    ],
    contraindications: {
      pregnancyForbidden: true,
      notes: '⚠️ 孕婦禁按！肩井穴下氣力強，古籍列為催產禁穴。'
    }
  },
  {
    id: 'SP10',
    name: '血海',
    pinyin: 'Xuè Hǎi',
    meridian: '足太陰脾經',
    attribute: '脾經氣血聚集之海（婦科調經、活血化瘀、皮膚止癢要穴）',
    views: {
      front: { x: 184, y: 392 }
    },
    location: {
      anatomical: '大腿前區，髕底內側端上 2 寸，股內側肌隆起處。',
      quickFind: '坐姿膝蓋彎曲 90 度，先摸到膝蓋骨（髕骨）內側上緣，往上量「三根手指寬（2 寸）」的大腿內側肌肉鼓起處；或者用對側手掌心蓋住膝蓋骨，大拇指自然張開 45 度點到的大腿內側處就是血海！',
      cunReference: '膝蓋骨內側上緣直上 2 寸（食、中、無名三指寬），股內側肌隆起中點。',
      boneTip: '髕骨內上角直上三橫指、股內側肌最豐厚隆起處',
      steps: [
        '①【掌心蓋膝】坐著屈膝 90 度，用你的「右手掌心」正對著蓋住「左膝蓋骨」（反之用左手蓋右膝）。',
        '②【拇指張開】五指自然張開朝上，大拇指與其他四指呈約 45 度角。',
        '③【點壓拇指尖】大拇指指尖在大腿內側點到的那塊肌肉隆起中心，用力深壓超痠處就是血海穴！'
      ],
      hitCheck: {
        correct: '✅ 按對體感：大腿內側肌肉深層有非常明顯的痠脹微痛感（有瘀血體質或經痛者一按就痛）。',
        wrong: '❌ 常見按偏：不要按在膝蓋骨硬骨頭上，它是膝蓋骨上緣再往上三根手指的大腿內側肉上。'
      }
    },
    benefits: {
      tcmFunctions: ['活血化瘀', '養血調經', '祛風止癢'],
      symptoms: ['經痛', '手腳冰冷', '皮膚乾癢過敏', '膝蓋僵硬']
    },
    massageGuide: {
      technique: '雙手大拇指交疊深按揉動',
      fingerToUse: '坐姿將雙手大拇指交疊按在血海穴上，朝大腿骨方向深壓揉動。',
      sensation: '大腿內側產生深沉痠脹感，下肢循環隨之溫熱。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'SP6', comboName: '調經暖宮雙穴', purpose: '血海配三陰交，活血養血、緩解經期悶痛與血塊。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '經期前一周每天按揉 2 分鐘，順暢氣血效果極佳。'
    }
  },
  {
    id: 'ST36',
    name: '足三里',
    pinyin: 'Zú Sān Lǐ',
    meridian: '足陽明胃經',
    attribute: '合穴・胃下合穴（「肚腹三里留」，長壽保健第一大穴）',
    views: {
      front: { x: 174, y: 465 },
      foot: { x: 142, y: 125 }
    },
    location: {
      anatomical: '小腿前外側，當犢鼻（外膝眼）下 3 寸，距脛骨前緣一橫指（中指）。',
      quickFind: '坐著膝蓋彎曲 90 度，先摸到膝蓋骨下方外側的小凹窩（外膝眼），往下比「四根手指併攏寬度」，再從小腿正前方最硬的迎面骨（脛骨）往外側移「一根中指寬」。',
      cunReference: '食、中、無名、小指四指併攏寬度 = 3 寸（夫指同身寸），脛骨前緣往外 1 橫指。',
      boneTip: '外膝眼下四橫指、小腿脛骨前嵴外側一橫指（勾腳尖時肌肉會鼓起處）',
      steps: [
        '①【找外膝眼】坐姿屈膝 90 度，在膝蓋骨下方找到左右兩個凹窩，外側那個凹窩叫「外膝眼（犢鼻穴）」。',
        '②【量四指寬】將「食、中、無名、小指」四指併攏，食指上緣貼齊外膝眼，小指下緣的高度就是垂直座標。',
        '③【離骨一指＋勾腳驗證】在該高度摸到小腿正中央硬骨頭（脛骨），往外側移 1 根中指寬；按住這裡並把「腳背往上勾」，感覺手指下的肌肉明顯頂起來，就 100% 準了！'
      ],
      hitCheck: {
        correct: '✅ 按對體感：用力深按時，痠麻感會順著小腿前外側一路傳導到腳背，甚至肚子會開始咕嚕咕嚕叫（腸胃蠕動）！',
        wrong: '❌ 常見按偏：如果按到硬骨頭代表太靠內側（壓在脛骨上）；如果勾腳尖時手指下肌肉沒動，代表太靠外側了。'
      }
    },
    benefits: {
      tcmFunctions: ['健脾和胃', '補中益氣', '扶正培元', '通經活絡'],
      symptoms: ['胃脹噁心', '消化不良', '便秘', '雙腿痠軟疲勞']
    },
    massageGuide: {
      technique: '大拇指深按 或 握拳關節敲打',
      fingerToUse: '足三里肌肉較厚，可用大拇指指腹用力深按揉動，或直接用拳頭指關節、刮痧板鈍端垂直點按。',
      sensation: '痠麻感常會順著小腿外側一路往下傳導到腳背與第二腳趾。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'PC6', comboName: '脾胃黃金雙穴', purpose: '足三里配內關，調理一切腸胃不適。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '飯後 30 分鐘內不宜重按，飯後 1 小時或辰時（早上 7-9 點）按揉養胃效果最佳。'
    }
  },
  {
    id: 'ST40',
    name: '豐隆',
    pinyin: 'Fēng Lóng',
    meridian: '足陽明胃經',
    attribute: '絡穴（「治痰祛濕第一大穴」，消水腫與化痰名穴）',
    views: {
      front: { x: 168, y: 505 },
      foot: { x: 122, y: 215 }
    },
    location: {
      anatomical: '小腿前外側，外踝尖上 8 寸，脛骨前緣外二橫指（中指）處。',
      quickFind: '不用死背 8 寸！直接找到「膝蓋外側凹窩（外膝眼）」跟「腳外踝尖端」這兩點，取小腿長度的「正中間 1/2 高度」，再從小腿正前方硬骨頭（脛骨）往外側移「兩根手指寬」的豐厚肌肉處就是豐隆！',
      cunReference: '外膝眼與外踝尖連線之「正中點高度」，脛骨前緣往外 2 橫指。',
      boneTip: '小腿正中間高度，脛骨前嵴外側兩橫指肌肉最豐隆處',
      steps: [
        '①【小腿折半】看小腿側面，抓出膝蓋下方（外膝眼）到腳外踝尖連線的「正中間 1/2 高度」。',
        '②【摸迎面骨】在這個高度摸到小腿正前方的硬骨頭（脛骨前緣）。',
        '③【外移兩指】從硬骨頭往小腿外側量「食指＋中指」兩指寬，深壓那塊最厚實的肌肉就是豐隆穴。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：肌肉深層會有沉重的痠脹痛感（體內濕氣重、容易水腫或喉嚨有痰的人按起來特別痠痛）。',
        wrong: '❌ 常見按偏：足三里距離脛骨只有「1 指寬」，而豐隆穴在更下面且距離脛骨有「2 指寬」！'
      }
    },
    benefits: {
      tcmFunctions: ['健脾化痰', '和胃祛濕', '消水腫通絡'],
      symptoms: ['下肢水腫', '消化不良', '咳嗽氣喘', '雙腿痠軟疲勞']
    },
    massageGuide: {
      technique: '雙手拇指交疊用力深揉 或 刮痧板由上往下刮',
      fingerToUse: '此處肌肉極為豐厚，建議將雙手大拇指疊在一起用力往深層按揉，每次深壓 5 秒。',
      sensation: '小腿外側深處產生強烈痠脹感，按完小腿緊繃腫脹感明顯消退。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'SP6', comboName: '強力祛濕消腫方', purpose: '豐隆配三陰交，脾胃同調，排除體內多餘水濕。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '常喝冰飲、下半身易浮腫者可每日按揉。'
    }
  },
  {
    id: 'SP6',
    name: '三陰交',
    pinyin: 'Sān Yīn Jiāo',
    meridian: '足太陰脾經',
    attribute: '肝、脾、腎三條陰經交會穴（婦科與養陰美顏聖穴）',
    views: {
      front: { x: 188, y: 545 },
      foot: { x: 252, y: 275 }
    },
    location: {
      anatomical: '小腿內側，當足內踝尖上 3 寸，脛骨內側緣後方凹陷處。',
      quickFind: '找到腳踝內側最凸出的那顆圓骨頭最高點（內踝尖），往上比「四根手指併攏寬度」，然後摸到小腿內側大骨頭（脛骨），「緊貼著骨頭後方的邊緣縫隙」往下摳！',
      cunReference: '內踝尖最高點直上 3 寸（四指併攏寬），緊貼脛骨後緣骨縫。',
      boneTip: '內踝尖上四橫指，緊貼小腿「脛骨後緣骨邊」（不是小腿肚軟肉中央！）',
      steps: [
        '①【摸內踝尖】盤腿或翹腳，摸到腳踝內側最凸出的骨頭尖端（內踝尖）。',
        '②【往上四指】四指併攏（食、中、無名、小指），小指下緣貼齊內踝尖最高點，看食指上緣的高度。',
        '③【摳骨頭後緣】在食指高度，先摸到小腿內側硬邦邦的寬骨頭（脛骨），大拇指滑到這根骨頭的「正後方邊緣」，朝骨頭底下深摳進去！'
      ],
      hitCheck: {
        correct: '✅ 按對體感：貼著骨頭後緣一按，會有非常明顯的「骨邊痠痛脹感」（常熬夜、水腫或經期前後的人一碰就超痠）。',
        wrong: '❌ 常見按偏：90% 的人按不準是因為按到後面軟軟的小腿肚肌肉上；記住「一定要摸到脛骨邊緣、貼著骨頭縫按」！'
      }
    },
    benefits: {
      tcmFunctions: ['健脾化濕', '調補肝腎', '調經止痛', '養血安神'],
      symptoms: ['經痛', '手腳冰冷', '下肢水腫', '失眠焦慮', '消化不良']
    },
    massageGuide: {
      technique: '拇指緊貼骨緣深按揉動',
      fingerToUse: '大拇指指腹緊貼小腿脛骨後緣，朝骨頭內側方向深按並上下微幅撥動。',
      sensation: '骨邊有明顯痠痛或微脹感（脾濕重或經期前痠痛感會特別明顯）。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'HT7', comboName: '養血安眠方', purpose: '三陰交配神門，改善氣血不足或更年期失眠。' },
      { partnerId: 'KI3', comboName: '溫腎暖宮方', purpose: '三陰交配太谿，溫煦下肢、改善經痛與冰冷。' }
    ],
    contraindications: {
      pregnancyForbidden: true,
      notes: '⚠️ 孕婦禁按！三陰交與合谷並列孕期兩大禁穴，易引發宮縮。'
    }
  },
  {
    id: 'LR3',
    name: '太衝',
    pinyin: 'Tài Chōng',
    meridian: '足厥陰肝經',
    attribute: '原穴・輸穴（「消氣穴」，疏肝解鬱第一要穴）',
    views: {
      front: { x: 178, y: 612 },
      foot: { x: 192, y: 465 }
    },
    location: {
      anatomical: '足背側，當第 1、2 跖骨結合部之前凹陷處。',
      quickFind: '把大拇指放在腳背「大腳趾與第二腳趾中間的指縫」，順著兩根骨頭中間的溝往腳踝方向一路往上推，推到兩根骨頭呈「V 字形交會卡住、再也推不上去」的那個凹窩就是太衝！',
      cunReference: '不用量幾寸，直接順第 1、2 趾骨間溝往上推到「骨縫卡死處」最準！',
      boneTip: '腳背第一、二跖骨底結合部前方的「V 字骨縫終點」',
      steps: [
        '①【入趾縫】手指放在腳背「大腳趾與第二腳趾」之間的趾縫凹溝。',
        '②【順溝上推】貼著腳背骨頭中間的這條溝，往腳背上方滑推約 4 公分。',
        '③【卡 V 字底】當手指被兩根骨頭交會處（V 字形底端）擋住推不動時，退後 0.2 公分的凹窩中心就是太衝穴。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：往骨縫深處按並往腳趾方向推，會有強烈的「痠脹微痛感」（壓力大或晚睡時特別痛）。',
        wrong: '❌ 常見按偏：不要只按在腳趾縫軟蹼上（那是行間穴），一定要推到骨頭交會卡住的 V 字頂端凹窩。'
      }
    },
    benefits: {
      tcmFunctions: ['疏肝理氣', '平肝熄風', '清熱明目', '活血調經'],
      symptoms: ['頭痛', '失眠焦慮', '經痛', '用眼過度', '壓力煩躁']
    },
    massageGuide: {
      technique: '由上往下往腳趾方向推按 (瀉肝火)',
      fingerToUse: '用大拇指指尖垂直按入骨縫凹陷，若覺得壓力大、易怒口苦，可從太衝往腳趾縫（行間穴）方向單向推按。',
      sensation: '腳背骨縫有強烈痠脹痛感（熬夜或生氣時特別痛，按開後胸口會覺得舒暢）。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'LI4', comboName: '開四關', purpose: '太衝配合谷，疏通全身氣機、排解壓力與偏頭痛。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '腳背筋膜較薄，用指腹推揉即可，避免用尖銳物刮傷皮膚。'
    }
  },
  {
    id: 'KI3',
    name: '太谿',
    pinyin: 'Tài Xī',
    meridian: '足少陰腎經',
    attribute: '原穴・輸穴（補腎氣、滋腎陰之源頭大穴）',
    views: {
      back: { x: 188, y: 582 },
      foot: { x: 268, y: 368 }
    },
    location: {
      anatomical: '足內側，內踝後方，當內踝尖與跟腱之間的凹陷處。',
      quickFind: '找到腳踝內側凸出的圓骨頭（內踝尖），水平往腳後跟方向摸到粗大的阿基里斯腱（跟腱），在「骨頭與大筋連線的正中央凹窩」就是太谿。',
      cunReference: '內踝尖最高點與後側跟腱連線之「水平 1/2 中點凹窩」。',
      boneTip: '內踝尖與腳後跟大筋（跟腱）水平連線正中間的軟凹窩',
      steps: [
        '①【定內踝尖】摸到腳踝內側最凸出的骨頭尖端。',
        '②【摸跟腱】在同一水平高度，往後摸到腳後跟那條粗硬的大筋（跟腱）。',
        '③【取正中央】大拇指放在「內踝骨」與「後跟大筋」正中間的軟凹窩裡，往內踝骨後緣方向輕揉。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：深揉 1 分鐘後，腳踝內側會產生微痠脹與一股暖流往下傳到腳底（體虛者一開始按會覺得凹窩空空的沒力，揉久變溫熱）。',
        wrong: '❌ 常見按偏：不要按到腳外踝（外側是崑崙穴），太谿在「腳踝內側」！'
      }
    },
    benefits: {
      tcmFunctions: ['滋陰益腎', '壯陽強腰', '清熱安神'],
      symptoms: ['手腳冰冷', '腰痠背痛', '失眠焦慮', '咽喉乾痛']
    },
    massageGuide: {
      technique: '拇指溫和深揉 (補腎宜柔)',
      fingerToUse: '以對側大拇指指腹放入內踝後的凹窩中，溫和且持續地畫圓揉按，直到局部發暖。',
      sensation: '微痠脹或溫熱感（腎氣虛者初期按下去會覺得凹窩空軟無力，常按會變飽滿）。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'KI1', comboName: '固本培元方', purpose: '太谿配湧泉，泡腳後按揉，手腳暖和一整晚。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '酉時（傍晚 17:00-19:00）腎經當令或睡前泡腳後按揉效果最佳。'
    }
  },
  {
    id: 'BL60',
    name: '崑崙',
    pinyin: 'Kūn Lún',
    meridian: '足太陽膀胱經',
    attribute: '經穴（腰背痛、坐骨神經痛與腳踝扭傷急救大穴）',
    views: {
      back: { x: 166, y: 582 },
      foot: { x: 112, y: 368 }
    },
    location: {
      anatomical: '足部外踝後方，當外踝尖與跟腱之間的凹陷處。',
      quickFind: '跟內側的太谿穴剛好隔著腳後跟相對！摸到腳踝「外側」最凸出的骨頭（外踝尖），往後滑到腳後跟大筋（跟腱）中間的深凹窩就是崑崙穴。',
      cunReference: '足外踝尖與跟腱水平連線之 1/2 正中凹窩。',
      boneTip: '外踝尖與腳後跟大筋（跟腱）之間的凹窩',
      steps: [
        '①【摸外踝尖】找到腳踝外側最凸出的那顆圓骨頭。',
        '②【退入凹窩】水平往腳後跟方向滑半寸，掉進外踝骨與後跟大筋中間的凹槽。',
        '③【捏拿對按】可以用大拇指與食指同時捏住內側「太谿穴」與外側「崑崙穴」，一內一外對捏按揉！'
      ],
      hitCheck: {
        correct: '✅ 按對體感：腳踝外側凹窩有強烈痠麻感，久站腰痛或腳踝僵硬的人按完會覺得整條小腿後側鬆開。',
        wrong: '❌ 常見按偏：不要壓在外踝硬骨頭表面，要卡進骨頭後方的軟凹槽裡。'
      }
    },
    benefits: {
      tcmFunctions: ['舒筋活絡', '強腰健腎', '清熱止痛'],
      symptoms: ['腰痠背痛', '雙腿痠軟疲勞', '頭痛', '腳踝僵硬']
    },
    massageGuide: {
      technique: '拇指與食指「太谿＋崑崙」內外對捏按揉',
      fingerToUse: '一手大拇指按內側太谿、食指按外側崑崙，兩指同時向中心對捏揉動，一次保養腎經與膀胱經！',
      sensation: '整個腳後跟與阿基里斯腱周圍產生極度痠爽溫熱感。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'BL40', comboName: '膀胱經通腰方', purpose: '崑崙配委中，暢通整條足太陽膀胱經，緩解下背痛。' }
    ],
    contraindications: {
      pregnancyForbidden: true,
      notes: '⚠️ 孕婦禁按！崑崙穴與合谷、三陰交、肩井同列孕期禁穴。'
    }
  },
  {
    id: 'BL40',
    name: '委中',
    pinyin: 'Wěi Zhōng',
    meridian: '足太陽膀胱經',
    attribute: '合穴・膀胱下合穴（「腰背委中求」，腰痛必按要穴）',
    views: {
      back: { x: 175, y: 432 }
    },
    location: {
      anatomical: '膝後區，膕橫紋中點，當股二頭肌腱與半腱肌肌腱的中間。',
      quickFind: '坐著膝蓋微彎，摸到膝蓋正後方（腿彎處）那條橫紋，兩邊各有一條硬筋，在「橫紋正中央、兩條筋中間」的軟窩深處就是委中。',
      cunReference: '膝後膕窩橫紋之「正中點 1/2 處」。',
      boneTip: '膝後腿彎橫紋正中心、左右兩條大肌腱中間',
      steps: [
        '①【屈膝放鬆】坐姿將膝蓋彎曲，讓膝蓋後方的腿筋放鬆（站直時筋繃緊會按不進去）。',
        '②【摸兩側大筋】雙手摸到膝蓋正後方左右兩側各有一條明顯的粗筋。',
        '③【點橫紋中點】在膝後折紋的「正中央（兩筋之間）」，用大拇指或四指指腹往深處撥揉。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：屈膝深按時，膝窩深處會有明顯痠麻脹感，甚至往上串到大腿後側與後腰！',
        wrong: '❌ 常見按偏：如果站直著按，只會壓在緊繃的皮表上完全按不到深層穴位；一定要「坐著微屈膝」按！'
      }
    },
    benefits: {
      tcmFunctions: ['舒筋通絡', '散瘀活血', '清熱解毒'],
      symptoms: ['腰痠背痛', '急性閃腰', '雙腿痠軟疲勞', '膝蓋僵硬']
    },
    massageGuide: {
      technique: '坐姿屈膝、雙手大拇指或四指撥揉，或空掌拍打',
      fingerToUse: '坐著膝蓋微彎讓腿後筋放鬆，雙手四指扣住膝蓋後方委中穴向上提撥，或將手掌微拱成「空心掌」輕拍膝窩 36 下。',
      sensation: '膝窩痠脹感會向上延伸到大腿後側與後腰，腰部緊繃隨之鬆解。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'SI3', comboName: '通調督脈膀胱經腰痛方', purpose: '委中配後谿，久坐腰痛與閃腰急救。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '膝窩深處有重要血管與神經，切勿用硬物猛戳，以指腹揉按或空掌輕拍最安全。'
    }
  },
  {
    id: 'KI1',
    name: '湧泉',
    pinyin: 'Yǒng Quán',
    meridian: '足少陰腎經',
    attribute: '井穴（腎經第一穴，引火歸元、暖足助眠之源）',
    views: {
      back: { x: 176, y: 625 },
      foot: { x: 268, y: 542 }
    },
    location: {
      anatomical: '足底部，蜷足時足前部凹陷處，約當足底第 2、3 趾趾縫紋頭端與足跟連線的前 1/3 與後 2/3 交點上。',
      quickFind: '把五根腳趾頭用力往下捲曲（像腳掌抓地），腳底板前三分之一正中央會立刻凹下去變成一個「人」字形凹窩，那個凹窩的最深頂點就是湧泉穴！',
      cunReference: '腳趾捲曲時，足底前 1/3 與後 2/3 交界處的「人字紋頂點凹窩」。',
      boneTip: '足底第 2、3 跖骨頭後方，捲趾時最凹陷處',
      steps: [
        '①【用力捲趾】盤腿把腳搬上來，五根腳趾頭用力往腳底心方向彎曲抓緊。',
        '②【看人字紋】觀察腳底板前段肉球下方，會自然折出一個明顯的「人」字形凹溝。',
        '③【頂凹窩心】大拇指直接頂進「人」字形交叉頂點的最深凹窩裡，朝腳趾方向用力推按。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：深按會有強烈的痠脹微痛感，或用手心快速搓擦 100 下後，整雙腳底會發燙並湧起睡意。',
        wrong: '❌ 常見按偏：不要按到前面厚厚的腳掌肉墊上，也不要按到足弓正中間；捲腳趾時「最凹陷的那個坑」才是！'
      }
    },
    benefits: {
      tcmFunctions: ['滋陰降火', '引火歸元', '寧神開竅'],
      symptoms: ['失眠焦慮', '手腳冰冷', '頭暈腦脹', '雙腿痠軟疲勞']
    },
    massageGuide: {
      technique: '手心勞宮穴對搓湧泉（擦湧泉）或拇指推按',
      fingerToUse: '盤腿坐於床上，用左手手心（勞宮穴）快速上下摩擦右腳底湧泉穴 100 下直到腳底發燙，再換邊；或用大拇指深按。',
      sensation: '足底產生一股溫熱感並往上蔓延至小腿，頭頂燥熱感隨之下降。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'PC8', comboName: '心腎相交擦湧泉', purpose: '以手心勞宮擦足底湧泉，引火歸元、暖足助眠。' },
      { partnerId: 'KI3', comboName: '溫腎暖足方', purpose: '湧泉配太谿，告別冬季冰冷雙腳。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '睡前溫水泡腳擦乾後搓揉湧泉穴，助眠效果加倍。'
    }
  }
];

// 十二時辰子午流注・當令茶飲與食療宜忌
export const ZIWU_DIET = {
  '子時': {
    drink: '溫白開水一小口（勿多飲防夜尿）',
    cvs: '睡前宜空腹，若飢餓可喝 50cc 溫牛奶',
    avoid: '忌宵夜、炸物、酒精與濃茶，以免膽火上逆失眠'
  },
  '丑時': {
    drink: '熟睡養肝血（日間可飲枸杞菊花茶）',
    cvs: '若值夜班可喝溫熱無糖豆漿或溫開水',
    avoid: '忌熬夜飲酒、忌辛辣重鹹傷肝陰'
  },
  '寅時': {
    drink: '溫潤銀耳湯或溫開水潤肺',
    cvs: '溫豆漿、無糖燕麥奶',
    avoid: '忌冰水、生冷瓜果刺激氣管引發晨咳'
  },
  '卯時': {
    drink: '晨起第一杯 300cc 溫開水（約 40°C）喚醒大腸經',
    cvs: '溫開水、微溫無糖優酪乳或溫豆漿',
    avoid: '忌空腹喝冰美式咖啡或冰奶茶，易致腸痙攣'
  },
  '辰時': {
    drink: '小米山藥粥、紫米燕麥飲或溫熱黑糖薑茶',
    cvs: '7-11/全家：溫熱無糖豆漿＋烤地瓜或茶葉蛋',
    avoid: '忌空腹吃冰涼生菜沙拉、冰果昔，最傷胃陽'
  },
  '巳時': {
    drink: '陳皮茯苓茶、紅豆薏仁水（助脾經運化水濕）',
    cvs: '無糖紅豆水、黑豆水、無糖溫烏龍茶',
    avoid: '忌精製高糖甜點、手搖含糖珍奶（生痰生濕致腦霧）'
  },
  '午時': {
    drink: '蓮子百合茶、淡竹葉茶或玫瑰紅棗茶（清心養神）',
    cvs: '無糖綠茶、番茄汁、午餐宜七分飽配深色蔬菜',
    avoid: '忌午間暴飲暴食或猛灌冰飲，易致午後心悸昏沉'
  },
  '未時': {
    drink: '溫熱麥茶、葛根茶（助小腸分清泌濁、鬆肩頸）',
    cvs: '無糖大麥飲、溫熱蕎麥茶',
    avoid: '忌高油炸下午茶（雞排、蔥油餅），加重小腸負擔'
  },
  '申時': {
    drink: '黃金排毒期！必喝 300～500cc 溫開水或牛蒡茶',
    cvs: '大瓶溫礦泉水、無糖玉米鬚茶、黑豆水',
    avoid: '忌憋尿不喝水、忌高鈉洋芋片零嘴導致傍晚下肢水腫'
  },
  '酉時': {
    drink: '黑芝麻糊、黑豆枸杞茶、桑椹茶（黑色入腎）',
    cvs: '無糖黑豆漿、黑芝麻飲、溫熱昆布湯',
    avoid: '晚餐忌過鹹重口味（鹹傷腎）、忌生冷刺身'
  },
  '戌時': {
    drink: '玫瑰桂圓花茶、陳皮普洱（舒緩心包經壓力）',
    cvs: '無咖啡因蕎麥茶、溫熱南非國寶茶',
    avoid: '忌咖啡因飲料、忌情緒激動下暴食晚餐'
  },
  '亥時': {
    drink: '酸棗仁安神茶、洋甘菊茶（睡前 1 小時小口溫飲）',
    cvs: '溫牛奶、無咖啡因花草茶（21:30 後減少飲水）',
    avoid: '忌睡前大量喝水（導致水腫與夜尿）、忌滑手機配宵夜'
  }
};

// 24 大穴位專屬「本草茶飲 × 超商外食 × 按後痛感體質動態調方 × 按後忌口」資料庫
export const DIETARY_THERAPY = {
  LI4: {
    teaName: '菊花薄荷疏風茶',
    ingredients: '杭菊 5 朵 ＋ 薄荷葉 3 片 ＋ 炙甘草 2 片（300cc 熱水燜泡 5 分鐘）',
    effect: '配合合谷穴疏散風熱、清利頭目、緩解偏頭痛與牙齦腫痛',
    cvsOption: '🏪 超商救急：無糖溫綠茶、蜂蜜菊花茶；便秘者可選無糖高纖豆漿＋奇異果',
    byPainType: {
      sharp: '⚡【實火氣滯型】按合谷劇痛代表大腸經與頭面火氣旺：宜喝「綠茶＋薄荷葉」或金銀花茶清瀉實火。',
      empty: '☁️【衛氣偏虛型】按合谷空軟代表正氣不足、易感冒過敏：改喝「黃耆 5g ＋ 紅棗 3 顆 ＋ 生薑 1 片」補肺衛之氣。',
      smooth: '😌【日常平養型】按感微痠舒暢：晨起喝 300cc 溫開水加少許檸檬汁，保持腸道與氣機通暢。'
    },
    avoid: '🚫 按後 1 小時忌口：忌吃炸雞、麻辣鍋、堅果炒貨、花生與冰水（以免引火上炎或閉塞表氣）。',
    pregnancySafeAlt: '🤰 孕期提醒：合谷為孕期禁穴；茶飲方面孕婦宜避開濃薄荷與寒涼金銀花，改飲溫熱檸檬水或蘋果紅棗水。'
  },
  LU10: {
    teaName: '羅漢果麥冬潤肺飲',
    ingredients: '羅漢果 1/4 顆 ＋ 麥門冬 6g ＋ 胖大海 1 顆（400cc 熱水沖泡 8 分鐘）',
    effect: '配合魚際穴清瀉肺火、生津利咽，拯救冷氣房乾咳與講話過度的沙啞喉嚨',
    cvsOption: '🏪 超商救急：溫熱冰糖雪梨飲、川貝枇杷膏溫水沖泡、無糖溫豆漿（滋陰潤肺）',
    byPainType: {
      sharp: '⚡【肺熱乾痛型】魚際穴按之刺痛灼熱：代表肺火盛、咽喉發炎，宜喝「菊花＋桑葉＋羅漢果茶」或吃水梨清肺熱。',
      empty: '☁️【肺陰不足型】魚際肌肉扁塌空軟：代表久咳氣虛，宜吃「白木耳蓮子湯」或「百合蜂蜜溫水」養陰潤燥。',
      smooth: '😌【日常平養型】溫水小口慢飲，搭配少許蜂蜜或溫豆漿潤澤呼吸道。'
    },
    avoid: '🚫 按後 1 小時忌口：絕對忌吃烤物、餅乾、辛辣辣椒、冰沙與過甜巧克力（甜膩生痰、辛燥傷肺陰）。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦若有妊娠乾咳，可安心飲用「冰糖燉水梨」或「溫熱白木耳露」，避免飲用含中藥番瀉葉或麻黃成分飲品。'
  },
  PC8: {
    teaName: '蓮子心竹葉清心茶',
    ingredients: '帶心蓮子 6g ＋ 淡竹葉 3g ＋ 麥冬 5g（300cc 熱水燜泡 6 分鐘）',
    effect: '配合手心勞宮穴清瀉心包火，專治壓力大、嘴破舌瘡、手心燥熱與睡前思緒停不下來',
    cvsOption: '🏪 超商救急：無糖綠茶、蓮藕茶、苦瓜分解茶（清心火）；睡前可選溫牛奶或洋甘菊茶',
    byPainType: {
      sharp: '⚡【心火亢盛型】掌心勞宮按下去刺痛且手心發燙：宜喝「蓮子心茶」或吃苦瓜、綠豆湯清降心火。',
      empty: '☁️【心陰血虛型】按之空軟且易心慌盜汗：忌喝苦寒茶！改喝「桂圓 3 顆＋紅棗 3 顆＋枸杞 10 粒」溫養心血。',
      smooth: '😌【日常平養型】飲用溫熱百合蓮子湯或南非國寶茶，穩定自律神經。'
    },
    avoid: '🚫 按後 1 小時忌口：忌濃咖啡、能量飲料、酒精、重口味燒烤（防心率加快與交感神經再度亢奮）。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦心煩燥熱時，宜用「去心蓮子＋百合＋銀耳」燉湯，避免過於苦寒的純蓮子心茶。'
  },
  LU7: {
    teaName: '紫蘇生薑宣肺茶',
    ingredients: '紫蘇葉 3g ＋ 生薑 2 片 ＋ 陳皮 3g ＋ 紅糖少許（熱水燜泡 5 分鐘）',
    effect: '配合列缺穴宣肺解表、溫通頭項，吹冷氣受寒頭痛、脖子僵硬或初期流鼻水最有效',
    cvsOption: '🏪 超商救急：溫熱黑糖薑茶、溫熱檸檬紅茶（去冰）、關東煮熱湯加少許蔥花',
    byPainType: {
      sharp: '⚡【風寒束表型】骨縫按之劇痠痛伴隨肩頸緊：宜趁熱喝「蔥白生薑湯」或熱薑茶，微發汗把寒氣逼出去。',
      empty: '☁️【肺氣虛弱型】按之無力且吹風就頭痛：宜喝「黃耆紅棗枸杞茶」固表禦風。',
      smooth: '😌【日常平養型】陳皮溫紅茶或溫熱蕎麥茶，維持頸部與呼吸道溫暖。'
    },
    avoid: '🚫 按後 1 小時忌口：忌吹冷風直吹後頸、忌喝冰飲料、橘子（寒咳期忌吃）、西瓜與生魚片。',
    pregnancySafeAlt: '🤰 孕期提醒：紫蘇生薑茶本身就有「安胎止嘔、散寒解表」之效，孕婦受涼頭痛飲用極為安全溫和。'
  },
  PC6: {
    teaName: '陳皮生薑和胃飲',
    ingredients: '老陳皮 5g ＋ 生薑 2 片 ＋ 炒麥芽 6g（350cc 熱水燜泡 6 分鐘）',
    effect: '配合內關穴寬胸理氣、降逆止嘔，快速消除脹氣、打嗝、胃食道逆流與暈車反胃',
    cvsOption: '🏪 超商救急：溫熱無糖豆漿、蘇打餅乾 2 片（中和胃酸）、溫熱黑糖薑茶（止暈止吐）',
    byPainType: {
      sharp: '⚡【肝胃氣滯/食積型】內關深按極度痠脹且胸悶打嗝：宜喝「陳皮山楂玫瑰茶」或無糖烏梅汁消食導滯。',
      empty: '☁️【脾胃虛寒/心氣不足型】按之空軟且胃泛清水：宜喝「生薑紅棗茶」或溫熱小米粥溫中健脾。',
      smooth: '😌【日常平養型】飯後 30 分鐘飲用溫熱大麥茶或蕎麥茶，助消化防脹氣。'
    },
    avoid: '🚫 按後 1 小時忌口：忌甜食蛋糕、糯米製品（飯糰/麻糬）、氣泡水、濃咖啡與空腹喝濃茶（極易再度誘發胃酸逆流）。',
    pregnancySafeAlt: '🤰 孕期提醒：內關穴是中醫婦科公認的「害喜止吐第一穴」！孕吐時按內關配「生薑檸檬溫水」最安全；但茶飲請勿加山楂與玫瑰花。'
  },
  HT7: {
    teaName: '酸棗仁桂圓安神茶',
    ingredients: '炒酸棗仁（搗碎）8g ＋ 茯神 6g ＋ 桂圓肉 3 顆 ＋ 紅棗 2 顆（熱水燜泡 10 分鐘）',
    effect: '配合神門穴養心安神、斂汗助眠，改善躺床腦袋停不下來、淺眠多夢與半夜驚醒',
    cvsOption: '🏪 超商救急：溫熱鮮奶（含色胺酸）、無咖啡因洋甘菊花草茶、香蕉 1 根（含鎂助放鬆）',
    byPainType: {
      sharp: '⚡【心肝火旺失眠型】神門按之刺痛、心煩易怒：桂圓少放，改喝「百合＋菊花＋酸棗仁茶」清心安神。',
      empty: '☁️【心脾兩虛失眠型】按之空軟、多夢健忘臉色白：最適合喝「桂圓紅棗枸杞茶」或桂圓糯米粥養血安神。',
      smooth: '😌【日常平養型】睡前 1 小時喝 100cc 溫牛奶或南非國寶茶，平緩心率。'
    },
    avoid: '🚫 按後 1 小時忌口：下午 2 點後忌碰咖啡、抹茶、紅茶、可樂與黑巧克力；睡前忌重鹹宵夜。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦失眠不宜吃過多桂圓（性溫易上火），建議改喝「溫牛奶」或「蓮子百合銀耳湯」最安胎助眠。'
  },
  SI3: {
    teaName: '葛根桂枝舒筋茶',
    ingredients: '粉葛根 8g ＋ 桑枝 5g ＋ 紅棗 3 顆（400cc 熱水燜泡或煮 8 分鐘）',
    effect: '配合後谿穴升陽發表、專解「項背強几几（脖子肩膀僵硬如鐵板）」，中醫葛根湯食療版',
    cvsOption: '🏪 超商救急：溫熱黑豆水、無糖溫豆漿、熱關東煮湯（溫通太陽經絡）',
    byPainType: {
      sharp: '⚡【太陽經寒凝氣滯型】後谿穴滾桌緣劇痛、落枕轉不動：宜喝熱「葛根生薑茶」，喝完微汗脖子立刻鬆開。',
      empty: '☁️【氣血不榮筋脈型】長期低頭慢性痠軟無力：宜喝「黃耆當歸紅棗茶」或黑豆排骨湯濡養筋骨。',
      smooth: '😌【日常平養型】溫熱牛蒡茶或黑豆茶，維持脊椎督脈氣血暢通。'
    },
    avoid: '🚫 按後 1 小時忌口：忌冰啤酒、冰手搖飲、筍乾、香蕉（中醫認為筋骨痠痛急性期少吃生冷寒涼水果）。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦肩頸僵硬可飲用溫熱黑豆水或無糖溫豆漿補充鈣質，避免使用活血力強的中藥材。'
  },
  GV20: {
    teaName: '黃耆天麻升陽醒腦茶',
    ingredients: '北黃耆 8g ＋ 天麻 3g ＋ 枸杞 10 粒 ＋ 紅棗 2 顆（熱水燜泡 10 分鐘）',
    effect: '配合頭頂百會穴升提中氣、清利頭目，改善下午腦霧昏沉、低血壓頭暈與記憶力減退',
    cvsOption: '🏪 超商救急：溫熱美式咖啡（少量提神）、無糖溫豆漿配堅果一小包（補腦磷脂）',
    byPainType: {
      sharp: '⚡【肝陽上亢頭脹型】頭頂百會脹痛且臉紅血壓高：忌用黃耆補氣！改喝「決明子＋菊花＋鉤藤茶」引火下行。',
      empty: '☁️【中氣下陷頭暈型】按百會覺得頭頂空空的、蹲下站起眼花：最適合喝「黃耆黨參紅棗茶」升提陽氣。',
      smooth: '😌【日常平養型】核桃枸杞溫飲或溫熱綠茶，保持大腦清明。'
    },
    avoid: '🚫 按後 1 小時忌口：洗頭後務必立刻吹乾頭頂（百會最怕濕寒入侵）；忌高糖精緻麵包導致血糖震盪昏睡。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦頭暈多因氣血供給胎兒所致，宜喝「紅棗枸杞溫水」或牛肉湯補鐵，避免自行服用天麻。'
  },
  'EX-HN3': {
    teaName: '薰衣草玫瑰舒眉茶',
    ingredients: '乾燥玫瑰花 5 朵 ＋ 洋甘菊 3g ＋ 枸杞 8 粒（300cc 熱水沖泡 5 分鐘）',
    effect: '配合印堂穴疏肝解鬱、鎮靜前額神經，化解眉頭深鎖與用腦過度的緊繃感',
    cvsOption: '🏪 超商救急：無咖啡因花草茶、溫熱蜂蜜水、溫牛奶',
    byPainType: {
      sharp: '⚡【眉心緊痛/鼻竇脹型】印堂按之痠痛伴鼻塞：可加「薄荷葉 2 片＋辛夷/白芷」熱氣蒸鼻子後飲用。',
      empty: '☁️【心神疲憊恍惚型】眉心痠軟、精神渙散：宜喝「紅棗桂圓枸杞茶」溫養心神。',
      smooth: '😌【日常平養型】洋甘菊茶或博士茶，放鬆緊繃的皺眉肌。'
    },
    avoid: '🚫 按後 1 小時忌口：忌邊喝濃茶咖啡邊盯手機藍光；忌辛辣刺激食物加重鼻額充血。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦請將「玫瑰花（有活血作用）」替換為「洋甘菊＋蘋果片＋紅棗」溫泡，安全舒緩孕期情緒。'
  },
  'EX-HN5': {
    teaName: '決明子杭菊明目茶',
    ingredients: '炒決明子 6g ＋ 杭白菊 5 朵 ＋ 枸杞 12 粒（350cc 熱水燜泡 6 分鐘）',
    effect: '配合太陽穴清肝瀉火、明目止痛，專治盯螢幕整天的太陽穴抽痛與眼睛紅澀',
    cvsOption: '🏪 超商救急：無糖菊花茶、藍莓優格、番茄汁或富含葉黃素的菠菜/綠花椰沙拉（溫食）',
    byPainType: {
      sharp: '⚡【肝火偏頭痛型】太陽穴血管跳痛、口苦眼紅：宜喝「夏枯草＋菊花＋決明子茶」清瀉少陽膽火。',
      empty: '☁️【肝血不足乾眼型】太陽穴痠軟、眼睛乾澀怕光：少用寒涼菊花，改喝「桑椹＋枸杞＋紅棗茶」滋養肝血。',
      smooth: '😌【日常平養型】經典「枸杞菊花茶（枸杞多、菊花少）」，溫和護眼。'
    },
    avoid: '🚫 按後 1 小時忌口：忌烈酒、紅酒、起司、醃漬加工肉與油炸物（富含酪胺，極易誘發偏頭痛血管痙攣）。',
    pregnancySafeAlt: '🤰 孕期提醒：決明子有滑腸輕瀉作用，孕婦護眼請改喝純「枸杞＋桑椹＋紅棗溫水」，不加決明子。'
  },
  BL2: {
    teaName: '桑椹枸杞滋肝亮眼飲',
    ingredients: '乾燥桑椹 8g ＋ 枸杞 15 粒 ＋ 陳皮 2g（300cc 溫熱水沖泡 6 分鐘，枸杞可嚼食）',
    effect: '配合攢竹穴補益肝腎精血、促進淚液分泌，改善 3C 重度使用者的乾眼症與眼眶脹痛',
    cvsOption: '🏪 超商救急：蒸蛋/茶葉蛋（補充葉黃素）、無糖黑豆水、藍莓果乾配溫水',
    byPainType: {
      sharp: '⚡【眉稜骨痛/眼壓高型】攢竹往上頂劇烈痠脹：宜搭配「杭菊＋薄荷茶」，利用溫熱蒸氣先敷眼 1 分鐘再喝。',
      empty: '☁️【肝腎陰虛乾澀型】眼窩空痠、視物模糊：必喝「桑椹黑枸杞紅棗茶」並把枸杞嚼碎吃下（直接補充玉米黃素）。',
      smooth: '😌【日常平養型】溫熱枸杞水或決明子麥茶，維持眼周微循環。'
    },
    avoid: '🚫 按後 1 小時忌口：忌大蒜、洋蔥、辣椒過量（中醫云「辛走氣，多食損目」）、忌熬夜喝酒。',
    pregnancySafeAlt: '🤰 孕期提醒：桑椹與枸杞富含花青素與鐵質，孕婦飲用非常安全且有助改善孕期眼睛乾澀。'
  },
  LI20: {
    teaName: '辛夷蒼耳通鼻草本茶',
    ingredients: '辛夷花（包煎）3g ＋ 白芷 3g ＋ 薄荷 2 片 ＋ 紅棗 2 顆（熱水沖泡，先聞熱蒸氣再飲）',
    effect: '配合迎香穴宣通肺氣、溫散鼻竅風寒，拯救換季過敏性鼻炎、打噴嚏與鼻塞流清涕',
    cvsOption: '🏪 超商救急：溫熱黑糖薑茶、溫熱無糖豆漿；先用熱飲杯口蒸氣溫敷鼻子 1 分鐘效果立現',
    byPainType: {
      sharp: '⚡【肺胃熱盛/黃稠鼻涕型】迎香按之脹痛且鼻涕偏黃濃：宜喝「魚腥草茶」或「菊花薄荷綠茶」清宣肺熱。',
      empty: '☁️【肺脾氣虛/晨起狂打噴嚏型】一吹冷氣就流清涕：宜喝「黃耆 6g＋防風 3g＋白朮 3g（玉屏風茶）」加上生薑紅棗固表。',
      smooth: '😌【日常平養型】溫熱薑棗茶或桂圓紅棗茶，保持鼻黏膜溫暖濕潤。'
    },
    avoid: '🚫 按後 1 小時忌口：鼻過敏者絕對忌喝冰鮮奶、冰淇淋、冷飲與寒性瓜果（奇異果、西瓜、橘子易加重清涕）。',
    pregnancySafeAlt: '🤰 孕期提醒：孕期鼻炎（妊娠鼻塞）建議單純用「溫熱鹽水蒸氣」燻鼻，並喝「生薑紅棗溫水」最安全。'
  },
  TE17: {
    teaName: '玉米鬚石菖蒲利水聰耳茶',
    ingredients: '玉米鬚 6g ＋ 炒薏仁 10g ＋ 陳皮 3g（350cc 熱水燜泡 8 分鐘）',
    effect: '配合耳後翳風穴疏通三焦水道、消除晨起臉部浮腫與改善耳鳴悶塞感',
    cvsOption: '🏪 超商救急：無糖玉米鬚茶、無糖紅豆水、黑豆水（快速消臉腫與雙下巴水腫）',
    byPainType: {
      sharp: '⚡【少陽火旺/高頻耳鳴牙關緊型】耳後翳風一按劇痛、耳鳴如蟬叫：宜喝「菊花＋夏枯草＋綠茶」清降少陽三焦火。',
      empty: '☁️【腎精不足/低頻耳鳴頭暈型】耳後按之空軟、耳鳴嗡嗡作響：宜喝「黑豆＋黑芝麻＋核桃溫飲」填精補腎。',
      smooth: '😌【日常平養型】玉米鬚茶或無糖黑豆水，暢通頭頸淋巴循環。'
    },
    avoid: '🚫 按後 1 小時忌口：忌高鈉拉麵湯、滷味、醃漬泡菜（防臉部水分滯留浮腫）、忌嚼硬口香糖或檳榔傷咬肌。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦消水腫請用「純紅豆水、黑豆水或玉米鬚茶」，務必濾掉「薏仁」（薏仁滑利易刺激子宮）。'
  },
  GB20: {
    teaName: '天麻川芎杭菊鬆頸茶',
    ingredients: '天麻 3g ＋ 杭菊 5 朵 ＋ 葛根 6g ＋ 生薑 1 片（熱水燜泡 8 分鐘）',
    effect: '配合後腦風池穴祛風散寒、解痙止痛，專治冷氣房後腦勺緊痛、落枕與肩頸僵硬',
    cvsOption: '🏪 超商救急：溫熱黑糖薑茶、溫熱蕎麥茶（含芸香苷軟化血管）、熱蔬菜湯',
    byPainType: {
      sharp: '⚡【風寒外束/膽火上逆型】風池按之劇痠痛傳到眼眶：受寒者喝「熱薑茶」，熬夜口苦者喝「菊花決明子茶」。',
      empty: '☁️【氣血虧虛不榮頭目型】後腦空痛、轉頭頭暈：宜喝「桂圓紅棗枸杞茶」或雞湯補益氣血。',
      smooth: '😌【日常平養型】葛根麥茶或溫熱烏龍茶，維持後頸膽經溫暖。'
    },
    avoid: '🚫 按後 1 小時忌口：忌喝冰水、忌洗完澡濕髮吹冷氣；少吃酸澀食物（如過量酸梅）以免收斂邪氣不利鬆筋。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦後頸緊繃可喝「溫熱生薑紅棗水」搭配熱毛巾敷後頸，避免服用川芎等活血藥材。'
  },
  GB21: {
    teaName: '玫瑰佛手疏肝鬆肩茶',
    ingredients: '玫瑰花 5 朵 ＋ 佛手柑 3g ＋ 陳皮 3g ＋ 紅棗 2 顆（350cc 熱水沖泡 5 分鐘）',
    effect: '配合肩膀肩井穴疏肝理氣、活絡化瘀，把累積在斜方肌上的情緒壓力與氣結徹底化開',
    cvsOption: '🏪 超商救急：溫熱無糖花草茶、溫熱豆漿、黑巧克力一小塊（含鎂助肌肉放鬆）',
    byPainType: {
      sharp: '⚡【氣滯血瘀鐵肩型】肩井一捏像石頭一樣硬痛：宜喝「玫瑰山楂陳皮茶」行氣活血，配合熱敷肩膀。',
      empty: '☁️【氣血兩虛肩膀沉重型】肩膀像扛米袋一樣痠軟無力：宜喝「黃耆當歸枸杞茶」補氣托舉。',
      smooth: '😌【日常平養型】陳皮紅茶或桂花烏龍茶，舒緩辦公壓力。'
    },
    avoid: '🚫 按後 1 小時忌口：忌冰品冷飲（寒主收引，喝冰的會讓剛按鬆的斜方肌瞬間又縮緊！）。',
    pregnancySafeAlt: '🤰 孕期提醒：肩井穴與玫瑰花、山楂皆為孕期禁忌！孕婦肩膀痠痛請改按後谿穴並飲用溫牛奶或紅棗水。'
  },
  SP10: {
    teaName: '玫瑰當歸紅棗養血茶',
    ingredients: '紅棗（去核剪開）4 顆 ＋ 枸杞 10 粒 ＋ 玫瑰花 4 朵 ＋ 黑糖少許（熱水燜泡 8 分鐘）',
    effect: '配合大腿內側血海穴活血化瘀、溫經養血，改善經期悶痛、血塊多、手腳冰冷與皮膚乾癢',
    cvsOption: '🏪 超商救急：溫熱黑糖薑茶、溫熱紅豆湯、桂圓紅棗茶、加溫無糖豆漿',
    byPainType: {
      sharp: '⚡【血瘀經痛/有血塊型】血海一按劇痛難忍：經前一周宜喝「玫瑰山楂黑糖茶」活血化瘀、排淨經血。',
      empty: '☁️【血虛經量少/臉色蒼白型】按之空軟、經後頭暈疲倦：宜喝「桂圓紅棗枸杞茶」或四物雞湯補血養營。',
      smooth: '😌【日常平養型】紅棗枸杞溫水，讓氣色紅潤有光澤。'
    },
    avoid: '🚫 按後 1 小時忌口：絕對忌吃冰品、霜淇淋、西瓜、火龍果、梨子、綠豆與冰鎮飲料（寒凝血瘀會直接加重痛經）。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦不可飲用玫瑰花、益母草、山楂與紅花；補血請改吃「紅棗枸杞湯、菠菜、紅肉牛肉湯」。'
  },
  ST36: {
    teaName: '四神健脾養胃溫飲（山藥茯苓茶）',
    ingredients: '懷山藥片 10g ＋ 茯苓 8g ＋ 炒白扁豆 6g ＋ 紅棗 3 顆（煮水或燜泡 15 分鐘）',
    effect: '配合長壽大穴足三里健脾益胃、扶正補氣，從根本改善胃脹、軟便、疲勞與免疫力低下',
    cvsOption: '🏪 超商救急：溫熱四神湯、烤地瓜＋溫無糖豆漿、溫熱燕麥飲',
    byPainType: {
      sharp: '⚡【胃火/食積脹滿型】按足三里劇烈痠脹且打飽嗝酸水：宜喝「陳皮＋炒麥芽＋山楂茶」消食導滯。',
      empty: '☁️【脾胃氣虛/手腳軟弱型】按之空軟、吃飽就想睡或易拉肚子：最適合喝「四神湯」或「黃耆山藥紅棗茶」大補脾氣。',
      smooth: '😌【日常平養型】溫熱小米粥、山藥排骨湯或紅棗生薑茶，常保胃氣充足。'
    },
    avoid: '🚫 按後 1 小時忌口：忌生冷生魚片、生菜沙拉、冰水、過油肥肉與難消化的麻糬粽子。',
    pregnancySafeAlt: '🤰 孕期提醒：懷山藥、茯苓、蓮子（去薏仁之四神湯）性質極為平和，孕婦脾胃虛弱或腹脹時飲用非常安全。'
  },
  ST40: {
    teaName: '陳皮荷葉茯苓祛濕茶',
    ingredients: '三年陳皮 5g ＋ 茯苓 8g ＋ 乾荷葉 3g ＋ 炒薏仁 10g（400cc 熱水燜泡 10 分鐘）',
    effect: '配合化痰祛濕第一穴豐隆，強效掃除體內痰濕、消除下半身蘿蔔腿水腫與喉嚨卡痰',
    cvsOption: '🏪 超商救急：無糖紅豆水、無糖綠茶、黑烏龍茶（去油解膩化痰濕）',
    byPainType: {
      sharp: '⚡【痰濕壅盛/小腿緊脹型】豐隆穴肌肉硬實按之劇痠痛：宜喝「陳皮荷葉山楂茶」強力刮油化痰祛濕。',
      empty: '☁️【脾虛水腫/肉鬆軟型】小腿按下去凹陷回彈慢、人懶洋洋：宜喝「黃耆茯苓赤小豆茶」先補脾氣再利水。',
      smooth: '😌【日常平養型】陳皮普洱茶或無糖紅豆水，保持身材輕盈不浮腫。'
    },
    avoid: '🚫 按後 1 小時忌口：忌手搖含糖奶茶、奶蓋、冰淇淋、芒果、榴槤與油炸甜食（中醫云「肥甘厚味最生痰濕」）。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦水腫請將「荷葉、薏仁、山楂」改為「陳皮＋茯苓＋赤小豆（紅豆）水」，利水而不傷胎元。'
  },
  SP6: {
    teaName: '紅豆紫米桂圓暖宮飲',
    ingredients: '赤小豆（或紅豆）15g ＋ 茯苓 6g ＋ 桂圓 3 顆 ＋ 紅棗 3 顆（熱水燜煮或沖泡）',
    effect: '配合肝脾腎三經交會的三陰交穴，一舉達到健脾消水腫、調經止痛與滋陰安神三重功效',
    cvsOption: '🏪 超商救急：溫熱紅豆湯、無糖紅豆水、黑糖薑母茶、溫熱黑豆漿',
    byPainType: {
      sharp: '⚡【濕滯血瘀/經前水腫痛經型】骨邊一摳劇痛無比：宜喝「赤小豆＋陳皮＋黑糖薑茶」溫經化瘀排濕。',
      empty: '☁️【肝脾腎三陰虧虛型】按之空軟、月經量少失眠腰痠：宜喝「桑椹＋枸杞＋桂圓紅棗茶」滋陰養血。',
      smooth: '😌【日常平養型】溫熱紅豆水或枸杞紅棗茶，女科日常最佳保養。'
    },
    avoid: '🚫 按後 1 小時忌口：嚴禁吃冰、喝冷飲、吃螃蟹寒涼海鮮、竹筍與生冷瓜果（三陰交受寒會直接影響婦科與睡眠）。',
    pregnancySafeAlt: '🤰 孕期提醒：三陰交為孕婦禁穴！孕期飲食則可安心喝「無糖紅豆水」或「紅棗枸杞溫水」消水腫補氣血。'
  },
  LR3: {
    teaName: '玫瑰菊花陳皮消氣茶（疏肝解鬱方）',
    ingredients: '玫瑰花 5 朵 ＋ 杭菊 4 朵 ＋ 陳皮 3g ＋ 薄荷 2 片（300cc 熱水沖泡 5 分鐘）',
    effect: '配合消氣大穴太衝，疏肝理氣、清瀉肝火，專治生氣悶氣後的胸悶脇痛、偏頭痛與宿醉',
    cvsOption: '🏪 超商救急：無糖綠茶、蜂蜜檸檬溫水（宿醉解酒護肝）、溫熱花草茶',
    byPainType: {
      sharp: '⚡【肝火旺/壓力暴躁型】腳背太衝一推痛到想叫、口苦易怒：宜喝「菊花＋決明子＋薄荷茶」或綠豆湯清瀉肝火。',
      empty: '☁️【肝血虛/鬱悶嘆氣型】按之痠軟、常覺得委屈想哭或眼乾：宜喝「玫瑰＋紅棗＋枸杞＋桂圓茶」柔肝養血。',
      smooth: '😌【日常平養型】茉莉花茶或玫瑰陳皮茶，保持肝氣條達好心情。'
    },
    avoid: '🚫 按後 1 小時忌口：忌飲酒、忌炸物燒烤、忌大辣與過量咖啡（火上加油更傷肝陰）。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦情緒煩悶時，請用「陳皮＋佛手＋紅棗」泡茶疏肝理氣，避免使用玫瑰花活血。'
  },
  KI3: {
    teaName: '黑豆杜仲枸杞補腎茶',
    ingredients: '炒黑豆 12g ＋ 枸杞 12 粒 ＋ 桑椹 6g ＋ 紅棗 2 顆（350cc 熱水燜泡 10 分鐘）',
    effect: '配合腎經原穴太谿滋腎陰、補腎氣，改善久坐腰痠、手腳冰冷、夜尿多與熬夜咽乾',
    cvsOption: '🏪 超商救急：無糖黑豆水、溫熱黑芝麻糊/黑芝麻豆漿、核桃堅果飲',
    byPainType: {
      sharp: '⚡【陰虛火旺/熬夜咽乾腰痛型】太谿按之痠痛且手足心熱：宜喝「桑椹＋黑枸杞＋麥冬茶」滋腎水降虛火。',
      empty: '☁️【腎陽氣虛/凹窩空軟冰冷型】太谿按下去凹陷沒彈性、極度怕冷腰痠：宜喝「黑豆＋桂圓＋核桃＋肉桂少許」溫補腎陽。',
      smooth: '😌【日常平養型】每日一杯溫熱黑豆枸杞水，「黑色入腎」固本培元。'
    },
    avoid: '🚫 按後 1 小時忌口：忌吃過鹹重口味食物（中醫云「鹹走血，多食傷腎」）、忌冰鎮啤酒與生冷寒涼物。',
    pregnancySafeAlt: '🤰 孕期提醒：炒黑豆水與黑芝麻豆漿富含鐵、鈣與葉酸，孕婦腰痠或水腫飲用極為安全有益。'
  },
  BL60: {
    teaName: '杜仲黑豆強腰通絡飲',
    ingredients: '炒杜仲葉 5g ＋ 炒黑豆 10g ＋ 紅棗 3 顆 ＋ 老薑 1 片（熱水燜泡 10 分鐘）',
    effect: '配合崑崙穴溫通足太陽膀胱經，緩解下背痛、坐骨神經緊繃與久站腳踝腫脹',
    cvsOption: '🏪 超商救急：溫熱黑豆水、無糖黑芝麻豆漿、溫熱牛蒡茶',
    byPainType: {
      sharp: '⚡【寒濕瘀阻腰痛型】外踝崑崙穴一捏劇痛、腰背僵硬：宜喝「黑豆老薑黑糖茶」溫經散寒通絡。',
      empty: '☁️【肝腎虧虛腰膝痠軟型】久站就腰痠腿軟無力：宜喝「杜仲枸杞紅棗雞湯」或黑芝麻核桃飲強健筋骨。',
      smooth: '😌【日常平養型】溫熱黑豆茶或牛蒡茶，保持膀胱經暢通。'
    },
    avoid: '🚫 按後 1 小時忌口：忌赤腳踩冰冷地板、忌喝冰水、少吃竹筍與寒性瓜果（防寒濕滯留腰踝）。',
    pregnancySafeAlt: '🤰 孕期提醒：崑崙穴為孕期禁穴！孕婦腰痛可單純飲用「溫熱黑豆紅棗水」或溫牛奶補鈣。'
  },
  BL40: {
    teaName: '牛蒡黑豆排毒通腰茶',
    ingredients: '黃金牛蒡片 8g ＋ 炒黑豆 10g ＋ 枸杞 10 粒（400cc 熱水燜泡 8 分鐘）',
    effect: '配合「腰背委中求」之委中穴，暢通全身最大排毒通道（膀胱經），緩解久坐腰痛與下肢沉重',
    cvsOption: '🏪 超商救急：300cc 溫開水（按完委中必喝溫水助排毒！）、無糖牛蒡茶、黑豆水',
    byPainType: {
      sharp: '⚡【急性閃腰/氣血瘀滯型】膝窩委中按之劇烈痠脹刺痛：按後請立刻喝「300cc 溫熱水」或黑豆薑茶加速代謝乳酸與瘀滯。',
      empty: '☁️【腎虛慢性腰痠型】委中按之空軟、腰部隱隱痠軟喜按：宜喝「黑豆杜仲枸杞茶」溫補腎腰。',
      smooth: '😌【日常平養型】申時（15:00-17:00）拍打委中後配一杯溫牛蒡茶，排毒消水腫最佳。'
    },
    avoid: '🚫 按後 1 小時忌口：忌冰飲、生冷啤酒、忌按完馬上吹冷氣對著膝窩與後腰直吹。',
    pregnancySafeAlt: '🤰 孕期提醒：牛蒡黑豆枸杞茶富含膳食纖維與礦物質，孕婦飲用安全，且能一併改善孕期便秘與水腫。'
  },
  KI1: {
    teaName: '桂圓黑豆暖足引火飲',
    ingredients: '炒黑豆 10g ＋ 桂圓肉 3 顆 ＋ 紅棗 2 顆 ＋ 枸杞 10 粒（300cc 溫熱水沖泡）',
    effect: '配合腳底湧泉穴「引火歸元、溫腎暖足」，徹底解決「上熱下寒（臉長痘嘴破、手腳卻冰冷失眠）」體質',
    cvsOption: '🏪 超商救急：溫熱黑芝麻糊、溫牛奶、無糖黑豆水（睡前泡腳後喝 100cc 最助眠）',
    byPainType: {
      sharp: '⚡【虛火上炎/腳底乾痛失眠型】湧泉按之刺痛、頭頂烘熱難眠：泡腳搓湧泉後，宜喝「百合＋蓮子＋桑椹溫飲」滋陰降火。',
      empty: '☁️【腎陽虛寒/雙腳冰冷如冰塊型】腳底蒼白按之無力：最適合喝「黑豆桂圓生薑紅棗茶」，從丹田暖到腳底板。',
      smooth: '😌【日常平養型】溫熱黑芝麻豆漿或溫牛奶，養腎安眠。'
    },
    avoid: '🚫 按後 1 小時忌口：睡前搓完湧泉穴切忌再喝冰水或吃宵夜，並請立刻穿上保暖襪子防腳底受寒。',
    pregnancySafeAlt: '🤰 孕期提醒：孕婦睡前溫水泡腳後輕揉湧泉、喝半杯溫牛奶或黑芝麻糊，有助改善孕期抽筋與失眠。'
  }
};

