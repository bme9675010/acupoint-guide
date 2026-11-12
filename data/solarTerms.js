// 📅 二十四節氣中醫天人合一養生庫（歲律節氣 × 本命穴位 × 當令茶飲）

// 21 世紀 24 節氣天文常數 C 值（用於精確推算每年交節日期）
const C_21ST = [
  5.4055, 20.12,   // 1月: 小寒, 大寒
  3.87, 18.73,     // 2月: 立春, 雨水
  5.63, 20.646,    // 3月: 驚蟄, 春分
  4.81, 20.1,      // 4月: 清明, 穀雨
  5.52, 21.04,     // 5月: 立夏, 小滿
  5.678, 21.37,    // 6月: 芒種, 夏至
  7.108, 22.83,    // 7月: 小暑, 大暑
  7.5, 23.13,      // 8月: 立秋, 處暑
  7.646, 23.042,   // 9月: 白露, 秋分
  8.318, 23.438,   // 10月: 寒露, 霜降
  7.438, 21.94,    // 11月: 立冬, 小雪
  7.18, 21.94      // 12月: 大雪, 冬至
];

export const SOLAR_TERMS = [
  // 1月
  {
    index: 0,
    name: '小寒',
    pinyin: 'Xiǎohán',
    month: 1,
    season: '冬季',
    slogan: '三九嚴寒・補腎防凍',
    essence: '俗話說「冷在三九」，此時寒氣至極，人體陰氣極盛而陽氣內斂。首重護腎藏精、溫經通絡，足部受寒最易傷腎，宜勤按足底與命門要穴。',
    recommendedPointIds: ['KI1', 'CV6', 'SP6'],
    tea: {
      name: '肉桂薑棗補元茶',
      recipe: '肉桂 2g、生薑 3 片、紅棗 3 顆（去核剖開）熱水悶泡',
      effect: '溫經散寒、溫暖脾腎陽氣',
      cvsOption: '超商桂圓紅棗茶＋一包生薑紅茶',
      avoid: '忌冷飲、生冷沙拉與赤腳踩地磚'
    }
  },
  {
    index: 1,
    name: '大寒',
    pinyin: 'Dàhán',
    month: 1,
    season: '冬季',
    slogan: '寒極生陽・培補脾腎',
    essence: '一年最後一個節氣，寒氣雖重，然地底陽氣已悄然生發。此時需兼顧「冬藏」與「迎春」，多按揉脾經與大椎以固表禦寒，防春前風寒夾襲。',
    recommendedPointIds: ['ST36', 'GV14', 'KI3'],
    tea: {
      name: '黃耆枸杞溫陽茶',
      recipe: '黃耆 5g、枸杞 10 顆、大棗 2 顆，熱水 500ml 沖泡',
      effect: '補氣升陽、固表防感冒',
      cvsOption: '超商熱人參飲或枸杞紅棗茶',
      avoid: '清晨早起迎冷風運動、高油膩宵夜'
    }
  },
  // 2月
  {
    index: 2,
    name: '立春',
    pinyin: 'Lìchūn',
    month: 2,
    season: '春季',
    slogan: '東風解凍・春陽升發',
    essence: '「春生、夏長、秋收、冬藏」，春季屬木對應肝臟。肝喜條達而惡抑鬱，初春陽氣破土，宜疏利肝膽、舒暢胸懷，切忌大怒鬱結。',
    recommendedPointIds: ['LR3', 'GB20', 'GB21'],
    tea: {
      name: '玫瑰佛手疏肝茶',
      recipe: '乾燥粉玫瑰 5 朵、佛手或陳皮 3g，熱水沖泡 5 分鐘',
      effect: '疏肝解鬱、行氣活血、解春困',
      cvsOption: '超商洋甘菊茶或玫瑰花草茶包',
      avoid: '酸味過盛收斂肝氣、熬夜透支陽氣'
    }
  },
  {
    index: 3,
    name: '雨水',
    pinyin: 'Yǔshuǐ',
    month: 2,
    season: '春季',
    slogan: '春雨綿綿・健脾祛濕',
    essence: '氣溫回升但濕氣漸起，中醫認為「濕困脾陽」。脾胃為後天之本，若脾不運化則水濕內停，容易頭重腳輕、大便黏滯，按揉脾胃穴位最適宜。',
    recommendedPointIds: ['SP9', 'CV12', 'ST36'],
    tea: {
      name: '茯苓炒薏仁化濕茶',
      recipe: '茯苓 6g、熟薏仁 10g、陳皮 1 片，慢火煮茶飲用',
      effect: '淡滲利濕、理氣健脾',
      cvsOption: '超商無糖薏仁漿或熟薏仁水',
      avoid: '重口味油炸、甜膩蛋糕奶茶'
    }
  },
  // 3月
  {
    index: 4,
    name: '驚蟄',
    pinyin: 'Jīngzhé',
    month: 3,
    season: '春季',
    slogan: '春雷初響・通調氣血',
    essence: '天地雷動，萬物萌發。人體體內陽氣疾速上升，肝陽旺盛，容易頭脹、目赤、血壓波動或過敏性鼻炎發作，需平肝潛陽、通達四肢。',
    recommendedPointIds: ['LR3', 'LI4', 'GB21'],
    tea: {
      name: '薄荷桑葉清肝茶',
      recipe: '菊花 3g、桑葉 3g、薄荷 1g（後下），沸水沖泡',
      effect: '疏散風熱、清利頭目、解春風燥火',
      cvsOption: '超商無糖菊花茶或薄荷茶',
      avoid: '過度辛辣燒烤、暴躁動怒'
    }
  },
  {
    index: 5,
    name: '春分',
    pinyin: 'Chūnfēn',
    month: 3,
    season: '春季',
    slogan: '晝夜均分・調和陰陽',
    essence: '春分日晝夜均分，寒溫平衡。此時養生當維持體內陰陽協調，防忽冷忽熱誘發心腦血管不適與自律神經失調，多按心包經與百會平衡心神。',
    recommendedPointIds: ['GV20', 'PC6', 'HT7'],
    tea: {
      name: '洋甘菊茉莉安神茶',
      recipe: '洋甘菊 3g、茉莉花 2g、炙甘草 1 片沖泡',
      effect: '安撫自律神經、調和陰陽氣血',
      cvsOption: '超商洋甘菊草本茶',
      avoid: '大寒大熱之食物、晝夜作息顛倒'
    }
  },
  // 4月
  {
    index: 6,
    name: '清明',
    pinyin: 'Qīngmíng',
    month: 4,
    season: '春季',
    slogan: '氣清景明・清降肝火',
    essence: '清明時節萬物潔齊而清爽，然而濕氣與溫燥夾雜，易發春季花粉過敏與情緒多愁善感。宜多做深呼吸吐納、按揉印堂與太衝，神清氣爽。',
    recommendedPointIds: ['EX-HN3', 'LR3', 'GB20'],
    tea: {
      name: '枸杞菊花決明茶',
      recipe: '炒決明子 5g、白菊花 3 朵、枸杞 10 顆沖熱水',
      effect: '清熱平肝、潤腸通便、明目舒壓',
      cvsOption: '超商瓶裝決明子麥茶（無糖）',
      avoid: '長久久坐盯螢幕、情志憂鬱傷肝'
    }
  },
  {
    index: 7,
    name: '穀雨',
    pinyin: 'Gǔyǔ',
    month: 4,
    season: '春季',
    slogan: '春末夏初・防濕熱痹',
    essence: '穀雨是春季最後一個節氣，此時雨水驟增，空氣濕度攀升，脾胃運化負擔加重。身體容易感覺沉重疲倦、四肢關節痠痛，宜化痰除濕通經絡。',
    recommendedPointIds: ['ST40', 'SP9', 'SP6'],
    tea: {
      name: '玉米鬚陳皮化濁茶',
      recipe: '玉米鬚 5g、廣陳皮 3g，燜泡 10 分鐘溫飲',
      effect: '利水消水腫、行氣健脾祛濁濕',
      cvsOption: '超商玉米鬚茶或玄米茶',
      avoid: '生冷刺身、過量啤酒、淋雨受濕'
    }
  },
  // 5月
  {
    index: 8,
    name: '立夏',
    pinyin: 'Lìxià',
    month: 5,
    season: '夏季',
    slogan: '初夏火盛・清心養神',
    essence: '「夏氣通於心」，夏天心陽旺盛，心火容易偏亢。初夏人體新陳代謝加快，出汗漸多，易心悸口苦、心煩意亂，宜著重心神調養與寬胸理氣。',
    recommendedPointIds: ['HT7', 'PC6', 'CV17'],
    tea: {
      name: '蓮子心麥冬靜心茶',
      recipe: '蓮子心 1g（數枚即可）、麥冬 3g、綠茶少許沖泡',
      effect: '清瀉心火而不傷陰、安神除煩',
      cvsOption: '超商冷泡無糖綠茶加少許常溫水',
      avoid: '大汗淋漓後急飲冰水、正午暴曬'
    }
  },
  {
    index: 9,
    name: '小滿',
    pinyin: 'Xiǎomǎn',
    month: 5,
    season: '夏季',
    slogan: '萬物小滿・清涼解毒',
    essence: '小滿節氣江南水鄉水滿，氣候濕熱交加。人體濕熱鬱於肌膚易發濕疹、汗皰疹，當清利濕熱、涼血活血，重點按揉血海與曲池穴。',
    recommendedPointIds: ['SP10', 'LI11', 'SP9'],
    tea: {
      name: '金銀花甘草清肌飲',
      recipe: '金銀花 3g、甘草 2 片、綠豆 1 把煮湯代茶',
      effect: '清熱解毒、涼血透疹、消暑除悶',
      cvsOption: '超商仙草蜜（微糖/無糖）或綠豆薏仁飲',
      avoid: '油炸荔枝芒果多食、悶熱濕汗不擦乾'
    }
  },
  // 6月
  {
    index: 10,
    name: '芒種',
    pinyin: 'Mángzhòng',
    month: 6,
    season: '夏季',
    slogan: '梅雨溽熱・健脾消暑',
    essence: '芒種時節天氣悶熱潮濕，中醫稱之為「苦夏」。人體汗液排泄不暢，脾胃虛弱食慾不振，精神困頓倦怠，宜以酸甘生津、開胃健脾為法。',
    recommendedPointIds: ['ST36', 'SP6', 'CV12'],
    tea: {
      name: '烏梅山楂消食飲',
      recipe: '烏梅 2 顆、生山楂 3g、甘草 1 片沸水燜泡',
      effect: '酸甘生津止渴、開胃消滯、醒脾解膩',
      cvsOption: '超商無糖酸梅湯或洛神花茶',
      avoid: '三餐不定食、過飽食肉阻礙消化'
    }
  },
  {
    index: 11,
    name: '夏至',
    pinyin: 'Xiàzhì',
    month: 6,
    season: '夏季',
    slogan: '日長之至・陽極陰生',
    essence: '夏至是一年之中白天最長、陽氣最盛之日。中醫「陽極生陰」，此時外熱內虛，切忌因貪涼吹冷氣而損傷深層陽氣，需藉湧泉引火歸元。',
    recommendedPointIds: ['KI1', 'GV20', 'HT7'],
    tea: {
      name: '生脈益氣生津飲',
      recipe: '西洋參 2g、麥冬 5g、五味子 1g（七粒），沖泡代茶',
      effect: '補氣養陰、斂汗生津、改善夏日疲乏',
      cvsOption: '超商西洋參活力飲或麥茶',
      avoid: '對著冷氣出風口直吹、徹夜不關空調'
    }
  },
  // 7月
  {
    index: 12,
    name: '小暑',
    pinyin: 'Xiǎoshǔ',
    month: 7,
    season: '夏季',
    slogan: '溫風初盛・防中暑耗氣',
    essence: '「小暑大暑，上蒸下煮」，天氣進入一年最酷熱的高溫潮濕階段。暑多夾濕，最易傷津耗氣，宜以清涼解表、降壓醒腦為養生主軸。',
    recommendedPointIds: ['LI11', 'LI4', 'PC6'],
    tea: {
      name: '荷葉冬瓜消暑茶',
      recipe: '乾荷葉 3g、冬瓜子 5g，熱水浸泡 15 分鐘放溫飲用',
      effect: '清熱化暑、健脾升清、輕身利尿',
      cvsOption: '超商無糖青草茶或冬瓜茶（半糖以上加水稀釋）',
      avoid: '正午戶外暴曬久站、大量冰沙冷飲下肚'
    }
  },
  {
    index: 13,
    name: '大暑',
    pinyin: 'Dàshǔ',
    month: 7,
    season: '夏季',
    slogan: '酷暑炎天・冬病夏治',
    essence: '一年最熱之時，三伏天正當其令。此時人體氣血浮於肌表，毛孔開泄，正是藉天時陽氣逼出體內深層伏寒之良機（三伏貼時機），多按足三里固護中氣。',
    recommendedPointIds: ['ST36', 'CV12', 'SP9'],
    tea: {
      name: '西洋參薄荷醒神露',
      recipe: '花旗參片 2g、新鮮薄荷 2 片、蜂蜜 1 匙溫水沖調',
      effect: '益氣生津、清暑降火、提神解疲',
      cvsOption: '超商薄荷洋甘菊或人參烏龍茶',
      avoid: '大汗後立刻沖冷水澡、整日閉門不出'
    }
  },
  // 8月
  {
    index: 14,
    name: '立秋',
    pinyin: 'Lìqiū',
    month: 8,
    season: '秋季',
    slogan: '秋風乍起・清熱潤燥',
    essence: '「立秋之日涼風至」，雖仍有「秋老虎」餘熱，但天地陰陽之氣已由「生長」轉為「收斂」。肺主秋，宜潤肺滋陰、防燥邪侵肺引發乾咳。',
    recommendedPointIds: ['LU7', 'LI4', 'ST36'],
    tea: {
      name: '沙參玉竹百合茶',
      recipe: '沙參 4g、玉竹 4g、百合 3g，熱水浸泡飲用',
      effect: '養陰潤肺、益胃生津、防咽乾口燥',
      cvsOption: '超商銀耳露或雪梨紅棗露',
      avoid: '劇烈耗氧爆汗運動、進食過多生薑辣椒'
    }
  },
  {
    index: 15,
    name: '處暑',
    pinyin: 'Chùshǔ',
    month: 8,
    season: '秋季',
    slogan: '暑氣漸消・解秋乏除燥',
    essence: '「處」者止也，暑氣至此逐漸止息。人體在此時容易出現俗稱「秋乏」的倦怠感，是身體自我調節陰陽的自然反應，宜早睡早起、益氣補津。',
    recommendedPointIds: ['LU7', 'PC6', 'SP6'],
    tea: {
      name: '雪梨銀耳枸杞茶',
      recipe: '雪梨乾 2 片、銀耳 5g、枸杞 10 粒沖熱水',
      effect: '滋陰潤喉、補肺養心、解乏充沛活力',
      cvsOption: '超商白木耳養生飲',
      avoid: '熬夜耗傷陰津、過度悲傷憂思'
    }
  },
  // 9月
  {
    index: 16,
    name: '白露',
    pinyin: 'Báilù',
    month: 9,
    season: '秋季',
    slogan: '白露凝珠・防寒護肺',
    essence: '「白露秋分夜，一夜冷一夜」。此時日夜溫差急劇拉大，清晨地表草木凝結白色露珠。俗話說「白露身不露」，切忌露臍赤足，宜防受涼傷肺傷脾。',
    recommendedPointIds: ['LU7', 'ST36', 'KI3'],
    tea: {
      name: '百合甜杏仁潤肺茶',
      recipe: '甜杏仁 5g、百合 4g、陳皮 1 小角慢煮飲用',
      effect: '潤燥止咳、理氣和胃、化痰定喘',
      cvsOption: '超商杏仁茶（無糖/少糖）',
      avoid: '短褲露膝受風、吃寒涼冰瓜水果'
    }
  },
  {
    index: 17,
    name: '秋分',
    pinyin: 'Qiūfēn',
    month: 9,
    season: '秋季',
    slogan: '陰陽中半・滋陰防燥',
    essence: '秋分晝夜再次平分，此後黑夜漸長於白晝。秋燥此時由「溫燥」轉為「涼燥」，皮膚乾燥、乾咳少痰、便秘多發，宜著重滋補腎水與潤肺生津。',
    recommendedPointIds: ['KI3', 'SP6', 'LU7'],
    tea: {
      name: '麥冬石斛甘露茶',
      recipe: '麥門冬 5g、石斛 3g、枸杞 8 粒沸水沖泡',
      effect: '滋養腎陰、益胃生津、潤燥養顏',
      cvsOption: '超商微甜蜂蜜菊花茶或黑豆水',
      avoid: '過度辛辣刺激、空氣過度乾燥不通風'
    }
  },
  // 10月
  {
    index: 18,
    name: '寒露',
    pinyin: 'Hánlù',
    month: 10,
    season: '秋季',
    slogan: '寒氣初顯・溫足補腎',
    essence: '「吃了寒露飯，單衣漢少見」。露水已寒，將凝結為霜。中醫「寒從腳下起」，足部神經末梢離心臟最遠、脂肪層薄，最易受寒，勤按湧泉與泡腳正當其時。',
    recommendedPointIds: ['KI1', 'KI3', 'SP6'],
    tea: {
      name: '枸杞桂圓溫補茶',
      recipe: '桂圓乾 3 顆、枸杞 10 顆、紅棗 2 顆（掰開），熱水沖泡',
      effect: '溫養氣血、暖身健脾、安神助眠',
      cvsOption: '超商熱桂圓紅棗茶',
      avoid: '赤足踩冷地板、穿露踝九分褲受寒'
    }
  },
  {
    index: 19,
    name: '霜降',
    pinyin: 'Shuāngjiàng',
    month: 10,
    season: '秋季',
    slogan: '秋晚霜降・補脾防老寒腿',
    essence: '霜降是秋季最後一個節氣，也是秋向冬過渡之關鍵時期。民間有「一年補透透，不如補霜降」之說，此時宜健脾養胃、溫通下肢氣血，防膝關節痠冷。',
    recommendedPointIds: ['ST36', 'CV6', 'SP10'],
    tea: {
      name: '黃耆紅棗健脾茶',
      recipe: '黃耆 6g、大棗 3 顆、黨參 3g 慢火煮 10 分鐘',
      effect: '補中益氣、健脾溫中、提升抗寒能力',
      cvsOption: '超商熱人參飲或紅棗茶',
      avoid: '劇烈迎風出汗、暴飲暴食損傷脾胃'
    }
  },
  // 11月
  {
    index: 20,
    name: '立冬',
    pinyin: 'Lìdōng',
    month: 11,
    season: '冬季',
    slogan: '冬令進補・立冬藏精',
    essence: '「立，建始也；冬，終也，萬物收藏也」。冬天萬物進入休眠閉藏狀態，人體陽氣深伏體內，此時養生宜「早臥晚起、必待日光」，固腎藏精、艾灸按壓關元氣海。',
    recommendedPointIds: ['CV6', 'KI3', 'BL60'],
    tea: {
      name: '生薑紅棗黑糖飲',
      recipe: '帶皮老薑 3 片、黑糖 10g、紅棗 2 顆熱水燜煮',
      effect: '散寒溫經、暖宮健胃、促進末梢循環',
      cvsOption: '超商黑糖薑茶熱飲',
      avoid: '熬夜消耗陰陽本元、衣著過於單薄'
    }
  },
  {
    index: 21,
    name: '小雪',
    pinyin: 'Xiǎoxuě',
    month: 11,
    season: '冬季',
    slogan: '地寒氣閉・疏鬱補腎',
    essence: '小雪節氣天氣日漸陰冷，日照減少，陰盛陽衰，易生「季節性情緒憂鬱」。宜多曬太陽、疏通肝經與膽經解鬱，同時按揉太衝與湧泉穴。',
    recommendedPointIds: ['LR3', 'KI1', 'CV17'],
    tea: {
      name: '玫瑰黑豆疏鬱茶',
      recipe: '熟黑豆 10g、粉玫瑰 3 朵、枸杞 5 粒溫水沖泡',
      effect: '補腎活血、舒肝解鬱、調暢情緒',
      cvsOption: '超商黑豆水或決明菊花茶',
      avoid: '獨處閉門鬱結、過食燥熱麻辣火鍋'
    }
  },
  // 12月
  {
    index: 22,
    name: '大雪',
    pinyin: 'Dàxuě',
    month: 12,
    season: '冬季',
    slogan: '大雪封藏・溫陽固表',
    essence: '降雪量漸多，寒潮頻發。人體頸後、背部與大椎最易受風寒之邪直擊，引發偏頭痛與肩頸僵硬。宜戴圍巾護頸，多按大椎與崑崙穴驅風散寒。',
    recommendedPointIds: ['GV14', 'BL60', 'GB20'],
    tea: {
      name: '肉桂黑糖暖身茶',
      recipe: '肉桂粉 1g、黑糖 1 匙、熱紅茶 300ml 調勻',
      effect: '補火助陽、散寒止痛、溫通周身經脈',
      cvsOption: '超商熱黑糖紅茶拿鐵（無糖/少糖）',
      avoid: '頸肩露空受寒、冬夜迎冷風狂歡'
    }
  },
  {
    index: 23,
    name: '冬至',
    pinyin: 'Dōngzhì',
    month: 12,
    season: '冬季',
    slogan: '一陽初生・進補大吉',
    essence: '冬至是一年之中白天最短、黑夜最長的一天，中醫謂「冬至一陽生」，生命萌發新起點。此時進補吸收最佳，宜早睡閉藏陽氣，按揉氣海關元與湧泉穴以迎新陽。',
    recommendedPointIds: ['CV6', 'KI1', 'ST36'],
    tea: {
      name: '高麗人參枸杞茶',
      recipe: '高麗參片 2g、枸杞 10 顆、炙甘草 1 片熱水沖服',
      effect: '大補元氣、益氣固脫、溫補微弱初陽',
      cvsOption: '超商熱人參精或桂圓茶',
      avoid: '進補過度引發上火牙痛、冬至日同房洩精'
    }
  }
];

