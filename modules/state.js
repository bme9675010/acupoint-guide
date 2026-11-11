// 狀態管理
export const state = {
  currentView: 'front',          // 'front' | 'back' | 'head' | 'hand' | 'foot' | 'sole' | 'ear' | 'child'
  selectedPointId: 'LI4',        // 預設選中合谷穴
  activePresetId: null,          // 當前處方籤 ID
  activeSymptomTag: null,        // 當前單一症狀篩選
  activePosture: null,           // 🪑 姿勢情境過濾：'commute' | 'office' | 'bed' | null
  searchQuery: '',               // 白話症狀與穴位搜尋字串
  pregnancySafeMode: false,      // 🤰 孕期安全鎖（開啟時標示並於連播自動跳過孕婦禁穴）
  favorites: new Set(),          // ⭐ 個人收藏穴位 ID 集合
  painLogs: [],                  // 🩺 按後痛感與體質紀錄陣列
  customPresets: [],             // ✏️ 使用者自訂處方 [{ id, title, icon, items: [{ pointId, seconds }] }]
  settings: {
    theme: 'auto',               // 'auto' | 'light' | 'dark'
    haptics: true,               // 📳 計時器震動提示
    reminderEnabled: false,      // ⏰ 每日提醒
    reminderTime: '21:30'
  },
  highlightedIds: new Set(),     // 高亮穴位集合
  xrayOpacity: 0.55,             // 骨骼透視透明度 (0 ~ 1)
  autoZoomEnabled: true,         // 點擊穴位時是否自動局部放大畫布
  isZoomedIn: false,             // 當前畫布是否處於局部放大狀態
  playlist: {
    isPlaying: false,            // 是否正在跑整套處方連續自動跟練
    queue: [],                   // 處方穴位 ID 陣列
    durations: {},               // 自訂處方的每穴秒數覆寫 { pointId: seconds }
    currentIndex: 0,             // 目前跟練到第幾顆
    completedIds: new Set()      // 已完成跟練的穴位
  },
  timer: {
    running: false,
    phase: 'idle',               // 'idle' | 'press' | 'release'
    phaseTimeLeft: 0,
    totalTimeLeft: 60,
    intervalId: null
  }
};

