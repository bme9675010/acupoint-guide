// 🪑 姿勢情境快篩入口（「站捷運/通勤免脫鞋」、「辦公桌坐姿」、「睡前躺床」）
export const POSTURE_SCENARIOS = [
  {
    id: 'parenting',
    label: '👶 親子/小兒推拿',
    desc: '幼童開脾消積食、安神止夜啼、小兒發燒、青少年轉骨長高',
    preferredView: 'child',
    filter: (pt) => 'child' in pt.views || pt.id.startsWith('PED-') || pt.id === 'GB39' || pt.id === 'ST2'
  },
  {
    id: 'commute',
    label: '🚇 通勤/站立免脫鞋',
    desc: '單手可按、不必脫鞋捲褲管（手部＋耳穴＋臉部）',
    preferredView: 'hand',
    filter: (pt) => 'hand' in pt.views || 'ear' in pt.views || ['LI4', 'PC6', 'HT7', 'LU7', 'SI3', 'LI20', 'EX-HN5'].includes(pt.id)
  },
  {
    id: 'office',
    label: '🪑 辦公桌久坐救急',
    desc: '免脫鞋、坐在椅上即可按（肩頸頭面＋手肘手腕＋小腿）',
    preferredView: 'head',
    filter: (pt) => !('sole' in pt.views) && pt.id !== 'KI1' && pt.id !== 'BL23'
  },
  {
    id: 'bed',
    label: '🛏️ 睡前躺床/泡腳',
    desc: '泡腳刮足底反射區、躺床揉腹與安神助眠穴',
    preferredView: 'sole',
    filter: (pt) =>
      'sole' in pt.views ||
      ['EX-HN3', 'HT7', 'PC6', 'CV17', 'CV12', 'CV6', 'ST25', 'SP6', 'KI3', 'EAR-SHENMEN'].includes(pt.id)
  }
];