/**
 * 依西曆年與節氣編號（0~23），精準計算交節之日（日曆日）
 * 公式：[Y * D + C] - L
 * Y: 西元後兩位
 * D: 0.2422
 * C: 21世紀常數
 * L: 閏年數 (Y-1)/4
 */
function getSolarTermDay(year, termIndex) {
  const y = year % 100;
  const c = C_21ST[termIndex];
  const leapCount = Math.floor((y - 1) / 4);
  return Math.floor(y * 0.2422 + c) - leapCount;
}

/**
 * 取得當前西曆日期所對應之當令二十四節氣
 * @param {Date} date 
 */
export function getCurrentSolarTerm(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1 ~ 12
  const day = date.getDate();

  // 計算今年 24 節氣之精確交節日期
  const termDates = [];
  for (let i = 0; i < 24; i++) {
    const tMonth = Math.floor(i / 2) + 1;
    const tDay = getSolarTermDay(year, i);
    termDates.push({
      term: SOLAR_TERMS[i],
      month: tMonth,
      day: tDay,
      dateObj: new Date(year, tMonth - 1, tDay)
    });
  }

  // 尋找當前日期所處的節氣區間
  // 若早於今年第一個節氣（小寒），則屬於去年最後一個節氣（冬至）
  if (month === 1 && day < termDates[0].day) {
    return {
      current: SOLAR_TERMS[23], // 冬至
      next: SOLAR_TERMS[0],     // 小寒
      isExactTermDay: false
    };
  }

  let matchedIdx = 0;
  for (let i = 0; i < 24; i++) {
    const cur = termDates[i];
    const isAfterOrEqualCur = (month > cur.month) || (month === cur.month && day >= cur.day);
    if (isAfterOrEqualCur) {
      matchedIdx = i;
    } else {
      break;
    }
  }

  const currentTerm = SOLAR_TERMS[matchedIdx];
  const nextIdx = (matchedIdx + 1) % 24;
  const nextTerm = SOLAR_TERMS[nextIdx];
  const isExactTermDay = (month === termDates[matchedIdx].month && day === termDates[matchedIdx].day);

  return {
    current: currentTerm,
    next: nextTerm,
    isExactTermDay
  };
}
