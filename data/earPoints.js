// 👂 耳穴全息圖鑑（7 大黃金耳穴 + 本草食療 + 耳廓全息 SVG 底圖）
// 註：耳廓全息反射定位屬中醫傳統保健與日常舒壓參考，非醫療診斷依據。

export const EAR_PRESET = {
  id: 'ear-calm',
  title: '耳穴舒壓・神門助眠方',
  subtitle: '免脫鞋、通勤開會皆可捏耳安神、降火消水腫',
  icon: '👂',
  points: ['EAR-SHENMEN', 'EAR-ZERO', 'EAR-STOMACH', 'EAR-KIDNEY', 'EAR-APEX']
};

export const EAR_SYNONYMS = {
  '耳穴': ['EAR-SHENMEN', 'EAR-APEX', 'EAR-ZERO', 'EAR-STOMACH', 'EAR-LIVER', 'EAR-KIDNEY', 'EAR-ADRENAL'],
  '耳朵按摩': ['EAR-SHENMEN', 'EAR-APEX', 'EAR-ZERO', 'EAR-KIDNEY'],
  '王不留行': ['EAR-SHENMEN', 'EAR-STOMACH', 'EAR-ZERO', 'EAR-KIDNEY'],
  '耳貼': ['EAR-SHENMEN', 'EAR-STOMACH', 'EAR-LIVER', 'EAR-KIDNEY'],
  '戒菸': ['EAR-SHENMEN', 'EAR-ZERO', 'EAR-STOMACH'],
  '減肥': ['EAR-STOMACH', 'EAR-ZERO', 'EAR-SHENMEN', 'ST40', 'SP9'],
  '嘴饞': ['EAR-STOMACH', 'EAR-SHENMEN', 'EAR-ZERO'],
  '爆食': ['EAR-STOMACH', 'EAR-SHENMEN'],
  '壓力大': ['EAR-SHENMEN', 'EAR-LIVER', 'EAR-ZERO', 'LR3', 'CV17'],
  '自律神經': ['EAR-SHENMEN', 'EAR-ZERO', 'PC6', 'HT7']
};