// 口語化白話症狀同義詞字典（對應穴位 ID 或標準症狀）
export const COLLOQUIAL_SYNONYMS = {
  '宿醉': ['LR3', 'PC6', 'ST36', 'GB20'],
  '酒醉': ['LR3', 'PC6', 'ST36'],
  '想吐': ['PC6', 'ST36', 'CV12'],
  '反胃': ['PC6', 'ST36', 'CV12'],
  '暈車': ['PC6', 'GB20', 'EX-HN5'],
  '暈船': ['PC6', 'GB20'],
  '打嗝': ['PC6', 'CV17', 'CV12', 'ST36'],
  '胃酸': ['PC6', 'CV12', 'ST36'],
  '胃食道逆流': ['PC6', 'CV12', 'CV17', 'ST36'],
  '脹氣': ['CV12', 'ST36', 'PC6', 'SP6'],
  '肚子痛': ['ST36', 'CV12', 'LI4'],
  '拉肚子': ['ST36', 'CV12', 'SP6'],
  '便秘': ['ST36', 'LI4', 'CV6'],
  '落枕': ['SI3', 'GB20', 'GB21', 'LU7'],
  '脖子痛': ['SI3', 'GB20', 'GB21', 'GV14'],
  '肩頸僵硬': ['GB20', 'GB21', 'SI3', 'LI4'],
  '五十肩': ['GB21', 'LI4', 'SI3'],
  '媽媽手': ['LU7', 'LI4', 'PC6'],
  '滑鼠手': ['PC6', 'LU7', 'HT7', 'LI4'],
  '手腕痛': ['PC6', 'HT7', 'LU7'],
  '水腫': ['SP9', 'SP6', 'ST36', 'KI3', 'BL60'],
  '瘦腿': ['SP9', 'ST40', 'SP6', 'BL40'],
  '泡泡眼': ['BL2', 'EX-HN5', 'SP9'],
  '乾眼': ['BL2', 'EX-HN5', 'GB20', 'LI4'],
  '眼睛乾': ['BL2', 'EX-HN5', 'GB20'],
  '黑眼圈': ['BL2', 'EX-HN5', 'SP6', 'KI3'],
  '睡不著': ['HT7', 'EX-HN3', 'PC6', 'KI1', 'SP6'],
  '失眠': ['HT7', 'EX-HN3', 'PC6', 'KI1', 'SP6'],
  '多夢': ['HT7', 'PC8', 'EX-HN3', 'SP6'],
  '淺眠': ['HT7', 'EX-HN3', 'KI1'],
  '心悸': ['PC6', 'HT7', 'CV17'],
  '胸悶': ['CV17', 'PC6', 'LR3'],
  '喘不過氣': ['CV17', 'PC6', 'LU7'],
  '偏頭痛': ['EX-HN5', 'GB20', 'LI4', 'LR3', 'TE17'],
  '頭暈': ['GV20', 'GB20', 'EX-HN5', 'LR3'],
  '腦霧': ['GV20', 'EX-HN3', 'GB20'],
  '提神': ['GV20', 'GB20', 'LI4', 'KI1'],
  '想睡覺': ['GV20', 'GB20', 'LI4'],
  '鼻塞': ['LI20', 'EX-HN3', 'GB20', 'LI4'],
  '過敏': ['LI20', 'LI4', 'GB20', 'ST36'],
  '流鼻水': ['LI20', 'GB20', 'LU7', 'LI4'],
  '感冒': ['GB20', 'GV14', 'LU7', 'LI4'],
  '發燒': ['GV14', 'LI4', 'LU10'],
  '喉嚨痛': ['LU10', 'LU7', 'LI4', 'KI3'],
  '咳嗽': ['LU10', 'LU7', 'CV17', 'ST40'],
  '有痰': ['ST40', 'LU7', 'CV17'],
  '生理痛': ['SP6', 'CV6', 'LR3', 'LI4'],
  '經痛': ['SP6', 'CV6', 'LR3', 'LI4'],
  '月經': ['SP6', 'CV6', 'LR3'],
  '手腳冰冷': ['KI1', 'CV6', 'ST36', 'KI3'],
  '腰痛': ['BL40', 'SI3', 'KI3', 'BL60'],
  '閃到腰': ['BL40', 'SI3', 'BL60'],
  '坐骨神經': ['BL40', 'BL60', 'GB20'],
  '足底筋膜炎': ['KI1', 'KI3', 'BL60'],
  '腳底痛': ['KI1', 'KI3', 'BL60'],
  '耳鳴': ['TE17', 'KI3', 'GB20', 'REFLEX-EYE-TRAP'],
  '火氣大': ['LR3', 'PC8', 'LU10', 'LI4', 'EX-LE-LINEITING'],
  '嘴破': ['PC8', 'LR3', 'LI4', 'EX-LE-LINEITING'],
  '口臭': ['PC8', 'ST36', 'LR3', 'EX-LE-LINEITING'],
  '富貴包': ['GV14', 'GB20', 'GB21', 'SI3'],
  '網球肘': ['LI11', 'LI4', 'LU7'],
  '手肘痛': ['LI11', 'LI4'],
  '皮膚癢': ['LI11', 'SP10', 'SP6'],
  '蕁麻疹': ['LI11', 'SP10', 'SP6'],
  '宿便': ['ST25', 'ST36', 'LI4', 'REFLEX-STOMACH'],
  '頻尿': ['CV6', 'BL23', 'KI3'],
  '夜尿': ['CV6', 'BL23', 'KI3', 'KI1'],
  '腳底按摩': ['REFLEX-KIDNEY', 'KI1', 'REFLEX-STOMACH', 'EX-LE-SHIMIAN', 'REFLEX-BRAIN', 'REFLEX-EYE-TRAP', 'REFLEX-LIVER', 'REFLEX-HEART'],
  '足底反射區': ['REFLEX-KIDNEY', 'REFLEX-STOMACH', 'REFLEX-LIVER', 'REFLEX-HEART', 'REFLEX-BRAIN', 'REFLEX-EYE-TRAP', 'REFLEX-PELVIS'],
  '腳後跟': ['EX-LE-SHIMIAN', 'REFLEX-PELVIS', 'KI3', 'BL60'],
  '氣結': ['REFLEX-STOMACH', 'REFLEX-KIDNEY', 'REFLEX-EYE-TRAP', 'CV17'],
  '排毒': ['REFLEX-KIDNEY', 'BL40', 'SP9', 'LR3'],
  '爆肝': ['REFLEX-LIVER', 'LR3', 'GB20'],
  '右腳': ['REFLEX-LIVER'],
  '左腳': ['REFLEX-HEART']
};
