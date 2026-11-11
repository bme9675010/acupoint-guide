// 👶 小兒推拿與青少年長高轉骨護眼資料庫
// 註：6歲以下幼童臟腑嬌嫩，推拿手法講究輕快柔和（每分鐘約120~160次），並應塗抹乳液潤滑防破皮；此內容屬傳統中醫保健與日常調養參考，非醫療診斷。

export const CHILD_PRESETS = [
  {
    id: 'child-digest-sleep',
    title: '小兒開脾消積・夜啼好眠方',
    subtitle: '適用挑食厭食、腹脹溢奶、睡不安穩易驚醒',
    icon: '🍼',
    points: ['PED-BANMEN', 'PED-SIHENGWEN', 'PED-PI', 'PED-XIAOTIANXIN', 'PED-NIEJI']
  },
  {
    id: 'youth-growth-vision',
    title: '青少年長高轉骨・3C護眼方',
    subtitle: '發育期刺激生長板骨髓、放鬆睫狀肌防假性近視',
    icon: '🌱',
    points: ['GB39', 'ST36', 'KI1', 'ST2', 'BL2']
  }
];

export const CHILD_SYNONYMS = {
  '小兒': ['PED-PI', 'PED-BANMEN', 'PED-SIHENGWEN', 'PED-TIANHESHI', 'PED-XIAOTIANXIN', 'PED-NIEJI'],
  '小孩': ['PED-PI', 'PED-BANMEN', 'PED-SIHENGWEN', 'PED-TIANHESHI', 'PED-XIAOTIANXIN', 'PED-NIEJI'],
  '小兒推拿': ['PED-PI', 'PED-BANMEN', 'PED-SIHENGWEN', 'PED-TIANHESHI', 'PED-XIAOTIANXIN', 'PED-NIEJI'],
  '挑食': ['PED-PI', 'PED-BANMEN', 'PED-SIHENGWEN', 'ST36'],
  '厭食': ['PED-PI', 'PED-BANMEN', 'PED-SIHENGWEN', 'ST36'],
  '積食': ['PED-BANMEN', 'PED-SIHENGWEN', 'PED-PI', 'ST36'],
  '疳積': ['PED-SIHENGWEN', 'PED-BANMEN', 'PED-PI'],
  '小兒發燒': ['PED-TIANHESHI', 'GV14', 'LU10', 'LI4'],
  '退燒': ['PED-TIANHESHI', 'GV14', 'LU10'],
  '天河水': ['PED-TIANHESHI'],
  '夜啼': ['PED-XIAOTIANXIN', 'EX-HN3', 'HT7', 'PED-NIEJI'],
  '收驚': ['PED-XIAOTIANXIN', 'EX-HN3', 'PC6'],
  '受驚': ['PED-XIAOTIANXIN', 'EX-HN3', 'PC6'],
  '捏脊': ['PED-NIEJI', 'GV14', 'BL23'],
  '長高': ['GB39', 'ST36', 'KI1', 'PED-NIEJI'],
  '轉骨': ['GB39', 'ST36', 'KI1', 'KI3'],
  '懸鐘': ['GB39'],
  '絕骨': ['GB39'],
  '近視': ['ST2', 'BL2', 'EX-HN5'],
  '假性近視': ['ST2', 'BL2', 'EX-HN5'],
  '四白': ['ST2'],
  '兒童護眼': ['ST2', 'BL2', 'EX-HN5'],
  '四縫': ['PED-SIHENGWEN'],
  '板門': ['PED-BANMEN'],
  '脾經': ['PED-PI', 'SP6', 'SP9', 'SP10']
};