export const EAR_POINTS = [
  {
    id: 'EAR-SHENMEN',
    name: '耳神門',
    pinyin: 'Ěr Shén Mén (Auricular Shenmen)',
    meridian: '耳穴全息區（三角窩外上角）',
    attribute: '【耳穴安神第 1 穴】失眠焦慮、戒斷嘴饞、止痛鎮靜必貼王牌穴（保健參考）',
    asymmetric: true,
    views: {
      ear: { x: 196, y: 198 }
    },
    location: {
      anatomical: '耳廓上方「三角窩」後三分之一的上部，即對耳輪上、下腳分叉處稍上方凹陷處。',
      quickFind: '摸到耳朵上半部那個像三角形的小凹窩（三角窩），用食指尖往凹窩裡面的偏上方頂角一壓，最痠軟的那個小窩就是【耳神門】！',
      cunReference: '對耳輪上、下腳分叉處（三角窩後 1/3 上部）。',
      boneTip: '耳廓軟骨三角窩上緣凹陷',
      steps: [
        '①【摸耳上三角窩】食指伸進耳朵上半部內側的「三角形凹槽（三角窩）」。',
        '②【鎖定分叉上角】往凹槽深處偏上方（對耳輪上下腳分叉點略上方）探查。',
        '③【拇食指對捏或貼耳籽】用拇指在耳背、食指在三角窩對捏揉按，或貼上王不留行籽耳貼定點按壓。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：失眠、壓力大或焦慮的人，用指甲背或棉棒輕頂此處會有強烈痠麻脹感，捏揉 1 分鐘後全耳發熱、眼皮變沉好入睡！',
        wrong: '❌ 常見按偏：不要只拉外圈耳輪軟骨，要伸進上半部內側的「三角窩凹陷」裡才對。'
      }
    },
    benefits: {
      tcmFunctions: ['鎮靜安神助眠', '疏肝解鬱緩焦慮', '抑制嘴饞與壓力性暴食'],
      symptoms: ['失眠焦慮', '頭痛', '肩頸痠痛', '耳鳴重聽']
    },
    massageGuide: {
      technique: '拇食指對捏揉按 或 王不留行籽耳貼定點壓',
      fingerToUse: '雙手食指伸入左右耳三角窩、大拇指襯在耳背對捏；若貼耳豆（王不留行籽），每次按壓 1 分鐘、每日 3～5 次，2～3 天撕除換貼（耳部皮膚破損或凍瘡勿貼）。',
      sensation: '耳廓上端微酸發熱，腦門緊繃感迅速鬆開。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'HT7', comboName: '雙神門極致安眠方', purpose: '耳神門配手腕神門穴，上下共振安定自律神經，秒睡首選。' },
      { partnerId: 'EAR-ZERO', comboName: '耳穴平衡自律神經方', purpose: '耳神門配耳中零點，快速撫平心悸與交感神經亢奮。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '💡 雙耳對稱皆可按揉。耳穴全息反射屬日常保健參考，非醫療診斷；耳廓若有外傷發炎請暫停按壓。'
    }
  },
  {
    id: 'EAR-APEX',
    name: '耳尖',
    pinyin: 'Ěr Jiān (Ear Apex)',
    meridian: '耳穴全息區（耳廓最高點）',
    attribute: '【清熱降火・明目退紅】熬夜火氣大、眼睛乾紅充血、偏頭痛必捏頂端穴',
    asymmetric: true,
    views: {
      ear: { x: 204, y: 112 }
    },
    location: {
      anatomical: '將耳廓向前對折時，耳輪上緣的最高尖端處。',
      quickFind: '把耳朵像折水餃一樣「由後往前對折」，耳朵最頂端折出來的那個尖角就是【耳尖穴】！',
      cunReference: '耳廓向前折疊時，耳輪頂端最高點。',
      boneTip: '耳輪頂端軟骨最高轉折點',
      steps: [
        '①【折耳找尖端】把耳朵往前輕折，找到最上面凸出的頂點。',
        '②【雙指捏提向上】用大拇指與食指捏住耳尖，往上輕提並揉捏 30 下。',
        '③【搓熱消火氣】捏到耳朵頂端溫熱微紅即可，居家保健以指腹揉捏提拉為主，安全退火明目。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：熬夜用眼過度或頭脹的人，向上提捏耳尖 30 下後，眼睛乾澀與太陽穴脹痛感會立刻清爽許多！',
        wrong: '❌ 常見按偏：居家保健請用「指腹捏提揉熱」，切勿自行拿針具刺破皮膚，以免感染！'
      }
    },
    benefits: {
      tcmFunctions: ['清熱瀉火明目', '平肝潛陽止頭痛', '舒緩眼紅乾癢與熬夜上火'],
      symptoms: ['用眼過度', '頭痛', '咽喉乾痛', '失眠焦慮']
    },
    massageGuide: {
      technique: '拇食指捏住耳尖「向上提拉＋揉搓至發熱」',
      fingerToUse: '雙手拇指與食指同時捏住左右耳最高點，一緊一鬆向上提拉 36 下，直到耳尖發熱微紅。',
      sensation: '耳尖溫熱微脹，眼眶與頭頂頓時清涼舒爽。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'EX-HN5', comboName: '退紅護眼清腦方', purpose: '捏提耳尖配合按揉太陽穴，3C 族乾眼脹痛立解。' },
      { partnerId: 'LR3', comboName: '上下清肝退火方', purpose: '耳尖配太衝穴，快速撲滅熬夜肝火與嘴破煩躁。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '居家按導僅限指腹提捏揉熱，嚴禁自行針刺放血。'
    }
  },
  {
    id: 'EAR-ZERO',
    name: '耳中（零點）',
    pinyin: 'Ěr Zhōng / Point Zero',
    meridian: '耳穴全息區（耳輪腳中央）',
    attribute: '【全耳總樞紐・橫膈膜區】打嗝不止、胸悶嘆氣、自律神經失調必按平衡點',
    asymmetric: true,
    views: {
      ear: { x: 162, y: 312 }
    },
    location: {
      anatomical: '耳廓正中央橫向突起之軟骨嵴「耳輪腳」中點處（法式耳醫學稱 Point Zero 零點）。',
      quickFind: '用食指摸進耳朵正中央，會摸到一條橫著長進耳洞上方的「軟骨橫樑（耳輪腳）」，這條軟骨橫樑的正中間凹窩就是【耳中（零點）】！',
      cunReference: '耳輪腳（Helix Crus）中點軟骨小凹處。',
      boneTip: '耳廓中央耳輪腳橫嵴軟骨中點',
      steps: [
        '①【摸中央橫軟骨】食指伸入耳朵正中央，摸到橫向突起的「耳輪腳」軟骨嵴。',
        '②【定點壓軟骨中點】在耳輪腳正中央找到一個微小的軟骨切迹凹窩。',
        '③【深呼吸點揉】配合慢吸慢吐，用食指尖或棉棒圓頭定點按揉 1 分鐘。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：容易緊張胸悶、常嘆氣或一直打嗝的人，按壓此處能放鬆橫膈膜，呼吸立刻變深長順暢！',
        wrong: '❌ 常見按偏：不要直接往耳道孔洞裡捅！是在耳洞上方那條「橫向軟骨樑」的正中間。'
      }
    },
    benefits: {
      tcmFunctions: ['寬胸理氣止打嗝', '平衡交感與副交感神經', '調和內臟氣機'],
      symptoms: ['胃脹噁心', '失眠焦慮', '頭痛', '肩頸痠痛']
    },
    massageGuide: {
      technique: '食指尖或棉棒圓頭定點輕壓＋深長腹式呼吸',
      fingerToUse: '將食指尖輕扣在耳輪腳中央，吸氣 4 秒、吐氣 6 秒並往下微壓，幫助橫膈膜放鬆、止住打嗝與胸悶。',
      sensation: '耳心微痠，胸口橫膈膜隨之鬆開。',
      rhythm: { pressSeconds: 5, releaseSeconds: 3, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'PC6', comboName: '止嗝寬胸雙絕方', purpose: '耳中（橫膈膜區）配內關穴，打嗝反胃與暈車胸悶最快緩解。' },
      { partnerId: 'CV17', comboName: '開胸順氣解鬱方', purpose: '耳中配胸口膻中穴，一掃壓力造成的窒息悶痛感。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '使用棉花棒點壓時請握住棉棒前端，避免手滑伸入外耳道。'
    }
  },
  {
    id: 'EAR-STOMACH',
    name: '耳胃區',
    pinyin: 'Auricular Stomach Zone',
    meridian: '耳穴全息區（耳輪腳消失處）',
    attribute: '【餐前控食慾・餐後消胃脹】胃酸逆流、胃脹氣、戒宵夜嘴饞必貼反射區',
    asymmetric: true,
    views: {
      ear: { x: 232, y: 304 }
    },
    location: {
      anatomical: '耳廓中央「耳輪腳」向內延伸並逐漸消失於耳甲處之周圍區域。',
      quickFind: '順著耳朵正中央那條橫向軟骨樑（耳輪腳）往耳朵內側深處滑，滑到軟骨樑「剛好消失、變成平坦耳窩」的交界處，就是【耳胃區】！',
      cunReference: '耳輪腳消失處（耳甲艇與耳甲腔交界內側端）。',
      boneTip: '耳輪腳軟骨尾端消失處周圍',
      steps: [
        '①【順耳輪腳往內滑】食指沿著耳朵中央橫軟骨（耳輪腳）往耳朵內側滑到底。',
        '②【找軟骨消失端】摸到橫軟骨剛好沒入耳窩平坦處的端點。',
        '③【飯前按壓控食慾、飯後緩揉消脹】想少吃宵夜可在餐前 15 分鐘按揉 60 秒；吃太飽胃脹則於飯後 30 分鐘輕揉。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：慢性胃脹、胃食道逆流或剛吃飽的人，用棉棒探壓此處會比周圍特別痠痛，揉開後很快會打嗝排氣！',
        wrong: '❌ 常見按偏：要滑到橫軟骨「最內側消失的盡頭」，偏外則是耳中（橫膈膜區）。'
      }
    },
    benefits: {
      tcmFunctions: ['和胃降逆消脹氣', '舒緩胃酸逆流與打嗝', '餐前按壓輔助控制嘴饞食慾'],
      symptoms: ['胃脹噁心', '頭痛', '失眠焦慮']
    },
    massageGuide: {
      technique: '圓頭棉棒或食指腹順時針小圈輕揉',
      fingerToUse: '用圓頭棉花棒或小指指腹伸入耳輪腳消失處，輕柔畫小圓按壓 1 分鐘；亦為耳豆（王不留行籽）控食慾最常貼壓點。',
      sensation: '耳窩深處微酸溫熱，胃部緊繃脹悶感逐漸消散。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'CV12', comboName: '耳腹雙效消脹方', purpose: '耳胃區配腹部中脘穴，外貼內揉快速化解餐後脹氣。' },
      { partnerId: 'ST36', comboName: '健脾養胃黃金方', purpose: '耳胃區配小腿足三里，改善慢性消化不良。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '耳窩內皮膚較薄，請用指腹或圓頭棉棒溫和按壓，勿用尖銳指甲刮破耳膚。'
    }
  },
  {
    id: 'EAR-LIVER',
    name: '耳肝區',
    pinyin: 'Auricular Liver Zone',
    meridian: '耳穴全息區（耳甲艇後下部）',
    attribute: '【熬夜爆肝・乾眼肩緊】盯螢幕眼睛乾澀、易怒胸悶、經前煩躁必揉區',
    asymmetric: true,
    views: {
      ear: { x: 248, y: 268 }
    },
    location: {
      anatomical: '位於耳甲艇後下部（即耳胃區後上方、緊鄰對耳輪體部內側緣之凹陷處）。',
      quickFind: '先找到剛才的【耳胃區】，再把手指稍微「往後、往上」移一點點，頂到耳朵內圈軟骨牆壁（對耳輪）內側的凹槽，就是【耳肝區】！',
      cunReference: '耳甲艇後下部（耳輪腳消失處之後上方凹槽）。',
      boneTip: '耳甲艇後下壁與對耳輪軟骨交界凹槽',
      steps: [
        '①【由耳胃往後上移】從耳輪腳消失處（耳胃區）往耳廓內側後上方移動約半指寬。',
        '②【貼住內圈軟骨壁】指尖貼住對耳輪內側壁的凹槽。',
        '③【點壓推揉】用食指尖或棉棒圓頭貼著軟骨壁上下輕推 1 分鐘。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：常熬夜、盯電腦眼睛酸澀或壓力大易怒的人，這裡往往摸得到明顯壓痛點甚至小結節，揉開後眼睛立刻變亮！',
        wrong: '❌ 常見按偏：耳肝區在「上半部耳窩（耳甲艇）後下角」，不要滑到下半部耳洞旁。'
      }
    },
    benefits: {
      tcmFunctions: ['疏肝理氣解鬱', '養肝血明目退乾澀', '柔和筋脈鬆肩頸'],
      symptoms: ['用眼過度', '肩頸痠痛', '頭痛', '經痛', '失眠焦慮']
    },
    massageGuide: {
      technique: '食指尖或棉棒貼耳甲艇後壁輕推揉按',
      fingerToUse: '盯螢幕每滿 1 小時，閉眼用雙手食指尖伸入耳甲艇後下部揉按耳肝區 60 秒，「肝開竅於目」，護眼效果極佳。',
      sensation: '耳甲艇後壁明顯酸脹，揉後眼眶濕潤放鬆。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'LR3', comboName: '全息疏肝解鬱方', purpose: '耳肝區配腳背太衝穴，上下疏通肝氣、掃除悶氣與偏頭痛。' },
      { partnerId: 'BL2', comboName: '養肝明目護眼方', purpose: '耳肝區配眉頭攢竹穴，改善乾眼症與視力疲勞。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '若有配戴耳骨環或耳內式耳機，按壓前請先取下以免摩擦破皮。'
    }
  },
  {
    id: 'EAR-KIDNEY',
    name: '耳腎區',
    pinyin: 'Auricular Kidney Zone',
    meridian: '耳穴全息區（對耳輪下腳下方）',
    attribute: '【開竅於耳・固腎消腫】耳鳴重聽、腰痠背痛、水腫掉髮、精神不濟必溫區',
    asymmetric: true,
    views: {
      ear: { x: 222, y: 236 }
    },
    location: {
      anatomical: '位於耳甲艇上緣、對耳輪下腳正下方之凹溝處。',
      quickFind: '中醫說「腎開竅於耳」！把食指放進上半部耳窩（耳甲艇），往上頂住「三角窩下方的軟骨屋簷（對耳輪下腳下緣）」，這個屋簷底下的凹槽就是【耳腎區】！',
      cunReference: '對耳輪下腳下方（耳甲艇上部凹溝）。',
      boneTip: '對耳輪下腳下緣軟骨溝',
      steps: [
        '①【伸入上半耳窩】食指伸進耳輪腳上方的耳窩（耳甲艇）。',
        '②【往上頂住軟骨屋簷】指腹朝上，頂住上方橫向軟骨（對耳輪下腳）的下緣凹溝。',
        '③【橫向來回撫揉】沿著軟骨屋簷下緣左右輕推揉按，最後再把全耳搓熱。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：久坐腰痠、容易耳鳴或下午腦霧疲倦的人，往上頂壓這條軟骨屋簷下緣會非常痠脹，揉熱後精神與後腰頓時有力！',
        wrong: '❌ 常見按偏：手指要「由下往上頂住軟骨下緣凹溝」，才會精準按到耳腎區。'
      }
    },
    benefits: {
      tcmFunctions: ['補腎益精聰耳', '緩解耳鳴與聽力疲勞', '強健腰膝消水腫'],
      symptoms: ['耳鳴重聽', '腰痠背痛', '下肢水腫', '手腳冰冷']
    },
    massageGuide: {
      technique: '食指腹「由下往上」頂揉對耳輪下腳下緣 ＋ 雙手搓熱全耳',
      fingerToUse: '先用食指尖頂揉耳腎區 40 秒，接著雙手掌心蓋住雙耳上下搓摩 20 下（「鳴天鼓」暖耳法），溫補腎氣。',
      sensation: '耳窩上緣酸脹溫熱，耳內嗡鳴感減輕、全身暖和。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'KI3', comboName: '固腎聰耳抗老方', purpose: '耳腎區配腳踝太谿穴，改善耳鳴、夜尿與腰膝痠軟。' },
      { partnerId: 'TE17', comboName: '內外通耳聰明方', purpose: '耳腎區配耳垂後翳風穴，暢通耳部氣血循環。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '冬天手冰冷時，請先將雙手搓熱再按揉耳廓，避免凍傷耳膚。'
    }
  },
  {
    id: 'EAR-ADRENAL',
    name: '耳腎上腺（下屏尖）',
    pinyin: 'Auricular Adrenal / Tragus Apex',
    meridian: '耳穴全息區（耳屏下部尖端）',
    attribute: '【換季過敏・提神抗疲勞】鼻塞打噴嚏、氣喘咳嗽、下午昏沉必捏小珠尖',
    asymmetric: true,
    views: {
      ear: { x: 138, y: 368 }
    },
    location: {
      anatomical: '耳洞前方小軟骨瓣「耳屏（Tragus）」游離緣下部突起之尖端（下屏尖）。',
      quickFind: '摸到耳洞正前方那塊會蓋住耳洞的「小肉片軟骨（耳屏）」，在它的下半部邊緣有一顆小小的突起尖端，用拇指跟食指一捏就捏到的那個小珠尖就是【耳腎上腺】！',
      cunReference: '耳屏游離緣下部突起尖端（雙屏尖之下尖；單屏尖則取正中尖端）。',
      boneTip: '耳洞前耳屏軟骨下部游離尖端',
      steps: [
        '①【摸耳洞前小肉瓣】找到耳道口正前方突起的軟骨小瓣（耳屏）。',
        '②【捏住下緣小突起】大拇指在耳屏外、食指在耳屏內側，夾住耳屏下半部的突起尖端。',
        '③【一緊一鬆點捏】有節奏地對捏 30 下，換季過敏鼻塞或昏沉時特別有效。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：過敏性鼻炎打噴嚏或下午昏昏欲睡時，點捏耳屏下尖端會有清脆酸刺感，捏完鼻子立刻通氣、頭腦清醒！',
        wrong: '❌ 常見按偏：是捏「耳洞前方的小軟骨片下尖」，不是往下拉耳垂喔！'
      }
    },
    benefits: {
      tcmFunctions: ['宣肺通鼻抗過敏', '平喘止咳清咽喉', '振奮精神抗疲勞'],
      symptoms: ['鼻塞流涕', '咽喉乾痛', '頭痛', '皮膚癢']
    },
    massageGuide: {
      technique: '拇食指夾住耳屏下尖「一緊一鬆點捏」',
      fingerToUse: '食指微探入耳屏內壁、大拇指扣住耳屏外下尖，雙指對捏 30～50 下。',
      sensation: '耳屏尖端微酸帶刺，鼻腔隨之通暢。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'LI20', comboName: '換季鼻過敏救急方', purpose: '捏耳腎上腺配鼻翼旁迎香穴，過敏鼻塞流涕 1 分鐘通氣。' },
      { partnerId: 'LI11', comboName: '止癢抗敏雙效方', purpose: '耳腎上腺配手肘曲池穴，舒緩換季皮膚乾癢與蕁麻疹。' }
    ],
    contraindications: {
      pregnancyForbidden: true,
      notes: '⚠️ 孕期安全提醒：耳腎上腺與內分泌區刺激較強，孕婦請避免重捏或貼壓此點（開啟孕期安全鎖將自動略過）。'
    }
  }
];

export const EAR_DIETARY_THERAPY = {
  'EAR-SHENMEN': {
    teaName: '酸棗仁百合茯神安神飲',
    ingredients: '炒酸棗仁 6g（搗碎）＋ 百合 6g ＋ 茯神 5g ＋ 紅棗 2 顆（300cc 熱水燜泡 8 分鐘）',
    effect: '配合【耳神門】鎮靜副交感神經，改善壓力型失眠、多夢易醒與夜間嘴饞',
    cvsOption: '🏪 超商救急：溫熱無糖豆漿、溫牛奶、洋甘菊花草茶（避開咖啡因）',
    byPainType: {
      sharp: '⚡【耳三角窩刺痛/交感亢奮焦慮型】一捏耳神門就劇痛心煩：宜喝「百合蓮子淡竹葉茶」清心降火。',
      empty: '☁️【耳廓偏涼鬆軟/心脾兩虛淺眠型】易驚醒、白天沒精神：宜喝「桂圓紅棗酸棗仁茶」養血安神。',
      smooth: '😌【日常平養型】睡前 1 小時捏熱耳神門，配半杯溫熱牛奶或溫豆漿助眠。'
    },
    avoid: '🚫 按後 1 小時忌口：下午 3 點後忌濃咖啡、能量飲、手搖濃茶與睡前重口味宵夜。',
    pregnancySafeAlt: '🤰 孕期安心替代：孕婦失眠可輕柔撫捏耳神門，茶飲改喝「溫牛奶＋紅棗 2 顆」最溫和安全。'
  },
  'EAR-APEX': {
    teaName: '杭菊桑葉決明清耳尖飲',
    ingredients: '杭白菊 5 朵 ＋ 霜桑葉 4g ＋ 炒決明子 6g ＋ 枸杞 8 粒（熱水沖泡 5 分鐘）',
    effect: '配合提捏【耳尖穴】清瀉頭面虛火，退眼紅乾澀、舒緩熬夜偏頭痛',
    cvsOption: '🏪 超商救急：無糖菊花茶、無糖綠茶、溫開水配藍莓或奇異果',
    byPainType: {
      sharp: '⚡【耳尖燙紅脹痛/肝火上炎眼充血型】熬夜頭脹眼紅：宜喝「菊花桑葉薄荷茶」快速清利頭目。',
      empty: '☁️【耳尖蒼白/肝血不足乾眼型】眼睛乾澀畏光但不紅腫：宜喝「枸杞紅棗熟地溫飲」滋補肝血。',
      smooth: '😌【日常平養型】枸杞菊花茶日常飲用，每用眼 50 分鐘提捏耳尖 20 下。'
    },
    avoid: '🚫 按後 1 小時忌口：忌炸物、麻辣鍋、烈酒、烤物與熬夜追劇。',
    pregnancySafeAlt: '🤰 孕期安心替代：請去掉寒滑的決明子，改泡「枸杞杭菊溫開水（菊花 3 朵即可）」。'
  },
  'EAR-ZERO': {
    teaName: '佛手陳皮玫瑰順膈飲',
    ingredients: '佛手柑片 4g ＋ 陳皮 4g ＋ 粉紅玫瑰 4 朵 ＋ 炙甘草 2 片（熱水沖泡 5 分鐘）',
    effect: '配合按壓【耳中（零點）】放鬆橫膈膜痙攣，止住打嗝、化解胸悶嘆氣與自律神經緊繃',
    cvsOption: '🏪 超商救急：溫熱陳皮梅子飲、溫開水小口慢吞（止嗝最有效）、無糖花草茶',
    byPainType: {
      sharp: '⚡【耳輪腳壓痛/氣逆打嗝胸悶型】壓力大常嘆氣或打嗝不止：宜喝「陳皮佛手生薑溫飲」理氣降逆。',
      empty: '☁️【呼吸短促無力/中氣不足型】說話沒力、動則氣短：宜喝「黃耆紅棗麥冬茶」補益中氣。',
      smooth: '😌【日常平養型】茉莉花或玫瑰陳皮茶，保持橫膈膜與呼吸深長柔和。'
    },
    avoid: '🚫 按後 1 小時忌口：忌碳酸氣泡飲、啤酒、邊吃飯邊說話吞入冷空氣。',
    pregnancySafeAlt: '🤰 孕期安心替代：請拿掉玫瑰花，改用「陳皮 3g ＋ 生薑 1 片」泡溫水舒緩孕期打嗝反胃。'
  },
  'EAR-STOMACH': {
    teaName: '焦山楂陳皮炒麥芽消食飲',
    ingredients: '焦山楂 5g ＋ 陳皮 5g ＋ 炒麥芽 6g ＋ 茯苓 5g（餐後 30 分鐘溫飲；控食慾則餐前喝 200cc 溫水）',
    effect: '配合【耳胃區】促進胃排空、消除胃脹酸水；餐前按耳胃配溫水可自然降低暴食衝動',
    cvsOption: '🏪 超商救急：無糖高纖燕麥飲、溫熱無糖豆漿（餐前墊胃）、無糖大麥茶（餐後解膩）',
    byPainType: {
      sharp: '⚡【耳胃區明顯壓痛/暴飲暴食胃酸型】吃太撐胃酸逆流：宜喝「陳皮炒麥芽烏梅茶」消積導滯（胃酸多者山楂減量）。',
      empty: '☁️【耳胃區凹陷/脾胃虛寒脹氣型】吃一點冷食就胃堵：宜喝「生薑紅棗紅茶或溫熱四神湯」溫胃散寒。',
      smooth: '😌【日常平養型】溫熱大麥茶或蕎麥茶，溫和護胃無咖啡因。'
    },
    avoid: '🚫 按後 1 小時忌口：忌空腹喝黑咖啡、忌糯米甜食、冰手搖飲與睡前宵夜。',
    pregnancySafeAlt: '🤰 孕期安心替代：孕婦嚴禁大量山楂與炒麥芽（麥芽退乳），請改喝「陳皮生薑溫開水」或溫牛奶。'
  },
  'EAR-LIVER': {
    teaName: '玫瑰枸杞決明疏肝護眼茶',
    ingredients: '粉紅玫瑰 5 朵 ＋ 寧夏枸杞 12 粒 ＋ 菊花 4 朵 ＋ 陳皮 3g（熱水燜泡 5 分鐘）',
    effect: '配合揉按【耳肝區】疏解工作鬱悶、滋養肝血，改善盯螢幕乾眼酸澀與經前煩躁',
    cvsOption: '🏪 超商救急：無糖綠茶、枸杞菊花飲、溫熱豆漿配少許堅果',
    byPainType: {
      sharp: '⚡【耳甲艇後下壓痛結節/熬夜爆肝易怒型】肩頸硬、眼紅易怒：宜喝「菊花薄荷金銀花茶」清肝瀉火。',
      empty: '☁️【眼睛乾澀模糊/肝血虧虛型】指甲易斷、眼乾視茫：宜喝「桑椹枸杞紅棗桂圓茶」滋養肝血。',
      smooth: '😌【日常平養型】枸杞菊花溫飲，搭配閉目揉耳肝區 1 分鐘。'
    },
    avoid: '🚫 按後 1 小時忌口：忌飲酒、油炸重鹹宵夜與辛辣刺激物。',
    pregnancySafeAlt: '🤰 孕期安心替代：孕婦請去掉玫瑰花，改泡「枸杞 10 粒 ＋ 紅棗 3 顆」養血明目。'
  },
  'EAR-KIDNEY': {
    teaName: '黑豆杜仲桑椹固腎聰耳飲',
    ingredients: '青仁黑豆（炒香）10g ＋ 桑椹乾 8g ＋ 枸杞 10 粒 ＋ 核桃 2 顆（熱水燜泡 10 分鐘）',
    effect: '「腎開竅於耳」，配合搓揉【耳腎區】溫補腎精、減輕疲勞性耳鳴與久坐腰痠水腫',
    cvsOption: '🏪 超商救急：無糖黑豆水、溫熱黑芝麻糊、無糖濃豆漿',
    byPainType: {
      sharp: '⚡【耳鳴高頻尖銳/熬夜虛火上擾型】壓力大耳鳴如蟬叫：宜喝「黑豆玄參麥冬茶」滋陰降火。',
      empty: '☁️【耳鳴低沉/腰痠手腳冰冷腎氣虛型】累的時候耳鳴加重、後腰空痛：宜喝「黑豆桂圓核桃紅棗茶」溫補腎陽。',
      smooth: '😌【日常平養型】溫熱無糖黑豆水，每日早晚搓熱雙耳 36 下。'
    },
    avoid: '🚫 按後 1 小時忌口：忌重鹹醃漬品（高鈉傷腎加重水腫與耳鳴）、忌冰水與戴耳機開大音量。',
    pregnancySafeAlt: '🤰 孕期安心替代：孕婦喝「無糖炒黑豆水＋桑椹枸杞」非常適合，既能補鐵固腎又能消孕期水腫！'
  },
  'EAR-ADRENAL': {
    teaName: '黃耆辛夷防風抗敏通鼻飲',
    ingredients: '黃耆 6g ＋ 紅棗 3 顆 ＋ 桔梗 4g ＋ 薄荷葉 2g（熱水燜泡 6 分鐘，先聞蒸氣再溫飲）',
    effect: '配合點捏【耳腎上腺】提升衛氣、收斂鼻黏膜水腫，緩解換季過敏狂打噴嚏與午後腦霧',
    cvsOption: '🏪 超商救急：溫熱蜂蜜檸檬水、溫熱薑茶、無糖熱紅茶（利用熱蒸氣通鼻）',
    byPainType: {
      sharp: '⚡【鼻塞黃涕咽乾/風熱發炎型】喉嚨痛、鼻涕濃黃：宜喝「薄荷菊花魚腥草茶」清熱宣肺。',
      empty: '☁️【晨起狂打噴嚏流清涕/肺脾氣虛過敏型】一吹冷風就過敏：宜喝「黃耆紅棗生薑茶（玉屏風散加減）」固表抗敏。',
      smooth: '😌【日常平養型】紅棗枸杞黃耆溫飲，早晨起床先搓熱耳屏與鼻翼。'
    },
    avoid: '🚫 按後 1 小時忌口：忌冰飲、生冷瓜果、帶殼海鮮與高組織胺發物（如加工肉品、酒類）。',
    pregnancySafeAlt: '🤰 孕期提醒：耳腎上腺於孕期不建議重捏；若孕期鼻塞請改按鼻翼旁「迎香穴」並喝「溫熱生薑紅棗水」。'
  }
};

// 繪製 400x680 耳廓全息 SVG 底圖（含倒置胎兒全息透視層與 7 大互動反射區）
export function getEarBaseSvgMarkup(xrayOpacity) {
  return `
    <defs>
      <linearGradient id="earSkinFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F7F1E5" />
        <stop offset="100%" stop-color="#E5D7BF" />
      </linearGradient>
      <linearGradient id="earCavityFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#DFCFB4" />
        <stop offset="100%" stop-color="#D2BEA0" />
      </linearGradient>
    </defs>

    <text x="200" y="28" text-anchor="middle" fill="#2A483A" font-family="Noto Serif TC, serif" font-weight="bold" font-size="13.5">
      👂 耳穴全息反射圖鑑（雙耳對稱・點擊色塊或紅點）
    </text>
    <rect x="44" y="38" width="312" height="22" rx="6" fill="rgba(42,72,58,0.1)" stroke="rgba(42,72,58,0.28)" stroke-width="1"/>
    <text x="200" y="53" text-anchor="middle" fill="#2A483A" font-size="10.5" font-weight="bold">
      全息口訣：「耳如倒置胎兒」——耳垂＝頭面・耳甲＝胸腹內臟・耳上＝下肢
    </text>

    <!-- 方位標示 -->
    <text x="64" y="290" text-anchor="middle" fill="#8C6D46" font-size="10" font-weight="bold">← 臉頰側(前)</text>
    <text x="348" y="290" text-anchor="middle" fill="#8C6D46" font-size="10" font-weight="bold">後腦側(後) →</text>

    <!-- 耳廓主體解剖層 -->
    <g class="skin-layer" stroke="#5A5246" stroke-width="2">
      <!-- 外耳輪 (Helix) 與耳垂 (Lobule) 大輪廓 -->
      <path fill="url(#earSkinFill)" d="
        M 132,235
        C 116,162 146,96 206,96
        C 272,96 318,162 314,258
        C 310,348 286,418 264,475
        C 246,522 212,554 176,548
        C 142,542 126,506 130,462
        C 122,438 118,402 126,374
        C 114,352 116,322 132,304
        Z
      " />

      <!-- 耳輪內緣捲邊線 -->
      <path fill="none" stroke="#6E6354" stroke-width="1.6" d="
        M 146,225
        C 136,168 160,122 206,122
        C 256,122 292,175 288,258
        C 284,335 265,398 248,442
      " />

      <!-- 三角窩 (Triangular Fossa) 深凹區 -->
      <path fill="url(#earCavityFill)" stroke="#6E6354" stroke-width="1.6" d="
        M 162,188
        C 178,158 214,156 238,182
        C 218,205 186,212 162,188 Z
      " />

      <!-- 對耳輪體部 + 對耳輪上腳 / 下腳 (Antihelix) -->
      <path fill="none" stroke="#5A5246" stroke-width="2.2" stroke-linecap="round" d="
        M 164,218
        C 196,214 232,216 254,236
        C 272,258 272,318 250,368
        C 234,402 208,424 182,428
      " />
      <path fill="none" stroke="#5A5246" stroke-width="1.8" stroke-linecap="round" d="
        M 232,162 C 242,190 250,215 254,236
      " />

      <!-- 耳甲艇 (Cymba Conchae：上半部內臟耳窩) & 耳甲腔 (Cavum Conchae：下半部胸肺耳窩) -->
      <path fill="url(#earCavityFill)" stroke="#6E6354" stroke-width="1.6" d="
        M 156,282
        C 176,226 232,226 256,262
        C 272,292 266,356 236,392
        C 208,420 166,416 150,382
        C 142,358 146,315 156,282 Z
      " />

      <!-- 耳輪腳 (Helix Crus：橫貫耳窩正中央的軟骨橫樑，隔開耳甲艇與耳甲腔) -->
      <path fill="url(#earSkinFill)" stroke="#5A5246" stroke-width="2.2" stroke-linecap="round" d="
        M 132,304
        C 158,296 196,298 232,308
        C 236,316 226,324 206,322
        C 176,320 152,322 136,328
      " />

      <!-- 耳屏 (Tragus：耳洞前方小軟骨片) 與外耳道口暗影 -->
      <ellipse cx="164" cy="362" rx="14" ry="18" fill="rgba(55,45,35,0.45)" stroke="none" />
      <path fill="url(#earSkinFill)" stroke="#5A5246" stroke-width="2.2" d="
        M 128,332
        C 146,334 152,346 146,356
        C 154,364 150,378 134,384
        L 124,376 Z
      " />

      <!-- 對耳屏 (Antitragus) -->
      <path fill="none" stroke="#5A5246" stroke-width="2" stroke-linecap="round" d="
        M 154,412 C 166,432 192,434 206,418
      " />
    </g>

    <!-- 解剖分區小字標記 -->
    <g fill="#7A6248" font-size="10" pointer-events="none">
      <text x="198" y="176" text-anchor="middle">三角窩</text>
      <text x="276" y="210" text-anchor="middle">耳舟</text>
      <text x="212" y="262" text-anchor="middle">耳甲艇(腹腔)</text>
      <text x="208" y="366" text-anchor="middle">耳甲腔(心肺)</text>
      <text x="190" y="498" text-anchor="middle">耳垂(頭面眼區)</text>
    </g>

    <!-- 🎨 耳穴 7 大互動反射區色塊（點擊色塊或紅點皆可選取） -->
    <g class="reflex-zones-layer">
      <!-- 1. 耳尖 EAR-APEX -->
      <circle class="reflex-zone-poly" data-point-id="EAR-APEX" cx="204" cy="112" r="14" fill="rgba(184,61,46,0.2)" stroke="#B83D2E" stroke-width="1.4" style="cursor:pointer;"/>
      <!-- 2. 耳神門 EAR-SHENMEN -->
      <ellipse class="reflex-zone-poly" data-point-id="EAR-SHENMEN" cx="196" cy="198" rx="18" ry="13" fill="rgba(184,61,46,0.22)" stroke="#B83D2E" stroke-width="1.5" style="cursor:pointer;"/>
      <!-- 3. 耳腎區 EAR-KIDNEY -->
      <ellipse class="reflex-zone-poly" data-point-id="EAR-KIDNEY" cx="222" cy="236" rx="18" ry="11" fill="rgba(42,72,58,0.22)" stroke="#2A483A" stroke-width="1.4" style="cursor:pointer;"/>
      <!-- 4. 耳肝區 EAR-LIVER -->
      <ellipse class="reflex-zone-poly" data-point-id="EAR-LIVER" cx="248" cy="268" rx="15" ry="18" fill="rgba(42,115,82,0.24)" stroke="#2A483A" stroke-width="1.4" style="cursor:pointer;"/>
      <!-- 5. 耳胃區 EAR-STOMACH -->
      <circle class="reflex-zone-poly" data-point-id="EAR-STOMACH" cx="232" cy="304" r="15" fill="rgba(196,137,59,0.28)" stroke="#C4893B" stroke-width="1.5" style="cursor:pointer;"/>
      <!-- 6. 耳中(零點) EAR-ZERO -->
      <circle class="reflex-zone-poly" data-point-id="EAR-ZERO" cx="162" cy="312" r="13" fill="rgba(196,137,59,0.26)" stroke="#C4893B" stroke-width="1.4" style="cursor:pointer;"/>
      <!-- 7. 耳腎上腺 EAR-ADRENAL -->
      <circle class="reflex-zone-poly" data-point-id="EAR-ADRENAL" cx="138" cy="368" r="13" fill="rgba(184,61,46,0.22)" stroke="#B83D2E" stroke-width="1.4" style="cursor:pointer;"/>
    </g>

    <!-- 🦴 全息「倒置胎兒」骨骼透視層（拉動骨度滑桿可調整透明度） -->
    <g class="skeleton-layer" style="opacity: ${xrayOpacity};" stroke="#8C6D46" stroke-width="2" fill="none" pointer-events="none">
      <!-- 倒置胎兒頭部（位於耳垂） -->
      <circle cx="184" cy="482" r="28" stroke-dasharray="4 3" fill="rgba(196,137,59,0.12)" />
      <text x="184" y="486" text-anchor="middle" fill="#8C6D46" font-size="9.5" stroke="none" font-weight="bold">胎兒頭(耳垂)</text>
      <!-- 倒置胎兒脊椎（沿對耳輪彎曲向上） -->
      <path d="M 188,452 C 232,418 265,338 254,238" stroke-width="5" stroke-dasharray="5 4" opacity="0.65" />
      <!-- 倒置胎兒臀部與捲曲下肢（位於對耳輪上下腳與三角窩） -->
      <path d="M 254,238 C 236,195 204,178 178,192" stroke-width="3.5" stroke-dasharray="3 3" opacity="0.65" />
      <text x="292" y="325" text-anchor="middle" fill="#8C6D46" font-size="9.5" stroke="none">←脊椎全息軸</text>
    </g>

    <rect x="20" y="584" width="360" height="72" rx="10" fill="rgba(42,72,58,0.08)" stroke="rgba(42,72,58,0.25)"/>
    <text x="200" y="605" text-anchor="middle" fill="#2A483A" font-size="11.2" font-weight="bold">
      💡 王不留行籽（耳豆）貼壓法：貼於穴點後每次按揉 1 分鐘、每日 3～5 次，
    </text>
    <text x="200" y="625" text-anchor="middle" fill="#B83D2E" font-size="11" font-weight="bold">
      2～3 天撕除換貼另一耳；無耳貼時用「拇食指對捏」或「圓頭棉棒」點壓效果一樣好！
    </text>
    <text x="200" y="644" text-anchor="middle" fill="#655E53" font-size="9.8">
      ※ 耳穴與足底全息反射區屬中醫傳統養生保健參考，非醫療診斷依據。
    </text>
  `;
}
