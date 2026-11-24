// 🆚 易混淆鄰近穴位群組資料表（獨立輕量資料檔，供 inspector.js 偵測而不靜態載入彈窗 UI）

export const CONFUSION_GROUPS = [
  {
    id: 'wrist-trio',
    title: '手腕三要穴：內關 vs 神門 vs 列缺',
    mnemonic: '口訣：「心胃找內關（腕上兩指中央）、安神找神門（小指側腕紋窩）、頭頸肺咳找列缺（拇指側橈骨高突上）」',
    points: ['PC6', 'HT7', 'LU7']
  },
  {
    id: 'hand-palm',
    title: '手掌四穴：合谷 vs 魚際 vs 勞宮 vs 後谿',
    mnemonic: '口訣：「頭面止痛按合谷（虎口骨邊）、清肺利咽按魚際（拇指紅白肉際）、清心解乏按勞宮（握拳中指尖）、落枕腰痛按後谿（小指握拳掌橫紋端）」',
    points: ['LI4', 'LU10', 'PC8', 'SI3']
  },
  {
    id: 'ankle-quad',
    title: '腳踝四穴：太谿 vs 崑崙 vs 三陰交 vs 懸鐘',
    mnemonic: '口訣：「內踝後太谿補腎、外踝後崑崙止腰痛；內踝上四指三陰交調肝脾腎（孕忌）、外踝上四指懸鐘壯骨髓」',
    points: ['KI3', 'BL60', 'SP6', 'GB39']
  },
  {
    id: 'leg-quad',
    title: '膝腿四穴：足三里 vs 豐隆 vs 陰陵泉 vs 血海',
    mnemonic: '口訣：「膝外側補脾胃找足三里、小腿外側正中化痰找豐隆；膝內下方祛濕找陰陵泉、膝內上方調血止癢找血海」',
    points: ['ST36', 'ST40', 'SP9', 'SP10']
  },
  {
    id: 'abdomen-trio',
    title: '胸腹四穴：膻中 vs 中脘 vs 天樞 vs 氣海關元',
    mnemonic: '口訣：「兩乳間膻中寬胸鬱、肚臍上四指中脘治胃、肚臍旁三指天樞調腸道（雙向止瀉通便）、肚臍下氣海關元補元氣」',
    points: ['CV17', 'CV12', 'ST25', 'CV6']
  },
  {
    id: 'head-eye',
    title: '眼周頭面四穴：攢竹 vs 太陽 vs 四白 vs 印堂',
    mnemonic: '口訣：「眉頭攢竹消眼脹、眉尾太陽解偏頭痛、瞳孔正下四白護眼防近視、兩眉正中印堂通鼻安神」',
    points: ['BL2', 'EX-HN5', 'ST2', 'EX-HN3']
  },
  {
    id: 'neck-back',
    title: '肩頸腰背四穴：風池 vs 肩井 vs 大椎 vs 腎俞',
    mnemonic: '口訣：「後腦凹窩風池解風寒頭痛、肩峰中點肩井鬆斜方肌（孕忌）、低頭最高骨下大椎退熱、腰窩脊柱旁腎俞補腎」',
    points: ['GB20', 'GB21', 'GV14', 'BL23']
  },
  {
    id: 'sole-trio',
    title: '足底三穴：湧泉 vs 失眠穴 vs 裡內庭',
    mnemonic: '口訣：「前掌人字窩湧泉引火歸元、腳跟正中央失眠穴敲擊助眠、二三趾縫下裡內庭專瀉胃火消食積」',
    points: ['KI1', 'EX-LE-SHIMIAN', 'EX-LE-LINEITING']
  },
  {
    id: 'ear-trio',
    title: '耳穴三要點：耳神門 vs 耳中(零點) vs 耳尖',
    mnemonic: '口訣：「三角窩上耳神門專主鎮靜助眠、耳輪腳正中零點平衡自律神經、折耳最頂端耳尖專退熱清肝火」',
    points: ['EAR-SHENMEN', 'EAR-ZERO', 'EAR-APEX']
  },
  {
    id: 'child-hand',
    title: '小兒手部推拿：脾經 vs 板門 vs 四橫紋 vs 小天心',
    mnemonic: '口訣：「大拇指旋推補脾經、大魚際揉板門消食止吐、四指關節掐四橫紋消疳積、掌根凹窩揉小天心安神鎮驚」',
    points: ['PED-PI', 'PED-BANMEN', 'PED-SIHENGWEN', 'PED-XIAOTIANXIN']
  }
];

export function getConfusionGroupForPoint(pointId) {
  return CONFUSION_GROUPS.find((g) => g.points.includes(pointId)) || null;
}