export const CHILD_POINTS = [
  {
    id: 'PED-PI',
    name: '小兒脾經（脾土）',
    pinyin: 'Xiǎo Ér Pí Jīng',
    meridian: '小兒推拿特定穴（大拇指螺紋面）',
    attribute: '【小兒開胃吸收第 1 穴】挑食厭食、消瘦吃不胖必推（順揉為補、推尖為清）',
    asymmetric: true,
    views: {
      child: { x: 76, y: 198 }
    },
    location: {
      anatomical: '小兒大拇指末節指腹螺紋面。',
      quickFind: '幼童大拇指像螺旋一圈圈的指腹肉球，順時針旋揉為「補脾經」（健脾開胃吸收好）；從指根推向指尖為「清脾經」（清胃火消食）。',
      cunReference: '小兒大拇指螺紋面全區。',
      boneTip: '小兒大拇指遠端指節掌側軟肉墊',
      steps: [
        '①【幼童手塗乳液】家長先溫暖雙手，在寶寶大拇指塗抹少許乳液或凡士林防止擦傷。',
        '②【拇指指腹貼合】家長以大拇指指腹輕貼寶寶大拇指指腹。',
        '③【輕快旋推或直推】厭食挑食者「順時針輕快旋揉 200~300 次」（補脾）；食積口臭者由指尖往掌心方向推。'
      ],
      hitCheck: {
        correct: '✅ 手法要領：推拿動作輕快柔和（每分鐘約 120~150 次），寶寶神態舒適放鬆，切忌重力猛壓！',
        wrong: '❌ 常見錯誤：不可像大人穴位死命掐按，幼兒皮膚薄嫩，搓破皮是大忌。'
      }
    },
    benefits: {
      tcmFunctions: ['健脾益氣助消化', '改善小兒積食挑食', '強壯體質增進吸收'],
      symptoms: ['胃脹噁心', '消化不良', '手腳冰冷']
    },
    massageGuide: {
      technique: '沾乳液順時針旋推 200 次（補脾經）',
      fingerToUse: '一手握住幼兒小手固定，另一手拇指腹以如春風吹拂般的力道在螺紋面上旋推，每分鐘約 120 次。',
      sensation: '指腹溫熱微癢，幼兒感覺舒服。',
      rhythm: { pressSeconds: 3, releaseSeconds: 1, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'PED-BANMEN', comboName: '小兒健脾消積雙寶', purpose: '推大拇指脾經配手掌揉板門，徹底解決積食厭食與胃脹氣。' },
      { partnerId: 'ST36', comboName: '幼童脾胃吸收方', purpose: '手部推脾經搭配小腿足三里，後天脾胃生化有源，長肉長高。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '💡 適用 0~6 歲幼童。操作前請先修平指甲並塗抹潤滑乳液；皮膚破損或濕疹處暫停推拿。'
    }
  },
  {
    id: 'PED-BANMEN',
    name: '小兒板門穴',
    pinyin: 'Xiǎo Ér Bǎn Mén',
    meridian: '小兒推拿特定穴（手掌大魚際平面）',
    attribute: '【消積導滯小幫手】肚子鼓鼓、吃太撐積食口臭、脹氣溢奶必揉穴',
    asymmetric: true,
    views: {
      child: { x: 104, y: 254 }
    },
    location: {
      anatomical: '小兒手掌大魚際平面的正中央處。',
      quickFind: '在小孩手掌大拇指根部那塊最肥厚柔軟的肉球（大魚際）正中心，用拇指端輕柔畫圓揉按，這就是【板門穴】！',
      cunReference: '手掌大魚際肉球中心凹陷。',
      boneTip: '第一掌骨掌側肌群中央',
      steps: [
        '①【展開幼兒手掌】握住孩子手背，手掌心朝上。',
        '②【指腹對準大魚際中點】找到大拇指下方厚厚的肉球（大魚際）中央。',
        '③【順時針輕揉或推按】指端順時針畫圓揉按 100~300 次（消食化積）；若腹瀉嘔吐可由板門推向手腕。'
      ],
      hitCheck: {
        correct: '✅ 手法要領：吃太飽肚子圓滾滾的小孩，揉板門 2 分鐘會開始打嗝或排氣，腹脹瞬間放鬆！',
        wrong: '❌ 常見錯誤：板門肌肉厚，但不能用指甲猛戳，要以拇指指腹均勻帶動皮下組織揉動。'
      }
    },
    benefits: {
      tcmFunctions: ['健脾和胃消積導滯', '化解小兒脹氣溢奶', '降逆止嘔促排便'],
      symptoms: ['胃脹噁心', '消化不良', '打嗝']
    },
    massageGuide: {
      technique: '拇指指端畫圓揉按 100~200 次（揉板門）',
      fingerToUse: '大拇指指腹貼在孩子大魚際中心，柔和轉動揉按；積食發熱時可由板門向腕橫紋單向直推。',
      sensation: '掌根微溫，腸胃蠕動咕嚕聲。',
      rhythm: { pressSeconds: 3, releaseSeconds: 1, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'PED-SIHENGWEN', comboName: '小兒疳積消食絕配', purpose: '揉板門配掐推四橫紋，孩子積食腹脹胃口不開神效。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '💡 飯後請間隔 30 分鐘再進行推拿，避免剛吃飽過度揉按造成溢奶。'
    }
  },
  {
    id: 'PED-SIHENGWEN',
    name: '小兒四橫紋（四縫穴）',
    pinyin: 'Sì Héng Wén (Sì Fèng)',
    meridian: '小兒推拿特定穴（四指指關節橫紋）',
    attribute: '【中醫疳積第一穴】古法退厭食、消腸脹氣、開胃排積食傳奇奇穴',
    asymmetric: true,
    views: {
      child: { x: 142, y: 154 }
    },
    location: {
      anatomical: '掌面食指、中指、無名指、小指第二指節近端橫紋處（四指各一穴）。',
      quickFind: '把小孩的手心攤開，食指、中指、無名指、小指靠近手掌的「第一指關節橫紋」，這四條橫紋總稱為【四橫紋（四縫穴）】！',
      cunReference: '食、中、無、小四指近端指間關節掌面橫紋。',
      boneTip: '各指骨近節與中節指骨間關節橫紋',
      steps: [
        '①【四指併攏攤平】將小孩手心向上固定。',
        '②【指腹橫推】用家長的大拇指指腹，從食指橫紋一路橫向平推過中指、無名指、小指橫紋。',
        '③【來回推動 100 次】也可以拇指指甲輕輕掐按各橫紋中央 3~5 下（輕掐，不破皮），再快速橫推揉平。'
      ],
      hitCheck: {
        correct: '✅ 手法要領：挑食、肚子大四肢瘦、夜睡翻覆的疳積小孩，連續推拿一週舌苔轉薄、吃飯主動！',
        wrong: '❌ 常見錯誤：民間古法有扎針擠黃水，居家推拿【嚴禁任何扎針】，指腹橫推即可！'
      }
    },
    benefits: {
      tcmFunctions: ['退熱除煩消疳積', '促進消化液分泌', '改善小兒消化不良腹脹'],
      symptoms: ['胃脹噁心', '消化不良', '失眠焦慮']
    },
    massageGuide: {
      technique: '大拇指指腹由食指往小指「橫向來回推」100~200 遍',
      fingerToUse: '家長拇指指腹壓緊四指橫紋線，平穩快速來回刮推，每分鐘 100~120 次。',
      sensation: '指節微溫微紅，小腹膨悶消散。',
      rhythm: { pressSeconds: 3, releaseSeconds: 1, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'PED-PI', comboName: '消補兼施開胃方', purpose: '推四橫紋消宿食、旋推脾經補脾氣，體質虛弱挑食幼童首選。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '居家保健僅限推撫掐壓，切勿自行以針具挑刺！'
    }
  },
  {
    id: 'PED-TIANHESHI',
    name: '小兒清天河水',
    pinyin: 'Qīng Tiān Hé Shuǐ',
    meridian: '小兒推拿特定穴（前臂內側正中線）',
    attribute: '【小兒天然退熱散】感冒初期發燒、心火口瘡、煩躁夜啼必推（溫和物理清熱）',
    asymmetric: true,
    views: {
      child: { x: 126, y: 345 }
    },
    location: {
      anatomical: '前臂內側正中線，自手腕總筋（腕橫紋中點）直至手肘曲澤穴（肘橫紋中點）。',
      quickFind: '手臂手掌心向上，從手腕橫紋正中央，沿著前臂骨肉中間一條線直直往上推到手肘窩，這整條前臂中線就是【天河水】！',
      cunReference: '前臂掌側正中線（腕橫紋至肘橫紋）。',
      boneTip: '前臂橈側與尺側屈肌群正中央正中神經走形線',
      steps: [
        '①【手臂塗溫水或乳液】沾少許溫水、嬰兒薄荷膏或保濕乳液在前臂內側。',
        '②【食中二指併攏】家長併攏食指與中指指腹，從小孩的「手腕橫紋正中」放上。',
        '③【由腕往手肘單向推】以輕快節奏單向「由腕往肘推（由下往上）」，速度每分鐘 150~200 次，連續推 300~500 下。'
      ],
      hitCheck: {
        correct: '✅ 手法要領：夜間低燒發熱（38°C~38.5°C）或口乾煩躁的孩子，推天河水 5 分鐘後常會手心微汗、呼吸平靜入睡。',
        wrong: '❌ 常見錯誤：一定要「由手腕往手肘（由下往上）」推才叫【清天河水】！反方向推會滯熱。'
      }
    },
    benefits: {
      tcmFunctions: ['清心涼血退低熱', '生津除煩解心火', '舒緩小兒感冒發燒夜啼'],
      symptoms: ['發燒', '咽喉乾痛', '失眠焦慮', '嘴破']
    },
    massageGuide: {
      technique: '食中指併攏「由腕向肘單向快推 300~500 次」',
      fingerToUse: '沾少許溫水潤滑皮膚，像春風撫柳般輕快飛推，切忌重刮重壓。',
      sensation: '前臂清涼舒適，微汗透出。',
      rhythm: { pressSeconds: 3, releaseSeconds: 1, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'GV14', comboName: '小兒表裡退熱解毒方', purpose: '清天河水清體內心熱，搭配擦熱大椎穴發汗解表，感冒發燒好幫手。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '⚠️ 發燒安全紅旗：嬰兒 3 個月以下發燒，或體溫超過 39°C、伴隨抽搐、活動力差、紫斑者，必須立刻就醫，不可單靠推拿延誤病情！'
    }
  },
  {
    id: 'PED-XIAOTIANXIN',
    name: '小兒小天心（小天星）',
    pinyin: 'Xiǎo Tiān Xīn',
    meridian: '小兒推拿特定穴（掌根大小魚際交界凹陷）',
    attribute: '【受驚收驚安神穴】半夜哭鬧驚跳、白天受驚、目赤煩躁必搗安神點',
    asymmetric: true,
    views: {
      child: { x: 120, y: 295 }
    },
    location: {
      anatomical: '手掌根部，大魚際與小魚際相交處之凹陷中。',
      quickFind: '手掌攤平，手掌根部靠近手腕處，大拇指肉墊（大魚際）與小拇指肉墊（小魚際）相交會的那個正中心小凹窩，就是【小天心】！',
      cunReference: '掌面大小魚際交接處之凹陷中。',
      boneTip: '掌骨基底與腕骨掌側韌帶交會凹窩',
      steps: [
        '①【掌心向上固定】握住孩子的手，露出掌心底部。',
        '②【中指微屈成小雞啄米】家長以中指指尖或大拇指指腹對準大小魚際交界凹窩。',
        '③【輕啄或柔揉】像小雞啄米般輕搗 50~100 下（稱「搗小天心」），或以指腹順時針揉 1~2 分鐘。'
      ],
      hitCheck: {
        correct: '✅ 手法要領：夜間啼哭、白天被巨響驚嚇跳起的小孩，輕搗此穴 1 分鐘，心率趨穩、眼神安寧。',
        wrong: '❌ 常見錯誤：啄搗力道要極輕快，不可重擊幼兒手腕血管神經。'
      }
    },
    benefits: {
      tcmFunctions: ['清熱鎮驚定心神', '安神止夜啼驚厥', '舒緩目赤眼腫'],
      symptoms: ['失眠焦慮', '夜啼', '頭痛']
    },
    massageGuide: {
      technique: '中指尖輕搗 50 下 或 拇指指腹輕揉 1 分鐘',
      fingerToUse: '手握小孩小手，以指尖彈性跳動輕啄，節奏穩定柔和。',
      sensation: '掌根溫熱酥麻，安撫神經。',
      rhythm: { pressSeconds: 3, releaseSeconds: 1, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'EX-HN3', comboName: '小兒定驚安睡雙星', purpose: '小天心配額頭印堂穴，快速安撫驚嚇哭鬧，安穩睡到天亮。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '夜間入睡前可配合輕柔兒歌或白噪音輕揉此穴。'
    }
  },
  {
    id: 'PED-NIEJI',
    name: '小兒捏脊（華佗夾脊）',
    pinyin: 'Xiǎo Ér Niē Jǐ',
    meridian: '小兒推拿經典大法（督脈與足太陽膀胱經）',
    attribute: '【兒科強體天下第一法】每天早晚捏 5 遍：少生病、健脾胃、促發育長高',
    asymmetric: true,
    views: {
      child: { x: 288, y: 220 }
    },
    location: {
      anatomical: '背部後正中線脊椎兩側（督脈與華佗夾脊穴），自尾骨長強穴向上直推至第七頸椎大椎穴。',
      quickFind: '小孩趴在床上露出背部，從最下方「尾椎骨（屁股上方）」沿著脊椎骨兩側的皮膚，用雙手拇指與食指像捏水餃皮一樣，一邊提捏皮膚一邊往上推進，一路捏到後頸凸起大骨頭【大椎穴】！',
      cunReference: '脊椎正中線旁開 0.5 寸至 1.5 寸兩側皮肉。',
      boneTip: '薦椎尾骨經胸椎至第七頸椎棘突兩側皮下筋膜',
      steps: [
        '①【小孩趴臥塗乳液】讓小孩放鬆俯臥，背部抹少許潤膚油或乳液。',
        '②【雙手拇食指夾起皮膚】雙手食指微屈在前，拇指在後，雙手配合把尾椎兩側皮膚捏夾提起。',
        '③【沿脊椎由下往上推捏】雙指像搓滾輪一樣邊捏邊交替向上推動，直達後頸大椎，做完 1 遍；重複 5~7 遍（第 3 遍起可「捏三提一」輕提一下）。'
      ],
      hitCheck: {
        correct: '✅ 手法要領：捏完背部微紅發熱，持續一到兩週，小孩體質顯著改善，感冒頻率降低、食慾大開！',
        wrong: '❌ 常見錯誤：一定要「由下（尾椎）往上（頸椎）」推進才具升發陽氣、健脾壯骨功效！切忌逆向由上往下搓。'
      }
    },
    benefits: {
      tcmFunctions: ['振奮督脈全身陽氣', '健脾和胃促生長發育', '調節免疫少感冒'],
      symptoms: ['消化不良', '胃脹噁心', '手腳冰冷', '失眠焦慮']
    },
    massageGuide: {
      technique: '由下往上提捏背部皮膚 5~7 遍（捏三提一）',
      fingerToUse: '雙手拇指與食指對捏，指力柔和連貫，遇到緊繃處輕柔提拉鬆開筋膜。',
      sensation: '整個脊椎兩側微紅溫熱，周身陽氣升發舒暢。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: false }
    },
    pairings: [
      { partnerId: 'ST36', comboName: '小兒培元固本長高方', purpose: '晨起捏脊升陽，配揉足三里補後天，是古今小兒發育轉骨最高心法。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '⚠️ 背部有癤腫、皮膚破損、燙傷或高熱驚厥急性期禁捏。操作時室內避風保暖。'
    }
  },
  {
    id: 'GB39',
    name: '懸鐘（絕骨）',
    pinyin: 'Xuán Zhōng (Jué Gǔ)',
    meridian: '足少陽膽經（八會穴之「髓會」）',
    attribute: '【青少年長高轉骨第一穴】骨骼發育、骨髓充盈、小腿修長必按關鍵穴',
    asymmetric: true,
    views: {
      child: { x: 312, y: 475 },
      foot: { x: 122, y: 350 }
    },
    location: {
      anatomical: '在小腿外側，外踝尖上 3 寸，腓骨前緣凹陷中。',
      quickFind: '摸到腳踝外側突起的大骨頭（外踝尖），量「四隻手指併攏寬（3 寸）」，在小腿骨外側骨頭（腓骨）稍微往前一點點的凹陷處，按下去有明顯痠脹感，這就是【懸鐘穴】！',
      cunReference: '外踝尖直上 3 寸（四橫指），腓骨前緣。',
      boneTip: '腓骨前緣長短腓骨肌腱間隙',
      steps: [
        '①【定外踝尖】找到腳踝外側最凸出的骨頭尖點。',
        '②【向上量四指寬】將小孩或青少年自己的手併攏四指，小指放在外踝尖，食指上緣處即為 3 寸。',
        '③【外側骨前緣深揉】用大拇指指腹緊貼骨頭前側凹槽，朝小腿深處垂直按揉 1~2 分鐘。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：青少年生長發育期按壓懸鐘穴，會有明顯的酸麻脹痛感，甚至微傳至足背！',
        wrong: '❌ 常見按偏：太靠近腳跟後側是骨頭後方，一定要在「骨頭前側的凹溝」裡。'
      }
    },
    benefits: {
      tcmFunctions: ['充益骨髓壯骨骼', '舒筋活絡強腰膝', '助青少年生長發育長高'],
      symptoms: ['腰痠背痛', '雙腿痠軟疲勞', '下肢水腫']
    },
    massageGuide: {
      technique: '拇指指腹向骨緣深層按揉 1 分鐘',
      fingerToUse: '雙手大拇指分別按住左右腿懸鐘穴，配合深呼吸一吸一吐，每分鐘按壓 20 次。',
      sensation: '外踝上方痠脹深層，下肢氣血暢通。',
      rhythm: { pressSeconds: 5, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'ST36', comboName: '轉骨長高黃金搭檔', purpose: '懸鐘益骨髓、足三里補氣血，青少年長高衝刺必按組合。' },
      { partnerId: 'KI1', comboName: '下肢引火長骨方', purpose: '懸鐘配足底湧泉，刺激生長激素分泌與足底骨骼。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '💡 生長發育期（小四至國高中）建議睡前配合溫水泡腳後按揉，效果更佳。'
    }
  },
  {
    id: 'ST2',
    name: '四白穴',
    pinyin: 'Sì Bái',
    meridian: '足陽明胃經（學童護眼操必用）',
    attribute: '【假性近視・護眼明目】眼睛疲勞酸澀、黑眼圈、學生族視力保養王牌',
    asymmetric: true,
    views: {
      child: { x: 106, y: 515 },
      head: { x: 172, y: 218 }
    },
    location: {
      anatomical: '在面部，瞳孔直下，當眶下孔凹陷處。',
      quickFind: '眼睛往前平視，由瞳孔正中間垂直往下畫一條線，摸到眼眶下緣骨頭再往下約一個大拇指指甲寬的小凹窩（按下去會酸酸的），這就是國小護眼操第二節的【四白穴】！',
      cunReference: '目正視，瞳孔直下眶下緣下方約 0.5 寸眶下孔處。',
      boneTip: '上頜骨眶下孔凹陷',
      steps: [
        '①【目正視找瞳孔下線】雙眼平視前方，食指沿著黑眼珠中心直直往下摸。',
        '②【摸眼眶骨下小洞】越過眼球下方的眼眶骨，在骨頭下方摸到一個微凹的小孔（眶下孔）。',
        '③【雙指輕柔畫圓】用雙手食指或中指指腹，在左右兩側四白穴輕柔畫圓揉按 36 圈。'
      ],
      hitCheck: {
        correct: '✅ 按對體感：長時間看書寫作業或盯 iPad 的學生，輕揉四白穴會有微酸麻感，揉完眼眶發熱、看東西頓時明亮！',
        wrong: '❌ 錯誤力道：切勿向上頂壓眼球！手指是貼在面頰骨頭的凹孔上，不可按到眼眶內部眼球。'
      }
    },
    benefits: {
      tcmFunctions: ['疏風明目緩眼疲', '改善學童假性近視', '淡化學生黑眼圈與眼周充血'],
      symptoms: ['用眼過度', '頭痛', '鼻塞流涕']
    },
    massageGuide: {
      technique: '食指或中指指腹輕柔畫圓揉按 1 分鐘',
      fingerToUse: '雙手食指貼在面頰四白穴上，其餘手指輕搭在面部，閉目深呼吸輕揉。',
      sensation: '面頰眶下酸脹清爽，眼部緊繃感消除。',
      rhythm: { pressSeconds: 4, releaseSeconds: 2, totalDurationSec: 60, bilateral: true }
    },
    pairings: [
      { partnerId: 'BL2', comboName: '眼眶明目雙奇方', purpose: '眉頭攢竹放鬆上眼眶、面頰四白放鬆下眼眶，學生護眼操之精髓。' },
      { partnerId: 'EX-HN5', comboName: '頭目清爽專注方', purpose: '四白配太陽穴，上課寫作業提神醒腦抗眼疲。' }
    ],
    contraindications: {
      pregnancyForbidden: false,
      notes: '按壓前務必請學童將雙手肥皂洗淨，避免手部細菌碰觸眼周。'
    }
  }
];

export const CHILD_DIETARY_THERAPY = {
  'PED-PI': {
    teaName: '小兒山藥山楂焦麥芽開胃水',
    ingredients: '懷山藥 6g ＋ 焦山楂 3g ＋ 炒麥芽 5g ＋ 陳皮 2g ＋ 紅棗 2 顆（無咖啡因，煮水當日常飲品）',
    effect: '配合推小兒脾經健脾開胃、促進消化液分泌，改善幼童吃不胖、挑食厭食與胃脹氣',
    cvsOption: '🏪 超商救急：常溫無糖優酪乳、原味優格、100% 蘋果原汁配溫開水',
    byPainType: {
      sharp: '⚡【肚子鼓硬/口氣酸臭積食型】吃太撐肚子圓滾滾：宜喝「焦山楂陳皮水」消食化滯。',
      empty: '☁️【面黃肌瘦/吃一點就飽脾虛型】消瘦食慾差：宜喝「四神山藥瘦肉粥或小米南瓜湯」溫補後天脾胃。',
      smooth: '😌【日常平養型】每日溫開水 300cc 配少許紅棗山藥水，飯前半小時不吃甜食零食。'
    },
    avoid: '🚫 小兒飲食禁忌：嚴禁飯前吃甜食手搖飲、忌冰淇淋與油炸速食（極傷幼兒稚嫩脾陽）。',
    pregnancySafeAlt: '👶 幼童安全守則：1 歲以下寶寶【嚴禁食用蜂蜜】（肉毒桿菌中毒風險）！'
  },
  'PED-BANMEN': {
    teaName: '小兒陳皮佛手順氣飲',
    ingredients: '新會陳皮 3g ＋ 佛手片 2g ＋ 炒麥芽 4g（熱水燜泡 10 分鐘，溫飲）',
    effect: '配合揉板門穴化解小兒胃脹溢奶、消食導滯，舒緩吃太快或吃太多造成的腹滿打嗝',
    cvsOption: '🏪 超商救急：常溫無糖燕麥奶、常溫黑豆豆漿、溫開水小口慢喝',
    byPainType: {
      sharp: '⚡【肚子脹氣/打嗝酸腐型】肚子按之鼓脹：宜喝「陳皮炒麥芽溫水」降逆順氣。',
      empty: '☁️【吃飽常吐奶/脾胃軟弱型】胃消化慢：宜喝「生薑半片加紅棗山藥水」溫中和胃。',
      smooth: '😌【日常平養型】每餐七分飽，吃飽後半小時內避免激烈蹦跳。'
    },
    avoid: '🚫 禁忌：忌吃難消化糯米飯糰、年糕甜點、碳酸汽水與生冷寒涼瓜果。',
    pregnancySafeAlt: '👶 幼童安全守則：1 歲以下幼兒以母乳或配方奶為主，食療配方請稀釋成淡水飲用。'
  },
  'PED-SIHENGWEN': {
    teaName: '古法小兒四神開脾排骨湯',
    ingredients: '蓮子 10g ＋ 芡實 10g ＋ 茯苓 8g ＋ 懷山藥 15g ＋ 豬小排骨適量（全家皆可飲用的無中藥味開脾健胃湯）',
    effect: '配合推四橫紋徹底改善小兒疳積、體虛挑食、夜啼翻滾、四肢不長肉',
    cvsOption: '🏪 超商救急：超商熱食區溫熱四神湯（不加酒）、常溫滴雞精 1 包',
    byPainType: {
      sharp: '⚡【舌苔厚膩/積滯煩躁型】舌苔白厚大便臭：宜喝「蘿蔔陳皮山楂湯」化積清熱。',
      empty: '☁️【肚子大四肢細/疳積型】吃不下吸收不良：宜喝「四神山藥排骨湯」健脾補虛。',
      smooth: '😌【日常平養型】平時多吃熟爛米粥與蒸地瓜，維持腸道微生態健康。'
    },
    avoid: '🚫 禁忌：忌油炸雞塊、薯條、重口味滷味與香腸加工肉品。',
    pregnancySafeAlt: '👶 幼童安全守則：若燉煮四神湯，給幼兒喝【絕對嚴禁添加米酒或當歸酒】！'
  },
  'PED-TIANHESHI': {
    teaName: '小兒桑葉薄荷淡竹水',
    ingredients: '桑葉 3g ＋ 薄荷葉 1g ＋ 淡竹葉 2g ＋ 蘆根 4g（溫水燜泡，微汗即可）',
    effect: '配合清天河水物理散熱，舒緩感冒發燒咽痛、口乾舌紅與煩躁夜啼',
    cvsOption: '🏪 超商救急：溫熱無糖菊花茶、常溫寶礦力/舒跑按 1:1 兌溫開水補充電解質',
    byPainType: {
      sharp: '⚡【發燒手足心熱/咽喉紅腫型】發低熱咽痛：宜喝「桑葉薄荷蘆根露」清熱解表。',
      empty: '☁️【發熱無汗/精神稍萎靡型】四肢末梢偏涼：宜喝「蔥白淡豆豉生薑微溫水」散寒通陽。',
      smooth: '😌【日常平養型】平時注意日夜溫差，多喝溫白開水保持口腔濕潤。'
    },
    avoid: '🚫 禁忌：發燒期間嚴禁高蛋白大補湯（如羊肉爐、薑母鴨、大骨湯），忌吃生冷冰品。',
    pregnancySafeAlt: '⚠️ 醫療警示：3 個月以下嬰兒發熱，或發燒逾 39°C 伴隨呼吸急促、抽搐、嗜睡，請立即送急診！'
  },
  'PED-XIAOTIANXIN': {
    teaName: '小兒百合蓮子紅棗小米露',
    ingredients: '新鮮百合 15g ＋ 去芯蓮子 10g ＋ 紅棗 2 顆 ＋ 小米 30g（慢火熬煮成綿密米露，睡前 1 小時溫飲）',
    effect: '配合搗小天心寧心安神、除煩解熱，改善嬰幼兒夜間啼哭驚跳、白天受驚心慌',
    cvsOption: '🏪 超商救急：溫牛奶、常溫無糖豆漿、常溫燕麥飲',
    byPainType: {
      sharp: '⚡【受驚大哭/面紅手足煩熱型】受巨響驚嚇易怒：宜喝「淡竹葉百合蓮子水」清心定驚。',
      empty: '☁️【睡不安穩/微響即驚跳啼哭型】心膽氣虛型：宜喝「紅棗小米蓮子羹」補益心脾。',
      smooth: '😌【日常平養型】睡前營造柔和昏暗燈光，避免睡前看刺激性卡通平板螢幕。'
    },
    avoid: '🚫 禁忌：下午過後嚴禁巧克力、可樂、茶飲等含咖啡因食物（嚴重干擾幼兒中樞神經）。',
    pregnancySafeAlt: '👶 幼童安全守則：蓮子請務必挑除苦味綠色胚芽（蓮芯），避免幼兒因苦味排斥。'
  },
  'PED-NIEJI': {
    teaName: '小兒黃耆紅棗枸杞固本水',
    ingredients: '北黃耆 4g ＋ 紅棗 3 顆 ＋ 枸杞 8 粒（熱水燜泡 15 分鐘，晨起捏脊後溫飲）',
    effect: '配合早晚捏脊振奮督脈陽氣、提升免疫力，改善幼童反覆感冒、過敏打噴嚏與胃口不開',
    cvsOption: '🏪 超商救急：常溫滴雞精、常溫鮮奶配茶葉蛋',
    byPainType: {
      sharp: '⚡【背部發燙/內熱外感型】口渴舌紅：宜喝「蘆根菊花枸杞水」清解內熱。',
      empty: '☁️【易出虛汗/面色蒼白常感冒型】動輒大汗淋漓：宜喝「黃耆紅棗白朮固表水」提升抵抗力。',
      smooth: '😌【日常平養型】每日早晨起床捏脊 5 遍，堅持一個月體質大翻轉。'
    },
    avoid: '🚫 禁忌：空腹或剛吃飽請勿捏脊，背部有傷口皮膚病禁捏。',
    pregnancySafeAlt: '👶 幼童安全守則：手法力度以背部皮膚微紅為度，不可讓小孩疼痛哭鬧恐懼。'
  },
  'GB39': {
    teaName: '青少年轉骨黑豆排骨杜仲骨髓湯',
    ingredients: '青仁黑豆 20g ＋ 杜仲 6g ＋ 懷牛膝 4g ＋ 枸杞 10g ＋ 熟地 6g ＋ 豬排骨 200g（溫和轉骨食材，不含性早熟烈藥）',
    effect: '配合懸鐘穴（八會穴之髓會）與足三里，刺激骨髓充盈、強化筋骨發育，助青少年成長期長高衝刺',
    cvsOption: '🏪 超商救急：無糖高鈣濃豆漿、光泉高鈣鮮乳、茶葉蛋 1~2 顆（充足優質蛋白＋鈣）',
    byPainType: {
      sharp: '⚡【生長痛小腿抽痛/筋骨緊繃型】睡覺腿抽痛：宜喝「溫牛奶配黑芝麻糊」補鈣放鬆肌肉神經。',
      empty: '☁️【體弱發育慢/面色蒼白易倦型】比同齡矮小：宜喝「黑豆杜仲排骨湯」滋養肝腎骨髓。',
      smooth: '😌【日常平養型】每日 1 杯牛奶＋1 顆雞蛋，晚上 10:30 前熟睡（生長激素高峰）。'
    },
    avoid: '🚫 轉骨禁忌：嚴禁熬夜、忌喝含糖碳酸可樂（高磷加速骨骼鈣質流失）、忌油炸速食。',
    pregnancySafeAlt: '🌱 青少年轉骨原則：嚴禁隨便服用未經中醫師診斷的重劑轉骨偏方（避免骨骺線提早閉合或性早熟）。'
  },
  'ST2': {
    teaName: '學童枸杞決明菊花護眼露',
    ingredients: '寧夏枸杞 10 粒 ＋ 炒決明子 4g ＋ 杭白菊 3 朵 ＋ 桑椹乾 4 顆（溫熱沖泡，酸甜無咖啡因）',
    effect: '配合四白穴放鬆睫狀肌痙攣，改善學童看書盯平板造成的眼睛酸澀、假性近視與視疲勞',
    cvsOption: '🏪 超商救急：100% 藍莓汁、無糖胡蘿蔔蔬果汁、奇異果 1 顆（豐富葉黃素與花青素）',
    byPainType: {
      sharp: '⚡【眼脹頭痛/眼白充血型】寫作業太久眼紅痛：宜喝「杭菊桑葉薄荷露」清利頭目。',
      empty: '☁️【眼乾眨眼頻繁/視力模糊型】頻繁眨眼揉眼：宜喝「枸杞桑椹紅棗露」滋潤眼底。',
      smooth: '😌【日常平養型】每用眼 30 分鐘休息 10 分鐘，遠眺 6 公尺外綠色景物。'
    },
    avoid: '🚫 護眼禁忌：嚴禁關燈看手機平板、忌在搖晃車上看書、忌躺著看書。',
    pregnancySafeAlt: '👀 護眼原則：四白穴為眼眶外穴位，按壓時請洗淨雙手，切勿用力向上壓迫眼球。'
  }
};

// 繪製 400x680 小兒推拿與青少年轉骨護眼專題 SVG
export function getChildBaseSvgMarkup(xrayOpacity) {
  return `
    <defs>
      <linearGradient id="childSkinFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FCF8F2" />
        <stop offset="100%" stop-color="#EFE3D0" />
      </linearGradient>
      <linearGradient id="childBackFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F9F3E8" />
        <stop offset="100%" stop-color="#EADDC7" />
      </linearGradient>
      <marker id="pushArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2A7352" />
      </marker>
      <marker id="spineArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#B83D2E" />
      </marker>
    </defs>

    <text x="200" y="26" text-anchor="middle" fill="#2A483A" font-family="Noto Serif TC, serif" font-weight="bold" font-size="13">
      👶 小兒推拿＆學齡轉骨護眼圖鑑（點選色塊或紅點）
    </text>

    <!-- 分區背景卡片 -->
    <!-- 上半部左：小兒手掌特寫 -->
    <rect x="22" y="42" width="186" height="340" rx="12" fill="rgba(42,72,58,0.04)" stroke="rgba(42,72,58,0.18)" />
    <text x="115" y="60" text-anchor="middle" fill="#2A483A" font-size="10.5" font-weight="bold">🍼 0~6歲小兒推拿（手掌與前臂）</text>

    <!-- 上半部右：小兒捏脊路線 -->
    <rect x="216" y="42" width="162" height="340" rx="12" fill="rgba(184,61,46,0.04)" stroke="rgba(184,61,46,0.18)" />
    <text x="297" y="60" text-anchor="middle" fill="#8A2519" font-size="10.5" font-weight="bold">🌿 小兒捏脊（由下往上）</text>

    <!-- 下半部左：學童護眼四白穴 -->
    <rect x="22" y="392" width="170" height="190" rx="12" fill="rgba(196,137,59,0.05)" stroke="rgba(196,137,59,0.22)" />
    <text x="107" y="410" text-anchor="middle" fill="#7A4F13" font-size="10.5" font-weight="bold">👀 學生護眼操（四白穴）</text>

    <!-- 下半部右：青少年轉骨懸鐘穴 -->
    <rect x="200" y="392" width="178" height="190" rx="12" fill="rgba(42,115,82,0.05)" stroke="rgba(42,115,82,0.22)" />
    <text x="289" y="410" text-anchor="middle" fill="#1D4734" font-size="10.5" font-weight="bold">🌱 轉骨長高（懸鐘穴）</text>

    <!-- 🎨 1. 小兒手掌與前臂解剖層 (左上) -->
    <g class="skin-layer" stroke="#5A5246" stroke-width="1.8">
      <!-- 前臂手臂輪廓 -->
      <path fill="url(#childSkinFill)" d="
        M 104,380
        L 108,300
        C 94,295 86,275 88,245
        C 80,235 60,225 64,188
        C 66,168 85,172 94,185
        L 98,222
        C 100,200 114,130 128,124
        C 136,120 144,130 142,154
        L 138,205
        C 142,175 152,115 162,115
        C 172,115 174,135 168,172
        L 162,212
        C 168,185 180,132 188,135
        C 196,138 194,160 186,192
        L 178,225
        C 186,202 196,170 202,175
        C 208,180 204,208 192,238
        C 184,262 176,285 156,298
        L 152,380
        Z
      " />

      <!-- 掌面橫紋與手腕線 -->
      <path fill="none" stroke="#7A6E5D" stroke-width="1.3" d="M 102,282 C 122,285 142,285 156,282" />
      <path fill="none" stroke="#7A6E5D" stroke-width="1.2" d="M 108,245 C 130,248 152,242 165,232" />
    </g>

    <!-- 天河水推動指引箭頭 -->
    <line x1="128" y1="365" x2="128" y2="295" stroke="#2A7352" stroke-width="3" stroke-dasharray="4 2" marker-end="url(#pushArrow)" />
    <text x="136" y="340" fill="#2A7352" font-size="9" font-weight="bold">↑由腕推向肘(清熱)</text>

    <!-- 手掌互動區色塊 -->
    <g class="reflex-zones-layer">
      <!-- 脾經：拇指螺紋面 -->
      <circle class="reflex-zone-poly" data-point-id="PED-PI" cx="76" cy="198" r="14" fill="rgba(196,137,59,0.28)" stroke="#C4893B" stroke-width="1.4" style="cursor:pointer;" />
      <!-- 板門：大魚際肉球 -->
      <ellipse class="reflex-zone-poly" data-point-id="PED-BANMEN" cx="104" cy="254" rx="16" ry="14" fill="rgba(42,72,58,0.22)" stroke="#2A483A" stroke-width="1.4" style="cursor:pointer;" />
      <!-- 四橫紋：四指橫紋線 -->
      <rect class="reflex-zone-poly" data-point-id="PED-SIHENGWEN" x="120" y="146" width="76" height="16" rx="6" fill="rgba(184,61,46,0.22)" stroke="#B83D2E" stroke-width="1.4" style="cursor:pointer;" />
      <!-- 小天心：大小魚際交界凹窩 -->
      <circle class="reflex-zone-poly" data-point-id="PED-XIAOTIANXIN" cx="120" cy="295" r="11" fill="rgba(184,61,46,0.25)" stroke="#B83D2E" stroke-width="1.4" style="cursor:pointer;" />
      <!-- 清天河水：前臂中線 -->
      <rect class="reflex-zone-poly" data-point-id="PED-TIANHESHI" x="120" y="310" width="16" height="60" rx="6" fill="rgba(42,115,82,0.22)" stroke="#2A7352" stroke-width="1.4" style="cursor:pointer;" />
    </g>

    <!-- 🎨 2. 小兒背部捏脊路線解剖層 (右上) -->
    <g class="skin-layer" stroke="#5A5246" stroke-width="1.8">
      <!-- 俯臥幼童背部輪廓 -->
      <path fill="url(#childBackFill)" d="
        M 270,82
        C 255,85 240,110 242,150
        C 244,195 248,260 252,310
        C 254,340 270,360 297,360
        C 324,360 340,340 342,310
        C 346,260 350,195 352,150
        C 354,110 339,85 324,82
        C 310,78 284,78 270,82 Z
      " />
      <!-- 肩胛骨與脊柱溝 -->
      <path fill="none" stroke="#8C6D46" stroke-width="1.4" stroke-dasharray="3 2" opacity="0.6" d="M 262,130 C 270,150 270,180 262,200" />
      <path fill="none" stroke="#8C6D46" stroke-width="1.4" stroke-dasharray="3 2" opacity="0.6" d="M 332,130 C 324,150 324,180 332,200" />
      <!-- 督脈與捏脊推進線（尾椎向上到大椎） -->
      <path fill="none" stroke="#B83D2E" stroke-width="4" stroke-linecap="round" d="M 297,340 L 297,105" marker-end="url(#spineArrow)" />
      <!-- 脊椎兩側夾脊線 -->
      <path fill="none" stroke="#C4893B" stroke-width="2" stroke-dasharray="4 3" d="M 288,335 L 288,110" />
      <path fill="none" stroke="#C4893B" stroke-width="2" stroke-dasharray="4 3" d="M 306,335 L 306,110" />
    </g>

    <!-- 捏脊互動熱區 -->
    <g class="reflex-zones-layer">
      <rect class="reflex-zone-poly" data-point-id="PED-NIEJI" x="280" y="105" width="34" height="235" rx="10" fill="rgba(184,61,46,0.18)" stroke="#B83D2E" stroke-width="1.5" style="cursor:pointer;" />
    </g>
    <text x="297" y="100" text-anchor="middle" fill="#8A2519" font-size="9.5" font-weight="bold">大椎(頸後)</text>
    <text x="297" y="352" text-anchor="middle" fill="#8A2519" font-size="9.5" font-weight="bold">長強(尾椎)</text>
    <text x="348" y="225" text-anchor="middle" fill="#B83D2E" font-size="9.2">由下往上提捏↑</text>

    <!-- 🎨 3. 學生護眼四白穴面部特寫 (左下) -->
    <g class="skin-layer" stroke="#5A5246" stroke-width="1.6" fill="url(#childSkinFill)">
      <!-- 少年面部輪廓 -->
      <path d="
        M 62,430
        C 58,470 65,520 85,550
        C 95,565 119,565 129,550
        C 149,520 156,470 152,430
        Z
      " />
      <!-- 雙眼與鼻樑 -->
      <path fill="none" stroke="#5A5246" stroke-width="1.8" d="M 78,480 Q 92,472 106,480" />
      <path fill="none" stroke="#5A5246" stroke-width="1.8" d="M 108,480 Q 122,472 136,480" />
      <circle cx="92" cy="484" r="3" fill="#332A20" />
      <circle cx="122" cy="484" r="3" fill="#332A20" />
      <path fill="none" stroke="#7A6E5D" stroke-width="1.2" d="M 107,485 L 105,510 L 109,510" />
      <!-- 眼眶下緣骨度線 -->
      <path fill="none" stroke="#8C6D46" stroke-width="1.2" stroke-dasharray="2 2" d="M 80,496 Q 92,504 104,496" />
      <path fill="none" stroke="#8C6D46" stroke-width="1.2" stroke-dasharray="2 2" d="M 110,496 Q 122,504 134,496" />
    </g>

    <g class="reflex-zones-layer">
      <!-- 左右四白穴 (瞳孔直下眶下孔) -->
      <circle class="reflex-zone-poly" data-point-id="ST2" cx="92" cy="515" r="9" fill="rgba(196,137,59,0.3)" stroke="#C4893B" stroke-width="1.5" style="cursor:pointer;" />
      <circle class="reflex-zone-poly" data-point-id="ST2" cx="122" cy="515" r="9" fill="rgba(196,137,59,0.3)" stroke="#C4893B" stroke-width="1.5" style="cursor:pointer;" />
    </g>
    <text x="107" y="542" text-anchor="middle" fill="#7A4F13" font-size="9.5" font-weight="bold">四白穴(雙側眼眶下緣)</text>

    <!-- 🎨 4. 青少年轉骨懸鐘穴小腿特寫 (右下) -->
    <g class="skin-layer" stroke="#5A5246" stroke-width="1.6" fill="url(#childSkinFill)">
      <!-- 小腿下段與外踝輪廓 -->
      <path d="
        M 252,425
        L 256,510
        C 252,530 248,555 258,565
        L 326,565
        C 334,555 330,528 322,510
        L 315,425
        Z
      " />
      <!-- 外踝突起骨頭 -->
      <circle cx="304" cy="535" r="9" fill="rgba(140,109,70,0.22)" stroke="#8C6D46" stroke-width="1.4" />
      <!-- 腓骨長骨骨度線 -->
      <line x1="304" y1="428" x2="304" y2="526" stroke="#8C6D46" stroke-width="3" stroke-dasharray="3 3" opacity="0.45" />
    </g>

    <!-- 3寸量尺標記 (外踝尖上3寸) -->
    <line x1="324" y1="535" x2="324" y2="475" stroke="#1D4734" stroke-width="1.4" stroke-dasharray="2 2" />
    <text x="348" y="508" fill="#1D4734" font-size="9" font-weight="bold">↑3寸(4指寬)</text>

    <g class="reflex-zones-layer">
      <!-- 懸鐘穴 (外踝上3寸腓骨前緣) -->
      <circle class="reflex-zone-poly" data-point-id="GB39" cx="300" cy="475" r="11" fill="rgba(42,115,82,0.28)" stroke="#2A7352" stroke-width="1.6" style="cursor:pointer;" />
    </g>
    <text x="278" y="479" text-anchor="end" fill="#1D4734" font-size="9.5" font-weight="bold">懸鐘穴(髓會)</text>
    <text x="304" y="555" text-anchor="middle" fill="#8C6D46" font-size="8.8">外踝尖</text>

    <!-- 底部安全守則提醍 -->
    <rect x="22" y="594" width="356" height="74" rx="10" fill="rgba(42,72,58,0.08)" stroke="rgba(42,72,58,0.25)" />
    <text x="200" y="614" text-anchor="middle" fill="#2A483A" font-size="11.2" font-weight="bold">
      💡 小兒推拿安全守則：6歲以下宜塗乳液「輕快推撫」（每分鐘120次），嚴禁大人重力死壓！
    </text>
    <text x="200" y="633" text-anchor="middle" fill="#B83D2E" font-size="11" font-weight="bold">
      1歲半以下囟門未閉禁重按百會；1歲以下禁吃蜂蜜！幼童高燒抽搐或精神萎靡請立即就醫。
    </text>
    <text x="200" y="652" text-anchor="middle" fill="#655E53" font-size="9.6">
      ※ 兒童推拿與青少年轉骨穴位屬中醫傳統養生調養參考，非醫療診斷或療效保證。
    </text>
  `;
}
