// WebRTC + MediaPipe 端側 AI 即時手部、臉部、小腿、背部與足底 AR 找穴模組（零雲端費用，支援 iPhone WebGL GPU 加速）

export const VISION_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
export const WASM_PATH = `${VISION_CDN}/wasm`;
export const HAND_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
export const FACE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
export const POSE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

// 支援 AR 視覺定位的穴位清單與模式映射（全站 56 穴 100% 完整支援：手/臉/小腿/背部/胸腹/足底/耳穴）
export const AR_SUPPORTED_POINTS = {
  // ✋ 手部穴位 (HandLandmarker 21 點骨骼追蹤)
  LI4: { mode: 'hand', name: '合谷', hint: '請將「手背或手掌」張開對準鏡頭，紅點即為第二掌骨中點合谷穴' },
  LU10: { mode: 'hand', name: '魚際', hint: '請將「大拇指根部魚際肌」對準鏡頭，標出第一掌骨中點魚際穴' },
  PC8: { mode: 'hand', name: '勞宮', hint: '請將「手掌心」張開對準鏡頭，標出掌心正中央勞宮穴' },
  LU7: { mode: 'hand', name: '列缺', hint: '請將「手腕大拇指外側緣」對準鏡頭，標出橈骨莖突上方列缺穴' },
  PC6: { mode: 'hand', name: '內關', hint: '請將「手掌心與手腕內側」對準鏡頭（露出手腕），自動換算 2 寸標出內關穴' },
  HT7: { mode: 'hand', name: '神門', hint: '請將「手掌心與手腕橫紋」對準鏡頭，標出小指側豌豆骨旁神門穴' },
  SI3: { mode: 'hand', name: '後谿', hint: '請將手掌「小指外側邊緣」對準鏡頭，標出第五掌骨頭後方後谿穴' },
  // 小兒推拿手部專屬穴位
  'PED-PI': { mode: 'hand', name: '小兒脾經', hint: '請將「大拇指掌面/橈側」對準鏡頭，標示推拿脾經路徑（旋推補脾、推向指尖清脾）' },
  'PED-BANMEN': { mode: 'hand', name: '小兒板門', hint: '請將「大拇指根部大魚際」對準鏡頭，鎖定肌肉正中央板門穴（健脾消食）' },
  'PED-SIHENGWEN': { mode: 'hand', name: '小兒四橫紋', hint: '請將「食、中、無名、小指掌面」對準鏡頭，標示四指第一指間關節橫紋（消疳積）' },
  'PED-XIAOTIANXIN': { mode: 'hand', name: '小兒小天心', hint: '請將「手掌根部」對準鏡頭，標示大小魚際交界凹陷處小天心（鎮驚安神清心火）' },
  'PED-TIANHESHI': { mode: 'hand', name: '小兒天河水', hint: '請將「手掌心與前臂內側」對準鏡頭，標出腕橫紋至肘橫紋推撫路徑（清熱退燒）' },

  // 😊 臉部穴位 (FaceLandmarker 478 點網格追蹤)
  'EX-HN3': { mode: 'face', name: '印堂', hint: '請將臉部對準前鏡頭，自動鎖定兩眉頭連線正中央「印堂穴」' },
  BL2: { mode: 'face', name: '攢竹', hint: '請將臉部對準前鏡頭，自動鎖定雙眉眉頭下方眶上切迹「攢竹穴」' },
  'EX-HN5': { mode: 'face', name: '太陽', hint: '請將臉部微側對準鏡頭，自動鎖定眉梢與眼尾後方凹窩「太陽穴」' },
  ST2: { mode: 'face', name: '四白', hint: '請將臉部對準前鏡頭，自動鎖定雙眼瞳孔正下方眶下孔凹窩「四白穴」（護眼明目必按）' },
  LI20: { mode: 'face', name: '迎香', hint: '請將臉部對準鏡頭，自動鎖定左右鼻翼外緣法令紋溝「迎香穴」' },
  TE17: { mode: 'face', name: '翳風', hint: '請將臉部微側露出耳垂，鎖定耳垂正後方凹窩「翳風穴」' },
  GV20: { mode: 'face', name: '百會', hint: '請將臉部正對鏡頭，沿鼻樑眉心中線向上標示頭頂正中央「百會穴」方位' },

  // 🦵 下肢與足踝穴位 (PoseLandmarker 33 點骨度折量追蹤)
  ST36: { mode: 'leg', name: '足三里', hint: '請坐姿將「小腿前外側（露出膝蓋與腳踝）」對準鏡頭，自動換算 16 寸骨度標出外膝眼下 3 寸足三里穴' },
  GB39: { mode: 'leg', name: '懸鐘', hint: '請將「小腿外側（露出外腳踝）」對準鏡頭，標出外踝尖直上 3 寸懸鐘穴（骨髓會・助長高）' },
  SP6: { mode: 'leg', name: '三陰交', hint: '請將「小腿內側（露出內腳踝）」對準鏡頭，標出內踝尖直上 3 寸脛骨後緣三陰交穴' },
  SP9: { mode: 'leg', name: '陰陵泉', hint: '請將「小腿內側膝關節下方」對準鏡頭，標出脛骨內側髁下方凹陷陰陵泉穴' },
  SP10: { mode: 'leg', name: '血海', hint: '請將「大腿內側（膝蓋上方）」對準鏡頭，標出髁上內側 2 寸血海穴' },
  ST40: { mode: 'leg', name: '豐隆', hint: '請將「小腿前外側」對準鏡頭，標出外踝尖直上 8 寸（條口外開一指）化痰要穴豐隆' },
  LR3: { mode: 'leg', name: '太衝', hint: '請將「腳背（大趾與二趾縫）」對準鏡頭，標出第一、二蹠骨結合部前方凹陷太衝穴' },
  KI3: { mode: 'leg', name: '太溪', hint: '請將「內腳踝後方」對準鏡頭，標出內踝尖與跟腱之間凹陷太溪穴' },
  BL60: { mode: 'leg', name: '崑崙', hint: '請將「外腳踝後方」對準鏡頭，標出外踝尖與跟腱之間凹陷崑崙穴' },

  // 🧘 背部/肩頸/上肢穴位 (PoseLandmarker 姿態追蹤)
  'PED-NIEJI': { mode: 'back', name: '小兒捏脊', hint: '【雙人輔助】請用後鏡頭對準孩子背部（露出雙肩與腰臀），標示長強至大椎捏脊推進路徑' },
  GV14: { mode: 'back', name: '大椎', hint: '【雙人輔助】請鏡頭對準頸背交界處，鎖定第七頸椎棘突下凹窩「大椎穴」' },
  GB20: { mode: 'back', name: '風池', hint: '【雙人/鏡子】請鏡頭對準後腦枕骨下方兩側凹窩，鎖定風池穴（解頭痛降腦壓）' },
  GB21: { mode: 'back', name: '肩井', hint: '請鏡頭對準肩部，鎖定大椎穴與肩峰連線中點「肩井穴」' },
  BL23: { mode: 'back', name: '腎俞', hint: '【雙人輔助】請鏡頭對準腰背部（第二腰椎高度），標出脊柱兩側各旁開 1.5 寸雙側腎俞穴' },
  BL40: { mode: 'back', name: '委中', hint: '請將「膝蓋後方膕窩」對準鏡頭，標出膕橫紋正中委中穴（腰背委中求）' },
  LI11: { mode: 'back', name: '曲池', hint: '請屈肘將「手肘外側橫紋」對準鏡頭，標出手肘橫紋外側端曲池穴（清熱降壓）' },

  // 🫁 正面胸腹穴位 (PoseLandmarker 軀幹正中線追蹤)
  CV17: { mode: 'torso', name: '膻中', hint: '請將「正面胸部」對準前/後鏡頭，標出兩乳頭連線正中胸骨上膻中穴（寬胸理氣）' },
  CV12: { mode: 'torso', name: '中脘', hint: '請將「正面腹部」對準鏡頭，標出胸骨下端與肚臍連線中點「中脘穴」（健脾和胃）' },
  CV6: { mode: 'torso', name: '氣海關元', hint: '請將「下腹部」對準鏡頭，標出肚臍下方 1.5~3 寸氣海與關元要穴（培元補氣）' },
  ST25: { mode: 'torso', name: '天樞', hint: '請將「肚臍周圍」對準鏡頭，標出肚臍左右旁開 2 寸天樞穴（腸道雙向調理）' },

  // 🦶 腳底全息反射區 (Guided AR 足底引導全息投影)
  KI1: { mode: 'foot', name: '湧泉', hint: '請將「腳底板」對準螢幕上的足底引導輪廓框，前掌人字紋凹陷處即為湧泉穴' },
  'EX-LE-SHIMIAN': { mode: 'foot', name: '失眠穴', hint: '請將腳跟對準引導框底端，腳後跟正中央紅點即為失眠穴（百敲消疲勞）' },
  'EX-LE-LINEITING': { mode: 'foot', name: '裡內庭', hint: '請將腳掌對準引導框，第二、三趾縫腳底凹陷處即為裡內庭穴（瀉胃火）' },
  'REFLEX-BRAIN': { mode: 'foot', name: '大腦頭頸反射區', hint: '請將大腳趾對準引導框頂部，大拇趾肉球即為大腦頭頸反射區（消頭痛助眠）' },
  'REFLEX-EYE-TRAP': { mode: 'foot', name: '眼耳斜方肌區', hint: '請將二至五趾根部對準引導框橫帶，此為眼耳與肩頸斜方肌放鬆區' },
  'REFLEX-LIVER': { mode: 'foot', footSide: 'right', name: '肝膽反射區(右腳)', hint: '【右腳專屬】請將右腳底對準引導框，前掌外側即為肝膽反射區（排毒解宿醉）' },
  'REFLEX-HEART': { mode: 'foot', footSide: 'left', name: '心脾反射區(左腳)', hint: '【左腳專屬】請將左腳底對準引導框，前掌外側即為心臟與脾臟反射區（安神舒胸悶）' },
  'REFLEX-STOMACH': { mode: 'foot', name: '胃脾十二指腸區', hint: '請將腳底對準引導框，足弓內側前段凹陷處即為胃脾消化反射區' },
  'REFLEX-KIDNEY': { mode: 'foot', name: '腎臟膀胱排毒鏈', hint: '請將腳底對準引導框，足心凹陷至內踝前即為腎輸尿管膀胱排毒鏈' },
  'REFLEX-PELVIS': { mode: 'foot', name: '生殖骨盆反射區', hint: '請將腳跟對準引導框底部，足後跟圓形全區即為生殖腺與骨盆腔區' },

  // 👂 耳穴全息反射區 (Guided AR 耳廓引導全息投影)
  'EAR-SHENMEN': { mode: 'ear', name: '耳神門', hint: '請將耳朵對準螢幕上的耳廓引導框，三角窩後上方即為鎮靜助眠第一穴「耳神門」' },
  'EAR-APEX': { mode: 'ear', name: '耳尖', hint: '請將耳尖對準引導框頂部，耳輪最上折頂尖端即為清熱降火解目赤「耳尖穴」' },
  'EAR-ZERO': { mode: 'ear', name: '耳中(零點)', hint: '請將耳朵對準引導框，耳輪腳中心凹窩即為平衡自律神經總樞紐「耳中穴」' },
  'EAR-STOMACH': { mode: 'ear', name: '耳胃區', hint: '請將耳朵對準引導框，耳輪腳消失處周圍即為和胃止酸消噯氣「耳胃區」' },
  'EAR-LIVER': { mode: 'ear', name: '耳肝區', hint: '請將耳朵對準引導框，耳甲艇後下方即為疏肝理氣明目「耳肝區」' },
  'EAR-KIDNEY': { mode: 'ear', name: '耳腎區', hint: '請將耳朵對準引導框，耳甲艇上部對耳輪下腳下方即為補腎固腰「耳腎區」' },
  'EAR-ADRENAL': { mode: 'ear', name: '耳腎上腺', hint: '請將耳朵對準引導框，耳屏下部邊緣即為抗炎抗敏退燒「耳腎上腺(下屏尖)」' }
};

let visionModule = null;
let handLandmarker = null;
let faceLandmarker = null;
let poseLandmarker = null;

const arState = {
  isOpen: false,
  isFrozen: false,           // ❄️ 是否處於定格鎖定狀態（方便放下手機雙手按穴）
  cachedHandLandmarks: null, // 定格時保留的手部 21 點座標
  cachedFaceLandmarks: null, // 定格時保留的臉部 478 點座標
  cachedPoseLandmarks: null, // 定格時保留的身體 33 點座標
  countdownTimer: null,      // 3 秒倒數定格計時器
  mode: 'hand',              // 'hand' | 'face' | 'leg' | 'back' | 'torso' | 'foot' | 'ear'
  targetPointId: 'LI4',      // 當前主標示穴位
  showAllInMode: true,       // 同時顯示同部位其他穴位作為參照
  facingMode: 'environment', // 手/腿/背/腹/腳預設後鏡頭('environment')，臉部/耳部預設前鏡頭('user')
  footSide: 'right',         // 'left' | 'right' 腳底引導框左右腳切換
  earSide: 'right',          // 'left' | 'right' 耳廓引導框左右耳切換
  stream: null,
  rafId: null,
  lastVideoTime: -1,
  fps: 0,
  lastFrameTimestamp: 0
};

// 動態載入 MediaPipe Tasks Vision 並初始化 GPU 模型
async function ensureDetectorLoaded(mode, onStatusUpdate) {
  // 足底與耳穴 Guided AR 模式純靠前端即時全息投影，秒開零等待
  if (mode === 'foot') {
    onStatusUpdate('🟢 足底 Guided AR 全息投影已就緒，請將腳底對齊金色虛線框');
    return;
  }
  if (mode === 'ear') {
    onStatusUpdate('🟢 耳穴 Guided AR 全息投影已就緒，請將耳朵對齊引導輪廓');
    return;
  }

  if (!visionModule) {
    onStatusUpdate('正在載入端側 AI 視覺引擎 (WebAssembly)...');
    visionModule = await import(`${VISION_CDN}/vision_bundle.mjs`);
  }

  const { FilesetResolver, HandLandmarker, FaceLandmarker, PoseLandmarker } = visionModule;
  const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

  if (mode === 'hand' && !handLandmarker) {
    onStatusUpdate('正在啟動 iPhone GPU 手部 21 骨骼點模型...');
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: HAND_MODEL_URL,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  }

  if (mode === 'face' && !faceLandmarker) {
    onStatusUpdate('正在啟動 iPhone GPU 臉部 478 網格點模型...');
    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: FACE_MODEL_URL,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  }

  if ((mode === 'leg' || mode === 'back' || mode === 'torso') && !poseLandmarker) {
    onStatusUpdate('正在啟動 iPhone GPU 身體 33 點姿態模型...');
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: POSE_MODEL_URL,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  }
}

// 根據 21 個手部關節點 (Normalized 0~1) 計算手部四大穴位座標
function computeHandAcupoints(landmarks) {
  const w = landmarks[0];     // 手腕中心 (Wrist)
  const tCMC = landmarks[1];  // 拇指腕掌關節
  const tMCP = landmarks[2];  // 拇指掌指關節
  const iMCP = landmarks[5];  // 食指掌指關節 (第二掌骨頭)
  const mMCP = landmarks[9];  // 中指掌指關節
  const rMCP = landmarks[13]; // 無名指掌指關節
  const pMCP = landmarks[17]; // 小指掌指關節 (第五掌骨頭)

  // 1. 合谷 (LI4)：第二掌骨 (w -> iMCP) 的 1/2 中點，再往拇指側 (tMCP) 偏移 22%
  const mid2ndMeta = {
    x: (w.x + iMCP.x) * 0.5,
    y: (w.y + iMCP.y) * 0.5
  };
  const li4 = {
    id: 'LI4',
    name: '合谷',
    x: mid2ndMeta.x + (tMCP.x - mid2ndMeta.x) * 0.24,
    y: mid2ndMeta.y + (tMCP.y - mid2ndMeta.y) * 0.24,
    // 施力方向：朝向第二掌骨與小指側 (pMCP)
    arrowTo: {
      x: mid2ndMeta.x + (pMCP.x - tMCP.x) * 0.14,
      y: mid2ndMeta.y + (pMCP.y - tMCP.y) * 0.14
    },
    boneLine: [w, iMCP]
  };

  // 2. 後谿 (SI3)：第五掌骨小頭 (pMCP) 往手腕 (w) 退 20%，再往尺側外緣外推 15%
  const ulnarVec = { x: pMCP.x - rMCP.x, y: pMCP.y - rMCP.y };
  const si3 = {
    id: 'SI3',
    name: '後谿',
    x: pMCP.x + (w.x - pMCP.x) * 0.20 + ulnarVec.x * 0.32,
    y: pMCP.y + (w.y - pMCP.y) * 0.20 + ulnarVec.y * 0.32
  };

  // 3. 神門 (HT7)：手腕橫紋尺側端（小指與無名指縫往手腕延伸處）
  const wristUlnarVec = { x: pMCP.x - iMCP.x, y: pMCP.y - iMCP.y };
  const ht7 = {
    id: 'HT7',
    name: '神門',
    x: w.x + wristUlnarVec.x * 0.36,
    y: w.y + wristUlnarVec.y * 0.36
  };

  // 4. 內關 (PC6)：從手腕中心 (w) 順著掌心反方向（往手肘前臂方向）延伸約 0.42 倍掌長（相當於三橫指 2 寸）
  const palmVec = { x: mMCP.x - w.x, y: mMCP.y - w.y };
  const pc6 = {
    id: 'PC6',
    name: '內關 (腕下三指)',
    x: w.x - palmVec.x * 0.42,
    y: w.y - palmVec.y * 0.42,
    wristOrigin: w
  };

  // 5. 魚際 (LU10)：第一掌骨 (tCMC -> tMCP) 的 1/2 中點
  const lu10 = {
    id: 'LU10',
    name: '魚際',
    x: (tCMC.x + tMCP.x) * 0.5,
    y: (tCMC.y + tMCP.y) * 0.5
  };

  // 6. 勞宮 (PC8)：掌心正中央，第 2、3 掌骨間（手腕 w 往中指根 mMCP 58% 處略偏食指側）
  const pc8 = {
    id: 'PC8',
    name: '勞宮',
    x: w.x + (mMCP.x - w.x) * 0.56 + (iMCP.x - mMCP.x) * 0.18,
    y: w.y + (mMCP.y - w.y) * 0.56 + (iMCP.y - mMCP.y) * 0.18
  };

  // 7. 列缺 (LU7)：手腕橈側（大拇指側）腕橫紋上方約 1.5 寸
  const radialVec = { x: tCMC.x - w.x, y: tCMC.y - w.y };
  const lu7 = {
    id: 'LU7',
    name: '列缺',
    x: w.x + radialVec.x * 0.65 - palmVec.x * 0.28,
    y: w.y + radialVec.y * 0.65 - palmVec.y * 0.28
  };

  // 8. 小兒脾經 (PED-PI)：大拇指末節螺紋面與橈側緣（指尖 4 至指間關節 3）
  const tIP = landmarks[3];
  const tTIP = landmarks[4];
  const pedPi = {
    id: 'PED-PI',
    name: '小兒脾經 (拇指面)',
    x: (tIP.x + tTIP.x) * 0.5,
    y: (tIP.y + tTIP.y) * 0.5,
    arrowTo: { x: tTIP.x, y: tTIP.y },
    hint: '指尖往指根推為補，指根往指尖推為清'
  };

  // 9. 小兒板門 (PED-BANMEN)：手掌大魚際肌肉隆起正中央（w, tCMC, tMCP 重心）
  const pedBanmen = {
    id: 'PED-BANMEN',
    name: '小兒板門 (大魚際)',
    x: (w.x + tCMC.x + tMCP.x) / 3,
    y: (w.y + tCMC.y + tMCP.y) / 3
  };

  // 10. 小兒小天心 (PED-XIAOTIANXIN)：手腕橫紋正中直上、大小魚際交界凹陷處
  const pedXiaotianxin = {
    id: 'PED-XIAOTIANXIN',
    name: '小兒小天心 (掌根凹窩)',
    x: w.x + (mMCP.x - w.x) * 0.16,
    y: w.y + (mMCP.y - w.y) * 0.16
  };

  // 11. 小兒四橫紋 (PED-SIHENGWEN)：食、中、無名、小指四指掌面近端指間關節（PIP）橫紋
  const iPIP = landmarks[6];
  const mPIP = landmarks[10];
  const rPIP = landmarks[14];
  const pPIP = landmarks[18];
  const pedSihengwen = {
    id: 'PED-SIHENGWEN',
    name: '小兒四橫紋',
    x: (iPIP.x + mPIP.x + rPIP.x + pPIP.x) * 0.25,
    y: (iPIP.y + mPIP.y + rPIP.y + pPIP.y) * 0.25,
    multiPoints: [iPIP, mPIP, rPIP, pPIP]
  };

  // 12. 小兒天河水 (PED-TIANHESHI)：腕橫紋中點沿前臂正中向肘橫紋推撫之經路
  const pedTianheshi = {
    id: 'PED-TIANHESHI',
    name: '小兒天河水 (腕向肘)',
    x: w.x - palmVec.x * 0.55,
    y: w.y - palmVec.y * 0.55,
    strokeLine: {
      from: { x: w.x, y: w.y },
      to: { x: w.x - palmVec.x * 0.95, y: w.y - palmVec.y * 0.95 }
    }
  };

  return {
    LI4: li4,
    LU10: lu10,
    PC8: pc8,
    LU7: lu7,
    SI3: si3,
    HT7: ht7,
    PC6: pc6,
    'PED-PI': pedPi,
    'PED-BANMEN': pedBanmen,
    'PED-XIAOTIANXIN': pedXiaotianxin,
    'PED-SIHENGWEN': pedSihengwen,
    'PED-TIANHESHI': pedTianheshi
  };
}

// 根據 478 個臉部特徵點計算臉部穴位座標
function computeFaceAcupoints(landmarks) {
  // 印堂 (EX-HN3)：兩眉頭連線正中央 (#9 或 #55 與 #285 中點)
  const yintang = {
    x: (landmarks[55].x + landmarks[285].x) * 0.5,
    y: (landmarks[55].y + landmarks[285].y) * 0.5
  };

  // 攢竹 (BL2)：左右眉頭內側凹陷 (#55, #285)
  const bl2Left = landmarks[55];
  const bl2Right = landmarks[285];

  // 太陽 (EX-HN5)：眉梢 (#46/#276) 與外眼角 (#33/#263) 中點往顳部 (#127/#356) 外推 45%
  const leftMid = {
    x: (landmarks[46].x + landmarks[33].x) * 0.5,
    y: (landmarks[46].y + landmarks[33].y) * 0.5
  };
  const rightMid = {
    x: (landmarks[276].x + landmarks[263].x) * 0.5,
    y: (landmarks[276].y + landmarks[263].y) * 0.5
  };
  const taiyangLeft = {
    x: leftMid.x + (landmarks[127].x - leftMid.x) * 0.45,
    y: leftMid.y + (landmarks[127].y - leftMid.y) * 0.45
  };
  const taiyangRight = {
    x: rightMid.x + (landmarks[356].x - rightMid.x) * 0.45,
    y: rightMid.y + (landmarks[356].y - rightMid.y) * 0.45
  };

  // 四白 (ST2)：雙眼瞳孔 (#468, #473) 直下，眶下緣下方凹窩 (#111, #340 眶下孔)
  const pupilLeftY = landmarks[468] ? landmarks[468].y : landmarks[159].y;
  const pupilRightY = landmarks[473] ? landmarks[473].y : landmarks[386].y;
  const st2Left = {
    x: landmarks[111].x,
    y: landmarks[111].y + (landmarks[111].y - pupilLeftY) * 0.38
  };
  const st2Right = {
    x: landmarks[340].x,
    y: landmarks[340].y + (landmarks[340].y - pupilRightY) * 0.38
  };

  // 迎香 (LI20)：左右鼻翼外緣中點與法令紋交界 (#98, #327 略向外側 #205, #425 偏移)
  const li20Left = {
    x: landmarks[98].x + (landmarks[205].x - landmarks[98].x) * 0.25,
    y: landmarks[98].y
  };
  const li20Right = {
    x: landmarks[327].x + (landmarks[425].x - landmarks[327].x) * 0.25,
    y: landmarks[327].y
  };

  // 翳風 (TE17)：左右耳垂下方後方凹陷 (#177, #401 向外下偏移)
  const te17Left = {
    x: landmarks[177].x + (landmarks[177].x - landmarks[2].x) * 0.12,
    y: landmarks[177].y
  };
  const te17Right = {
    x: landmarks[401].x + (landmarks[401].x - landmarks[2].x) * 0.12,
    y: landmarks[401].y
  };

  // 百會 (GV20)：順著鼻根 (#168) -> 前額頂 (#10) 中線向上延伸 35% 至頭頂正中央
  const gv20Top = {
    x: landmarks[10].x + (landmarks[10].x - landmarks[168].x) * 0.42,
    y: landmarks[10].y + (landmarks[10].y - landmarks[168].y) * 0.42
  };

  return {
    'EX-HN3': { id: 'EX-HN3', name: '印堂', points: [yintang] },
    BL2: { id: 'BL2', name: '攢竹', points: [bl2Left, bl2Right] },
    'EX-HN5': { id: 'EX-HN5', name: '太陽', points: [taiyangLeft, taiyangRight] },
    ST2: { id: 'ST2', name: '四白', points: [st2Left, st2Right] },
    LI20: { id: 'LI20', name: '迎香', points: [li20Left, li20Right] },
    TE17: { id: 'TE17', name: '翳風(耳垂後)', points: [te17Left, te17Right] },
    GV20: { id: 'GV20', name: '百會(頭頂中線)', points: [gv20Top], midline: [landmarks[168], gv20Top] }
  };
}

// 根據 33 個身體姿態骨骼點計算小腿與足踝穴位（依中醫「外膝眼至外踝 16 寸」骨度分寸）
function computeLegAcupoints(poseLandmarks) {
  // 評估左腿 vs 右腿可見度（25: 左膝, 27: 左踝；26: 右膝, 28: 右踝）
  const lKnee = poseLandmarks[25];
  const lAnkle = poseLandmarks[27];
  const rKnee = poseLandmarks[26];
  const rAnkle = poseLandmarks[28];

  const lScore = (lKnee?.visibility ?? 0.5) + (lAnkle?.visibility ?? 0.5);
  const rScore = (rKnee?.visibility ?? 0.5) + (rAnkle?.visibility ?? 0.5);

  const isLeft = lScore >= rScore;
  const knee = isLeft ? lKnee : rKnee;
  const ankle = isLeft ? lAnkle : rAnkle;
  const heel = isLeft ? poseLandmarks[29] : poseLandmarks[30];
  const toe = isLeft ? poseLandmarks[31] : poseLandmarks[32];

  if (!knee || !ankle) return {};

  const legVec = { x: ankle.x - knee.x, y: ankle.y - knee.y };
  const legLen = Math.hypot(legVec.x, legVec.y);
  if (legLen < 0.04) return {};

  // 垂直於小腿的法線向量（指向人體外側）
  const sideSign = isLeft ? 1 : -1;
  const normVec = {
    x: (-legVec.y / legLen) * sideSign,
    y: (legVec.x / legLen) * sideSign
  };

  // 1. 足三里 (ST36)：外膝眼下 3 寸 (3/16 = 0.1875)，脛骨前緣外一橫指
  const st36 = {
    id: 'ST36',
    name: '足三里 (膝下3寸)',
    x: knee.x + legVec.x * 0.1875 + normVec.x * 0.065,
    y: knee.y + legVec.y * 0.1875 + normVec.y * 0.065,
    rulerLine: [knee, ankle]
  };

  // 2. 懸鐘 (GB39)：外踝尖直上 3 寸 (3/16 = 0.1875)，腓骨後緣
  const gb39 = {
    id: 'GB39',
    name: '懸鐘 (踝上3寸)',
    x: ankle.x - legVec.x * 0.1875 + normVec.x * 0.035,
    y: ankle.y - legVec.y * 0.1875 + normVec.y * 0.035,
    rulerLine: [knee, ankle]
  };

  // 3. 三陰交 (SP6)：內踝尖直上 3 寸 (3/16 = 0.1875)，脛骨後緣（指向內側）
  const sp6 = {
    id: 'SP6',
    name: '三陰交 (內踝上3寸)',
    x: ankle.x - legVec.x * 0.1875 - normVec.x * 0.055,
    y: ankle.y - legVec.y * 0.1875 - normVec.y * 0.055,
    rulerLine: [knee, ankle]
  };

  // 4. 陰陵泉 (SP9)：脛骨內側髁下方凹陷（膝下約 2 寸內側）
  const sp9 = {
    id: 'SP9',
    name: '陰陵泉 (膝內凹窩)',
    x: knee.x + legVec.x * 0.125 - normVec.x * 0.08,
    y: knee.y + legVec.y * 0.125 - normVec.y * 0.08
  };

  // 5. 太衝 (LR3)：腳背第 1、2 趾縫後方凹陷
  const footVec = toe ? { x: toe.x - ankle.x, y: toe.y - ankle.y } : normVec;
  const lr3 = {
    id: 'LR3',
    name: '太衝 (腳背)',
    x: ankle.x + footVec.x * 0.38,
    y: ankle.y + footVec.y * 0.38
  };

  // 6. 太溪 (KI3)：內踝與跟腱中點凹陷
  const heelVec = heel ? { x: heel.x - ankle.x, y: heel.y - ankle.y } : normVec;
  const ki3 = {
    id: 'KI3',
    name: '太溪 (內踝後凹)',
    x: ankle.x + heelVec.x * 0.45,
    y: ankle.y + heelVec.y * 0.45
  };

  // 7. 血海 (SP10)：屈膝時髁上內側 2 寸
  const sp10 = {
    id: 'SP10',
    name: '血海 (膝上2寸內側)',
    x: knee.x - legVec.x * 0.125 - normVec.x * 0.08,
    y: knee.y - legVec.y * 0.125 - normVec.y * 0.08
  };

  // 8. 豐隆 (ST40)：外踝尖直上 8 寸（條口外開一指，小腿長度 50% 處）
  const st40 = {
    id: 'ST40',
    name: '豐隆 (小腿中點化痰)',
    x: ankle.x - legVec.x * 0.50 + normVec.x * 0.045,
    y: ankle.y - legVec.y * 0.50 + normVec.y * 0.045
  };

  // 9. 崑崙 (BL60)：外踝尖與跟腱之間凹陷處
  const bl60 = {
    id: 'BL60',
    name: '崑崙 (外踝後凹)',
    x: ankle.x + (heel ? (heel.x - ankle.x) * 0.45 : normVec.x * 0.05),
    y: ankle.y + (heel ? (heel.y - ankle.y) * 0.45 : normVec.y * 0.05)
  };

  return { ST36: st36, GB39: gb39, SP6: sp6, SP9: sp9, SP10: sp10, ST40: st40, LR3: lr3, KI3: ki3, BL60: bl60 };
}

// 根據 33 個身體姿態骨骼點計算背部、肩頸與上肢穴位（雙人互照/鏡子模式）
function computeBackAcupoints(poseLandmarks) {
  const lShoulder = poseLandmarks[11];
  const rShoulder = poseLandmarks[12];
  const lHip = poseLandmarks[23];
  const rHip = poseLandmarks[24];

  if (!lShoulder || !rShoulder || !lHip || !rHip) return {};

  const shoulderMid = {
    x: (lShoulder.x + rShoulder.x) * 0.5,
    y: (lShoulder.y + rShoulder.y) * 0.5
  };
  const hipMid = {
    x: (lHip.x + rHip.x) * 0.5,
    y: (lHip.y + rHip.y) * 0.5
  };

  const spineVec = { x: shoulderMid.x - hipMid.x, y: shoulderMid.y - hipMid.y };
  const spineLen = Math.hypot(spineVec.x, spineVec.y);
  if (spineLen < 0.05) return {};

  const spineNorm = {
    x: -spineVec.y / spineLen,
    y: spineVec.x / spineLen
  };

  // 1. 大椎穴 (GV14)：第七頸椎棘突下（雙肩中點向上微偏約 6%）
  const gv14 = {
    id: 'GV14',
    name: '大椎穴',
    x: shoulderMid.x + (spineVec.x / spineLen) * 0.05,
    y: shoulderMid.y + (spineVec.y / spineLen) * 0.05
  };

  // 2. 腎俞穴 (BL23)：第二腰椎高度（雙髖往上約 36% 脊柱長度），左右兩側各旁開 1.5 寸
  const lumbar2 = {
    x: hipMid.x + spineVec.x * 0.36,
    y: hipMid.y + spineVec.y * 0.36
  };
  const bl23Left = {
    x: lumbar2.x + spineNorm.x * spineLen * 0.14,
    y: lumbar2.y + spineNorm.y * spineLen * 0.14
  };
  const bl23Right = {
    x: lumbar2.x - spineNorm.x * spineLen * 0.14,
    y: lumbar2.y - spineNorm.y * spineLen * 0.14
  };
  const bl23 = {
    id: 'BL23',
    name: '腎俞 (雙側)',
    points: [bl23Left, bl23Right]
  };

  // 3. 小兒捏脊 (PED-NIEJI)：由長強（雙髖中點下 5%）沿脊柱兩側各 0.5 寸向上提捏至大椎
  const changqiang = {
    x: hipMid.x - (spineVec.x / spineLen) * 0.04,
    y: hipMid.y - (spineVec.y / spineLen) * 0.04
  };
  const nieji = {
    id: 'PED-NIEJI',
    name: '小兒捏脊 (由下往上提捏)',
    from: changqiang,
    to: shoulderMid,
    spineNorm,
    spineLen
  };

  // 4. 委中穴 (BL40)：膝後膕窩正中
  const lKnee = poseLandmarks[25];
  const rKnee = poseLandmarks[26];
  const bl40Points = [];
  if (lKnee && lKnee.visibility > 0.4) bl40Points.push(lKnee);
  if (rKnee && rKnee.visibility > 0.4) bl40Points.push(rKnee);
  const bl40 = {
    id: 'BL40',
    name: '委中 (膝後膕窩)',
    points: bl40Points.length > 0 ? bl40Points : [hipMid]
  };

  // 5. 風池穴 (GB20)：枕骨下兩側凹窩（大椎向上延伸兩側）
  const gb20Left = {
    x: gv14.x + spineNorm.x * spineLen * 0.12 + (spineVec.x / spineLen) * 0.06,
    y: gv14.y + spineNorm.y * spineLen * 0.12 + (spineVec.y / spineLen) * 0.06
  };
  const gb20Right = {
    x: gv14.x - spineNorm.x * spineLen * 0.12 + (spineVec.x / spineLen) * 0.06,
    y: gv14.y - spineNorm.y * spineLen * 0.12 + (spineVec.y / spineLen) * 0.06
  };
  const gb20 = {
    id: 'GB20',
    name: '風池 (雙側)',
    points: [gb20Left, gb20Right]
  };

  // 6. 肩井穴 (GB21)：大椎與肩峰連線中點
  const gb21Left = {
    x: (gv14.x + lShoulder.x) * 0.5,
    y: (gv14.y + lShoulder.y) * 0.5
  };
  const gb21Right = {
    x: (gv14.x + rShoulder.x) * 0.5,
    y: (gv14.y + rShoulder.y) * 0.5
  };
  const gb21 = {
    id: 'GB21',
    name: '肩井 (雙側)',
    points: [gb21Left, gb21Right]
  };

  // 7. 曲池穴 (LI11)：屈肘時肘橫紋外側端
  const lElbow = poseLandmarks[13];
  const rElbow = poseLandmarks[14];
  const li11Points = [];
  if (lElbow && (lElbow.visibility ?? 1) > 0.3) li11Points.push(lElbow);
  if (rElbow && (rElbow.visibility ?? 1) > 0.3) li11Points.push(rElbow);
  const li11 = {
    id: 'LI11',
    name: '曲池 (手肘外側)',
    points: li11Points.length > 0 ? li11Points : [shoulderMid]
  };

  return { 'PED-NIEJI': nieji, GV14: gv14, GB20: gb20, GB21: gb21, BL23: bl23, BL40: bl40, LI11: li11 };
}

// 🫁 根據 33 個身體姿態骨骼點計算正面胸腹部穴位
function computeTorsoAcupoints(poseLandmarks) {
  const lShoulder = poseLandmarks[11];
  const rShoulder = poseLandmarks[12];
  const lHip = poseLandmarks[23];
  const rHip = poseLandmarks[24];

  if (!lShoulder || !rShoulder || !lHip || !rHip) return {};

  const shoulderMid = {
    x: (lShoulder.x + rShoulder.x) * 0.5,
    y: (lShoulder.y + rShoulder.y) * 0.5
  };
  const hipMid = {
    x: (lHip.x + rHip.x) * 0.5,
    y: (lHip.y + rHip.y) * 0.5
  };

  const torsoVec = { x: hipMid.x - shoulderMid.x, y: hipMid.y - shoulderMid.y };
  const torsoLen = Math.hypot(torsoVec.x, torsoVec.y);
  if (torsoLen < 0.05) return {};

  const torsoNorm = {
    x: -torsoVec.y / torsoLen,
    y: torsoVec.x / torsoLen
  };

  // 1. 膻中 (CV17)：兩乳頭連線正中胸骨上（雙肩往下 30%）
  const cv17 = {
    id: 'CV17',
    name: '膻中 (胸骨正中)',
    x: shoulderMid.x + torsoVec.x * 0.30,
    y: shoulderMid.y + torsoVec.y * 0.30
  };

  // 2. 中脘 (CV12)：胸骨下端劍突與肚臍中點（雙肩往下 55%）
  const cv12 = {
    id: 'CV12',
    name: '中脘 (臍上四寸)',
    x: shoulderMid.x + torsoVec.x * 0.55,
    y: shoulderMid.y + torsoVec.y * 0.55
  };

  // 3. 天樞 (ST25)：肚臍高度（雙肩往下 70%）兩側各旁開 2 寸
  const navel = {
    x: shoulderMid.x + torsoVec.x * 0.70,
    y: shoulderMid.y + torsoVec.y * 0.70
  };
  const st25Left = {
    x: navel.x + torsoNorm.x * torsoLen * 0.14,
    y: navel.y + torsoNorm.y * torsoLen * 0.14
  };
  const st25Right = {
    x: navel.x - torsoNorm.x * torsoLen * 0.14,
    y: navel.y - torsoNorm.y * torsoLen * 0.14
  };
  const st25 = {
    id: 'ST25',
    name: '天樞 (臍旁雙側)',
    points: [st25Left, st25Right]
  };

  // 4. 氣海・關元 (CV6)：肚臍下 1.5~3 寸（雙肩往下 82%）
  const cv6 = {
    id: 'CV6',
    name: '氣海關元 (下腹丹田)',
    x: shoulderMid.x + torsoVec.x * 0.82,
    y: shoulderMid.y + torsoVec.y * 0.82
  };

  return { CV17: cv17, CV12: cv12, ST25: st25, CV6: cv6 };
}

// 🦶 繪製腳底 Guided AR 輪廓與反射區全息投影（純 Canvas 數學投影，60 FPS 流暢零延遲）
function drawGuidedFootOverlay(ctx, W, H, targetPointId, pulse, footSide = 'right') {
  ctx.save();

  // 決定足底框在畫布中央尺寸與位置
  const footH = Math.min(H * 0.78, 500);
  const footW = footH * 0.42;
  const cx = W * 0.5;
  const cy = H * 0.5;
  const top = cy - footH * 0.5;
  const bottom = cy + footH * 0.5;
  const isRight = footSide === 'right';

  // 局部坐標系：中心 (0, 0)，頂部 -halfH，底部 +halfH
  ctx.save();
  ctx.translate(cx, cy);
  if (!isRight) {
    ctx.scale(-1, 1); // 左腳則水平鏡像翻轉
  }

  const halfW = footW * 0.5;
  const halfH = footH * 0.5;

  // 1. 足底半透明科技感引導輪廓
  ctx.beginPath();
  ctx.moveTo(-halfW * 0.25, -halfH * 0.95);
  // 大腳趾圓球 (內側)
  ctx.bezierCurveTo(-halfW * 0.85, -halfH * 0.95, -halfW * 0.95, -halfH * 0.75, -halfW * 0.92, -halfH * 0.55);
  // 內側足弓收窄 (中段)
  ctx.bezierCurveTo(-halfW * 0.85, -halfH * 0.25, -halfW * 0.45, -halfH * 0.05, -halfW * 0.50, halfH * 0.35);
  // 足跟內側過渡到腳跟圓弧 (底段)
  ctx.bezierCurveTo(-halfW * 0.52, halfH * 0.65, -halfW * 0.65, halfH * 0.95, 0, halfH * 0.98);
  // 腳跟外側圓弧
  ctx.bezierCurveTo(halfW * 0.65, halfH * 0.95, halfW * 0.68, halfH * 0.65, halfW * 0.70, halfH * 0.35);
  // 外側緣直筒弧線
  ctx.bezierCurveTo(halfW * 0.72, 0, halfW * 0.82, -halfH * 0.45, halfW * 0.85, -halfH * 0.65);
  // 小趾外側弧
  ctx.bezierCurveTo(halfW * 0.85, -halfH * 0.85, halfW * 0.40, -halfH * 0.95, -halfW * 0.25, -halfH * 0.95);
  ctx.closePath();

  ctx.fillStyle = 'rgba(25, 45, 38, 0.45)';
  ctx.fill();
  ctx.strokeStyle = '#F4C476';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 2. 足底內部各反射區全息色彩圖
  // (A) 前掌外側：心臟脾臟(左腳) / 肝膽(右腳)
  const isLiverTarget = targetPointId === 'REFLEX-LIVER';
  const isHeartTarget = targetPointId === 'REFLEX-HEART';
  const isLiverOrHeart = isLiverTarget || isHeartTarget;
  ctx.beginPath();
  ctx.ellipse(halfW * 0.35, -halfH * 0.60, halfW * 0.38, halfH * 0.14, 0.1, 0, Math.PI * 2);
  ctx.fillStyle = isLiverOrHeart
    ? `rgba(235, 87, 87, ${0.48 + 0.2 * Math.sin(pulse)})`
    : 'rgba(235, 140, 87, 0.25)';
  ctx.fill();
  ctx.strokeStyle = isLiverOrHeart ? '#FFF' : 'rgba(235, 87, 87, 0.6)';
  ctx.lineWidth = isLiverOrHeart ? 2.5 : 1.5;
  ctx.stroke();

  // (B) 湧泉穴（人字紋中心 -halfH * 0.40）
  const isYongquan = targetPointId === 'KI1';
  ctx.beginPath();
  ctx.arc(0, -halfH * 0.40, (isYongquan ? 16 : 9) * pulse, 0, Math.PI * 2);
  ctx.fillStyle = isYongquan ? 'rgba(184, 61, 46, 0.88)' : 'rgba(196, 137, 59, 0.45)';
  ctx.fill();
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  // (C) 腎・輸尿管・膀胱排毒鏈
  const isKidneyTarget = targetPointId === 'REFLEX-KIDNEY';
  ctx.beginPath();
  ctx.moveTo(0, -halfH * 0.28);
  ctx.quadraticCurveTo(-halfW * 0.15, -halfH * 0.05, -halfW * 0.35, halfH * 0.25);
  ctx.strokeStyle = isKidneyTarget ? '#4FC3F7' : 'rgba(79, 195, 247, 0.4)';
  ctx.lineWidth = isKidneyTarget ? 6 : 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -halfH * 0.28, isKidneyTarget ? 12 : 7, 0, Math.PI * 2);
  ctx.fillStyle = isKidneyTarget ? '#0288D1' : 'rgba(2, 136, 209, 0.5)';
  ctx.fill();

  // (D) 胃・脾・十二指腸區 (內側中前段)
  const isStomachTarget = targetPointId === 'REFLEX-STOMACH';
  ctx.beginPath();
  ctx.ellipse(-halfW * 0.35, -halfH * 0.18, halfW * 0.22, halfH * 0.10, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = isStomachTarget ? 'rgba(255, 179, 0, 0.65)' : 'rgba(255, 179, 0, 0.22)';
  ctx.fill();

  // (E) 失眠穴 & 骨盆生殖腺（足跟）
  const isShimianTarget = targetPointId === 'EX-LE-SHIMIAN';
  const isPelvisTarget = targetPointId === 'REFLEX-PELVIS';
  ctx.beginPath();
  ctx.ellipse(0, halfH * 0.72, halfW * 0.42, halfH * 0.18, 0, 0, Math.PI * 2);
  ctx.fillStyle = isPelvisTarget
    ? `rgba(216, 67, 21, ${0.55 + 0.15 * Math.sin(pulse)})`
    : 'rgba(216, 67, 21, 0.2)';
  ctx.fill();
  ctx.strokeStyle = isPelvisTarget || isShimianTarget ? '#FF8A65' : 'rgba(255, 138, 101, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 失眠穴中心紅點
  ctx.beginPath();
  ctx.arc(0, halfH * 0.72, (isShimianTarget ? 12 : 6) * pulse, 0, Math.PI * 2);
  ctx.fillStyle = '#D84315';
  ctx.fill();
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 2;
  ctx.stroke();

  // (F) 大腦・頭頸反射區 (大拇趾)
  const isBrainTarget = targetPointId === 'REFLEX-BRAIN';
  ctx.beginPath();
  ctx.arc(-halfW * 0.55, -halfH * 0.78, halfW * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = isBrainTarget
    ? `rgba(123, 31, 162, ${0.65 + 0.2 * Math.sin(pulse)})`
    : 'rgba(123, 31, 162, 0.2)';
  ctx.fill();

  // (G) 裡內庭 (二三趾縫)
  const isLineitingTarget = targetPointId === 'EX-LE-LINEITING';
  ctx.beginPath();
  ctx.arc(-halfW * 0.10, -halfH * 0.78, (isLineitingTarget ? 10 : 5) * pulse, 0, Math.PI * 2);
  ctx.fillStyle = '#E91E63';
  ctx.fill();
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // (H) 眼耳・斜方肌反射區 (二至五趾下方橫帶)
  const isEyeTrapTarget = targetPointId === 'REFLEX-EYE-TRAP';
  ctx.beginPath();
  ctx.roundRect(0, -halfH * 0.76, halfW * 0.85, halfH * 0.10, 6);
  ctx.fillStyle = isEyeTrapTarget
    ? `rgba(0, 150, 136, ${0.6 + 0.2 * Math.sin(pulse)})`
    : 'rgba(0, 150, 136, 0.2)';
  ctx.fill();
  ctx.strokeStyle = isEyeTrapTarget ? '#FFF' : 'rgba(0, 150, 136, 0.5)';
  ctx.stroke();

  ctx.restore();

  // 3. 繪製中文標題與導引說明
  ctx.font = 'bold 15px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F4C476';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 6;
  ctx.fillText(
    `🦶 足底全息投影【${isRight ? '右腳 (外側主肝膽)' : '左腳 (外側主心脾)'}】`,
    cx,
    top - 18
  );
  ctx.font = '12px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillStyle = 'rgba(250, 247, 240, 0.95)';
  ctx.fillText(
    '將腳底放進金色虛線框中，點右上角「❄️ 定格」即可鎖定投影精準按穴！',
    cx,
    bottom + 22
  );
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 👂 繪製耳穴 Guided AR 全息投影輪廓（純 Canvas 數學投影，60 FPS 流暢）
function drawGuidedEarOverlay(ctx, W, H, targetPointId, pulse, earSide = 'right') {
  ctx.save();

  const earH = Math.min(H * 0.74, 460);
  const earW = earH * 0.62;
  const cx = W * 0.5;
  const cy = H * 0.5;
  const top = cy - earH * 0.5;
  const bottom = cy + earH * 0.5;
  const isRight = earSide === 'right';

  ctx.save();
  ctx.translate(cx, cy);
  if (!isRight) {
    ctx.scale(-1, 1); // 左耳水平鏡向翻轉
  }

  const halfW = earW * 0.5;
  const halfH = earH * 0.5;

  // 1. 耳廓外輪廓（Helix + Lobule）
  ctx.beginPath();
  ctx.moveTo(halfW * 0.20, halfH * 0.85); // 耳垂底端
  // 耳垂圓弧
  ctx.bezierCurveTo(halfW * 0.65, halfH * 0.85, halfW * 0.85, halfH * 0.60, halfW * 0.85, halfH * 0.35);
  // 耳輪外緣弧線向上
  ctx.bezierCurveTo(halfW * 0.90, 0, halfW * 0.85, -halfH * 0.60, halfW * 0.50, -halfH * 0.88);
  // 耳尖折頂
  ctx.bezierCurveTo(halfW * 0.20, -halfH * 0.98, -halfW * 0.20, -halfH * 0.98, -halfW * 0.50, -halfH * 0.80);
  // 耳輪前緣向下
  ctx.bezierCurveTo(-halfW * 0.75, -halfH * 0.65, -halfW * 0.85, -halfH * 0.35, -halfW * 0.55, -halfH * 0.15);
  // 耳屏與切迹
  ctx.bezierCurveTo(-halfW * 0.80, halfH * 0.05, -halfW * 0.70, halfH * 0.35, -halfW * 0.25, halfH * 0.60);
  ctx.bezierCurveTo(-halfW * 0.10, halfH * 0.75, 0, halfH * 0.85, halfW * 0.20, halfH * 0.85);
  ctx.closePath();

  ctx.fillStyle = 'rgba(25, 45, 38, 0.45)';
  ctx.fill();
  ctx.strokeStyle = '#F4C476';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // 2. 對耳輪與三角窩內部構造線
  ctx.beginPath();
  ctx.moveTo(halfW * 0.30, halfH * 0.35);
  ctx.bezierCurveTo(halfW * 0.40, -halfH * 0.15, halfW * 0.35, -halfH * 0.45, 0, -halfH * 0.65);
  ctx.strokeStyle = 'rgba(196, 137, 59, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 3. 各耳穴發光靶心
  const earPoints = [
    { id: 'EAR-APEX', name: '耳尖', x: 0, y: -halfH * 0.94 },
    { id: 'EAR-SHENMEN', name: '耳神門', x: -halfW * 0.22, y: -halfH * 0.68 },
    { id: 'EAR-ZERO', name: '耳中(零點)', x: -halfW * 0.05, y: -halfH * 0.15 },
    { id: 'EAR-STOMACH', name: '耳胃區', x: -halfW * 0.14, y: -halfH * 0.28 },
    { id: 'EAR-LIVER', name: '耳肝區', x: -halfW * 0.30, y: -halfH * 0.32 },
    { id: 'EAR-KIDNEY', name: '耳腎區', x: -halfW * 0.18, y: -halfH * 0.46 },
    { id: 'EAR-ADRENAL', name: '耳腎上腺', x: -halfW * 0.68, y: halfH * 0.12 }
  ];

  earPoints.forEach((ep) => {
    const isTarget = targetPointId === ep.id;
    ctx.beginPath();
    ctx.arc(ep.x, ep.y, (isTarget ? 14 : 7) * pulse, 0, Math.PI * 2);
    ctx.fillStyle = isTarget ? 'rgba(184, 61, 46, 0.88)' : 'rgba(196, 137, 59, 0.45)';
    ctx.fill();
    ctx.strokeStyle = isTarget ? '#FFF' : 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = isTarget ? 2.5 : 1.5;
    ctx.stroke();

    // 標籤文字
    if (isTarget) {
      ctx.save();
      if (!isRight) ctx.scale(-1, 1);
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#FFF';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 4;
      ctx.fillText(ep.name, ep.x * (isRight ? 1 : -1) + 16, ep.y + 4);
      ctx.restore();
    }
  });

  ctx.restore();

  // 4. 中文標題與說明
  ctx.font = 'bold 15px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F4C476';
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur = 6;
  ctx.fillText(
    `👂 耳穴全息引導【${isRight ? '右耳' : '左耳'}】`,
    cx,
    top - 18
  );
  ctx.font = '12px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillStyle = 'rgba(250, 247, 240, 0.95)';
  ctx.fillText(
    '將耳朵放進金色虛線框中，點右上角「❄️ 定格」即可對照鏡子精準貼按！',
    cx,
    bottom + 22
  );
  ctx.shadowBlur = 0;

  ctx.restore();
}

// 繪製發光穴位靶心與中文標籤
function drawAcupointMarker(ctx, x, y, label, isPrimary, pulseScale = 1) {
  ctx.save();

  // 外圈呼吸光暈
  ctx.beginPath();
  ctx.arc(x, y, (isPrimary ? 18 : 11) * pulseScale, 0, Math.PI * 2);
  ctx.fillStyle = isPrimary ? 'rgba(184, 61, 46, 0.35)' : 'rgba(196, 137, 59, 0.28)';
  ctx.fill();

  // 中心實心圓點
  ctx.beginPath();
  ctx.arc(x, y, isPrimary ? 8 : 5.5, 0, Math.PI * 2);
  ctx.fillStyle = isPrimary ? '#B83D2E' : '#C4893B';
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = '#FFF9F0';
  ctx.stroke();

  // 標籤文字（若鏡頭是前鏡頭自拍鏡像，文字需反轉回來才不會左右顛倒）
  const isMirrored = arState.facingMode === 'user';
  ctx.translate(x, y);
  if (isMirrored) {
    ctx.scale(-1, 1);
  }

  ctx.font = `${isPrimary ? 'bold 14px' : '600 12px'} "PingFang TC", "Microsoft JhengHei", sans-serif`;
  const textWidth = ctx.measureText(label).width;
  const boxX = 12;
  const boxY = -12;

  ctx.fillStyle = isPrimary ? 'rgba(184, 61, 46, 0.92)' : 'rgba(42, 72, 58, 0.85)';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY - 12, textWidth + 14, 22, 6);
  ctx.fill();

  ctx.fillStyle = '#FFF';
  ctx.fillText(label, boxX + 7, boxY + 4);

  ctx.restore();
}

// 啟動相機串流與即時推論迴圈
export async function openArModal(initialPointId = 'LI4') {
  const modal = document.getElementById('arModal');
  const video = document.getElementById('arVideo');
  const canvas = document.getElementById('arCanvas');
  const statusEl = document.getElementById('arStatusText');
  const hintEl = document.getElementById('arHintBanner');
  const footSideBtn = document.getElementById('footSideBtn');
  const earSideBtn = document.getElementById('earSideBtn');

  if (!modal || !video || !canvas) return;

  // 決定初始穴位與模式
  const pointConfig = AR_SUPPORTED_POINTS[initialPointId] || AR_SUPPORTED_POINTS.LI4;
  arState.targetPointId = initialPointId in AR_SUPPORTED_POINTS ? initialPointId : 'LI4';
  arState.mode = pointConfig.mode;
  if (pointConfig.footSide) {
    arState.footSide = pointConfig.footSide;
  }
  // 臉部與耳穴預設前鏡頭 ('user')，手/腿/背/腹/腳預設後鏡頭 ('environment')
  arState.facingMode = arState.mode === 'face' || arState.mode === 'ear' ? 'user' : 'environment';
  arState.isOpen = true;

  modal.classList.add('open');
  updateArPointButtons();
  hintEl.textContent = pointConfig.hint;

  if (footSideBtn) {
    footSideBtn.style.display = arState.mode === 'foot' ? 'inline-block' : 'none';
    footSideBtn.textContent = `🦶 腳底：${arState.footSide === 'right' ? '右腳 (換左腳)' : '左腳 (換右腳)'}`;
  }
  if (earSideBtn) {
    earSideBtn.style.display = arState.mode === 'ear' ? 'inline-block' : 'none';
    earSideBtn.textContent = `👂 耳朵：${arState.earSide === 'right' ? '右耳 (換左耳)' : '左耳 (換右耳)'}`;
  }

  // 檢查瀏覽器是否允許存取相機（iPhone 非 HTTPS 區網 IP 提示）
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    statusEl.innerHTML = `
      ⚠️ iPhone Safari 安全限制：區網連線開相機需使用 <b>HTTPS</b> 加密網址。<br/>
      請在 iPhone 改開：<a href="https://${location.hostname}:8443" style="color:#F4C476;text-decoration:underline;">https://${location.hostname}:8443</a>（點「進階 → 繼續前往網站」即可開啟相機！）
    `;
    return;
  }

  await startArSession();
}

async function startArSession() {
  const video = document.getElementById('arVideo');
  const canvas = document.getElementById('arCanvas');
  const statusEl = document.getElementById('arStatusText');

  arState.isFrozen = false;
  arState.cachedHandLandmarks = null;
  arState.cachedFaceLandmarks = null;
  arState.cachedPoseLandmarks = null;
  updateFreezeButtonsUI();
  stopCameraStream();

  try {
    await ensureDetectorLoaded(arState.mode, (msg) => {
      statusEl.textContent = msg;
    });

    statusEl.textContent = '正在開啟相機鏡頭...';
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: arState.facingMode },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
    } catch (_) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    arState.stream = stream;
    video.srcObject = stream;

    const isMirrored = arState.facingMode === 'user';
    video.style.transform = isMirrored ? 'scaleX(-1)' : 'none';
    canvas.style.transform = isMirrored ? 'scaleX(-1)' : 'none';

    await video.play();

    const modeLabels = {
      hand: '手部 21 骨骼點',
      face: '臉部 478 特徵點',
      leg: '小腿 16 寸骨度姿態',
      back: '背部雙人姿態追蹤',
      torso: '正面胸腹正中線追蹤',
      foot: '足底全息 Guided AR',
      ear: '耳穴全息 Guided AR'
    };
    statusEl.textContent = `🟢 AI 即時追蹤中（${modeLabels[arState.mode] || ''}）`;

    arState.lastVideoTime = -1;
    renderArLoop();
  } catch (err) {
    statusEl.textContent = `⚠️ 無法啟動相機：${err.message || '請確認已允許瀏覽器相機權限'}`;
  }
}

function updateFreezeButtonsUI() {
  const freezeBtn = document.getElementById('freezeArBtn');
  if (!freezeBtn) return;
  if (arState.isFrozen) {
    freezeBtn.textContent = '▶️ 恢復即時鏡頭';
    freezeBtn.classList.add('frozen');
  } else {
    freezeBtn.textContent = '❄️ 定格畫面';
    freezeBtn.classList.remove('frozen');
  }
}

function toggleFreezeFrame() {
  const video = document.getElementById('arVideo');
  const statusEl = document.getElementById('arStatusText');
  if (!video) return;

  if (arState.isFrozen) {
    arState.isFrozen = false;
    video.play().catch(() => {});
    statusEl.textContent = '🟢 已恢復即時鏡頭追蹤';
  } else {
    arState.isFrozen = true;
    video.pause();
    statusEl.textContent = '❄️ 畫面已定格鎖定！現在可將手機放桌上，對著螢幕紅點按穴（下方仍可切換穴位）';
  }
  updateFreezeButtonsUI();
}

function startCountdownFreeze() {
  if (arState.countdownTimer) {
    clearInterval(arState.countdownTimer);
    arState.countdownTimer = null;
  }
  const video = document.getElementById('arVideo');
  const countdownOverlay = document.getElementById('arCountdownOverlay');
  if (arState.isFrozen && video) {
    arState.isFrozen = false;
    video.play().catch(() => {});
    updateFreezeButtonsUI();
  }

  let count = 3;
  if (countdownOverlay) {
    countdownOverlay.style.display = 'grid';
    countdownOverlay.textContent = `${count}`;
  }

  arState.countdownTimer = setInterval(() => {
    count -= 1;
    if (count > 0) {
      if (countdownOverlay) countdownOverlay.textContent = `${count}`;
    } else {
      clearInterval(arState.countdownTimer);
      arState.countdownTimer = null;
      if (countdownOverlay) countdownOverlay.style.display = 'none';
      if (!arState.isFrozen) {
        toggleFreezeFrame();
      }
    }
  }, 1000);
}

function renderArLoop() {
  if (!arState.isOpen) return;

  const video = document.getElementById('arVideo');
  const canvas = document.getElementById('arCanvas');
  const statusEl = document.getElementById('arStatusText');

  if (video.readyState >= 2) {
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
    }

    const nowMs = performance.now();
    const shouldDetectNewFrame = !arState.isFrozen && video.currentTime !== arState.lastVideoTime;

    if (shouldDetectNewFrame) {
      arState.lastVideoTime = video.currentTime;
      if (arState.lastFrameTimestamp > 0) {
        const currentFps = Math.round(1000 / (nowMs - arState.lastFrameTimestamp));
        arState.fps = Math.round(arState.fps * 0.8 + currentFps * 0.2);
      }
      arState.lastFrameTimestamp = nowMs;

      if (arState.mode === 'hand' && handLandmarker) {
        const res = handLandmarker.detectForVideo(video, nowMs);
        arState.cachedHandLandmarks = res.landmarks || [];
      } else if (arState.mode === 'face' && faceLandmarker) {
        const res = faceLandmarker.detectForVideo(video, nowMs);
        arState.cachedFaceLandmarks = res.faceLandmarks || [];
      } else if ((arState.mode === 'leg' || arState.mode === 'back' || arState.mode === 'torso') && poseLandmarker) {
        const res = poseLandmarker.detectForVideo(video, nowMs);
        arState.cachedPoseLandmarks = res.landmarks?.[0] || null;
      }
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pulse = 1 + 0.22 * Math.sin(nowMs / 180);
    const W = canvas.width;
    const H = canvas.height;

    // ✋ 1. 手部模式 (HandLandmarker 21 點)
    if (arState.mode === 'hand') {
      const handList = arState.cachedHandLandmarks || [];
      if (handList.length > 0) {
        if (!arState.isFrozen) {
          statusEl.textContent = `🟢 已鎖定手部骨骼 (${arState.fps} FPS)・點「❄️ 定格畫面」即可放下手機按穴`;
        }
        for (const handLms of handList) {
          const boneChains = [
            [0, 1, 2, 3, 4],
            [0, 5, 6, 7, 8],
            [0, 9, 10, 11, 12],
            [0, 13, 14, 15, 16],
            [0, 17, 18, 19, 20],
            [5, 9, 13, 17]
          ];
          ctx.strokeStyle = 'rgba(196, 137, 59, 0.48)';
          ctx.lineWidth = 2;
          for (const chain of boneChains) {
            ctx.beginPath();
            chain.forEach((idx, i) => {
              const pt = handLms[idx];
              if (i === 0) ctx.moveTo(pt.x * W, pt.y * H);
              else ctx.lineTo(pt.x * W, pt.y * H);
            });
            ctx.stroke();
          }

          const pts = computeHandAcupoints(handLms);
          Object.values(pts).forEach((p) => {
            const isPrimary = p.id === arState.targetPointId;
            if (!isPrimary && !arState.showAllInMode) return;

            if (p.id === 'LI4' && isPrimary && p.boneLine) {
              ctx.save();
              ctx.strokeStyle = '#2A483A';
              ctx.lineWidth = 4;
              ctx.setLineDash([5, 3]);
              ctx.beginPath();
              ctx.moveTo(p.boneLine[0].x * W, p.boneLine[0].y * H);
              ctx.lineTo(p.boneLine[1].x * W, p.boneLine[1].y * H);
              ctx.stroke();
              ctx.restore();
            }

            if (p.id === 'PC6' && isPrimary && p.wristOrigin) {
              ctx.save();
              ctx.strokeStyle = '#2A483A';
              ctx.lineWidth = 3;
              ctx.setLineDash([4, 3]);
              ctx.beginPath();
              ctx.moveTo(p.wristOrigin.x * W, p.wristOrigin.y * H);
              ctx.lineTo(p.x * W, p.y * H);
              ctx.stroke();
              ctx.restore();
            }

            if (p.id === 'PED-TIANHESHI' && isPrimary && p.strokeLine) {
              ctx.save();
              ctx.strokeStyle = '#2E7D32';
              ctx.lineWidth = 4;
              ctx.setLineDash([6, 4]);
              ctx.beginPath();
              ctx.moveTo(p.strokeLine.from.x * W, p.strokeLine.from.y * H);
              ctx.lineTo(p.strokeLine.to.x * W, p.strokeLine.to.y * H);
              ctx.stroke();
              ctx.fillStyle = '#2E7D32';
              ctx.beginPath();
              ctx.arc(p.strokeLine.to.x * W, p.strokeLine.to.y * H, 7, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }

            if (p.id === 'PED-SIHENGWEN' && isPrimary && p.multiPoints) {
              ctx.save();
              ctx.strokeStyle = '#B83D2E';
              ctx.lineWidth = 3.5;
              ctx.beginPath();
              p.multiPoints.forEach((pt, idx) => {
                if (idx === 0) ctx.moveTo(pt.x * W, pt.y * H);
                else ctx.lineTo(pt.x * W, pt.y * H);
              });
              ctx.stroke();
              p.multiPoints.forEach((pt) => {
                ctx.beginPath();
                ctx.arc(pt.x * W, pt.y * H, 5 * pulse, 0, Math.PI * 2);
                ctx.fillStyle = '#FFD54F';
                ctx.fill();
                ctx.strokeStyle = '#B83D2E';
                ctx.lineWidth = 2;
                ctx.stroke();
              });
              ctx.restore();
            }

            drawAcupointMarker(ctx, p.x * W, p.y * H, p.name, isPrimary, pulse);
          });
        }
      } else if (!arState.isFrozen) {
        statusEl.textContent = '👋 請將手掌或手背放進畫面中（保持光線充足）...';
      }
    }
    // 😊 2. 臉部模式 (FaceLandmarker 478 點)
    else if (arState.mode === 'face') {
      const faceList = arState.cachedFaceLandmarks || [];
      if (faceList.length > 0) {
        if (!arState.isFrozen) {
          statusEl.textContent = `🟢 已鎖定臉部骨度 (${arState.fps} FPS)・點「❄️ 定格畫面」即可固定紅點`;
        }
        for (const faceLms of faceList) {
          const pts = computeFaceAcupoints(faceLms);
          Object.values(pts).forEach((group) => {
            const isPrimary = group.id === arState.targetPointId;
            if (!isPrimary && !arState.showAllInMode) return;

            if (group.midline && isPrimary) {
              ctx.save();
              ctx.strokeStyle = 'rgba(196, 137, 59, 0.7)';
              ctx.lineWidth = 2;
              ctx.setLineDash([4, 3]);
              ctx.beginPath();
              ctx.moveTo(group.midline[0].x * W, group.midline[0].y * H);
              ctx.lineTo(group.midline[1].x * W, group.midline[1].y * H);
              ctx.stroke();
              ctx.restore();
            }

            group.points.forEach((pt, idx) => {
              const label = idx === 0 ? group.name : '';
              if (label) {
                drawAcupointMarker(ctx, pt.x * W, pt.y * H, label, isPrimary, pulse);
              } else {
                ctx.beginPath();
                ctx.arc(pt.x * W, pt.y * H, (isPrimary ? 16 : 10) * pulse, 0, Math.PI * 2);
                ctx.fillStyle = isPrimary ? 'rgba(184, 61, 46, 0.35)' : 'rgba(196, 137, 59, 0.25)';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(pt.x * W, pt.y * H, isPrimary ? 7.5 : 5, 0, Math.PI * 2);
                ctx.fillStyle = isPrimary ? '#B83D2E' : '#C4893B';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#FFF';
                ctx.stroke();
              }
            });
          });
        }
      } else if (!arState.isFrozen) {
        statusEl.textContent = '😊 請將臉部對準畫面中央...';
      }
    }
    // 🦵 3. 小腿/下肢模式 (PoseLandmarker 16 寸骨度折量)
    else if (arState.mode === 'leg') {
      const poseLms = arState.cachedPoseLandmarks;
      if (poseLms) {
        const legPts = computeLegAcupoints(poseLms);
        const pointValues = Object.values(legPts);

        if (pointValues.length > 0) {
          if (!arState.isFrozen) {
            statusEl.textContent = `🟢 已鎖定下肢骨度 (16寸分寸比例)・點「❄️ 定格畫面」即可放著手機按穴`;
          }

          // 繪製膝蓋至腳踝之 16 寸骨度刻度尺
          const refRuler = pointValues[0]?.rulerLine;
          if (refRuler) {
            const [k, a] = refRuler;
            ctx.save();
            ctx.strokeStyle = 'rgba(76, 175, 80, 0.65)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(k.x * W, k.y * H);
            ctx.lineTo(a.x * W, a.y * H);
            ctx.stroke();

            // 畫 16 寸分段刻度
            for (let step = 1; step <= 15; step++) {
              const ratio = step / 16;
              const mx = (k.x + (a.x - k.x) * ratio) * W;
              const my = (k.y + (a.y - k.y) * ratio) * H;
              ctx.beginPath();
              ctx.arc(mx, my, step === 3 || step === 13 ? 4 : 2, 0, Math.PI * 2);
              ctx.fillStyle = step === 3 || step === 13 ? '#FFD54F' : 'rgba(255,255,255,0.7)';
              ctx.fill();
            }
            ctx.restore();
          }

          pointValues.forEach((p) => {
            const isPrimary = p.id === arState.targetPointId;
            if (!isPrimary && !arState.showAllInMode) return;
            drawAcupointMarker(ctx, p.x * W, p.y * H, p.name, isPrimary, pulse);
          });
        } else if (!arState.isFrozen) {
          statusEl.textContent = '🦵 請露出膝蓋與腳踝，將下肢對準鏡頭畫面...';
        }
      } else if (!arState.isFrozen) {
        statusEl.textContent = '🦵 正在辨識下肢骨骼，請將鏡頭稍拉遠露出小腿...';
      }
    }
    // 🧘 4. 背部/肩頸模式 (PoseLandmarker 雙人互照/捏脊)
    else if (arState.mode === 'back') {
      const poseLms = arState.cachedPoseLandmarks;
      if (poseLms) {
        const backPts = computeBackAcupoints(poseLms);
        const nieji = backPts['PED-NIEJI'];

        if (nieji) {
          if (!arState.isFrozen) {
            statusEl.textContent = `🟢 已鎖定脊柱與背部骨骼・可請家人/伴侶對齊後點「❄️ 定格」按穴`;
          }

          // 繪製脊柱正中線
          ctx.save();
          ctx.strokeStyle = 'rgba(196, 137, 59, 0.55)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(nieji.from.x * W, nieji.from.y * H);
          ctx.lineTo(nieji.to.x * W, nieji.to.y * H);
          ctx.stroke();
          ctx.restore();

          // 若主選穴是「小兒捏脊」：繪製脊柱兩側 0.5 寸向上推拿發光波浪
          if (arState.targetPointId === 'PED-NIEJI') {
            const norm = nieji.spineNorm;
            const len = nieji.spineLen;
            const offset = len * 0.045; // 旁開約 0.5 寸

            [-offset, offset].forEach((off) => {
              ctx.save();
              ctx.strokeStyle = '#E91E63';
              ctx.lineWidth = 3.5;
              ctx.beginPath();
              ctx.moveTo((nieji.from.x + norm.x * off) * W, (nieji.from.y + norm.y * off) * H);
              ctx.lineTo((nieji.to.x + norm.x * off) * W, (nieji.to.y + norm.y * off) * H);
              ctx.stroke();

              const animRatio = ((nowMs % 2000) / 2000);
              const ax = (nieji.from.x + norm.x * off + (nieji.to.x - nieji.from.x) * animRatio) * W;
              const ay = (nieji.from.y + norm.y * off + (nieji.to.y - nieji.from.y) * animRatio) * H;
              ctx.beginPath();
              ctx.arc(ax, ay, 6 * pulse, 0, Math.PI * 2);
              ctx.fillStyle = '#FFEB3B';
              ctx.fill();
              ctx.restore();
            });

            drawAcupointMarker(
              ctx,
              ((nieji.from.x + nieji.to.x) * 0.5) * W,
              ((nieji.from.y + nieji.to.y) * 0.5) * H,
              '小兒捏脊 (由下往上提捏)',
              true,
              pulse
            );
          }

          // 標記背部與肩頸穴位
          const markPoint = (ptObj, label) => {
            if (!ptObj) return;
            const isPrim = arState.targetPointId === ptObj.id;
            if (!isPrim && !arState.showAllInMode) return;
            if (ptObj.points) {
              ptObj.points.forEach((p, i) => {
                drawAcupointMarker(ctx, p.x * W, p.y * H, i === 0 ? label : '', isPrim, pulse);
              });
            } else {
              drawAcupointMarker(ctx, ptObj.x * W, ptObj.y * H, label, isPrim, pulse);
            }
          };

          markPoint(backPts.GV14, '大椎');
          markPoint(backPts.GB20, '風池');
          markPoint(backPts.GB21, '肩井');
          markPoint(backPts.BL23, '腎俞');
          markPoint(backPts.BL40, '委中');
          markPoint(backPts.LI11, '曲池');
        } else if (!arState.isFrozen) {
          statusEl.textContent = '🧘 請將鏡頭對準後背或肩部（露出雙肩與腰臀）...';
        }
      } else if (!arState.isFrozen) {
        statusEl.textContent = '🧘 正在辨識姿態輪廓，請請同伴手持鏡頭對準後背...';
      }
    }
    // 🫁 5. 正面胸腹模式 (PoseLandmarker 正面正中線)
    else if (arState.mode === 'torso') {
      const poseLms = arState.cachedPoseLandmarks;
      if (poseLms) {
        const torsoPts = computeTorsoAcupoints(poseLms);
        const ptsList = Object.values(torsoPts);

        if (ptsList.length > 0) {
          if (!arState.isFrozen) {
            statusEl.textContent = `🟢 已鎖定正面胸腹正中線・點「❄️ 定格畫面」即可放桌上按穴`;
          }

          // 繪製胸腹正中任脈引導虛線
          const cv17 = torsoPts.CV17;
          const cv6 = torsoPts.CV6;
          if (cv17 && cv6) {
            ctx.save();
            ctx.strokeStyle = 'rgba(196, 137, 59, 0.6)';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(cv17.x * W, cv17.y * H);
            ctx.lineTo(cv6.x * W, cv6.y * H);
            ctx.stroke();
            ctx.restore();
          }

          ptsList.forEach((ptObj) => {
            const isPrim = arState.targetPointId === ptObj.id;
            if (!isPrim && !arState.showAllInMode) return;
            if (ptObj.points) {
              ptObj.points.forEach((p, i) => {
                drawAcupointMarker(ctx, p.x * W, p.y * H, i === 0 ? ptObj.name : '', isPrim, pulse);
              });
            } else {
              drawAcupointMarker(ctx, ptObj.x * W, ptObj.y * H, ptObj.name, isPrim, pulse);
            }
          });
        } else if (!arState.isFrozen) {
          statusEl.textContent = '🫁 請將鏡頭對準正面胸腹部（露出雙肩與骨盆）...';
        }
      } else if (!arState.isFrozen) {
        statusEl.textContent = '🫁 正在辨識正面軀幹姿態...';
      }
    }
    // 🦶 6. 腳底全息 Guided AR 模式
    else if (arState.mode === 'foot') {
      if (!arState.isFrozen) {
        statusEl.textContent = '🟢 足底全息引導已就緒・將腳底放入金色框後點「❄️ 定格」即可放桌上按穴';
      }
      drawGuidedFootOverlay(ctx, W, H, arState.targetPointId, pulse, arState.footSide);
    }
    // 👂 7. 耳穴全息 Guided AR 模式
    else if (arState.mode === 'ear') {
      if (!arState.isFrozen) {
        statusEl.textContent = '🟢 耳穴全息引導已就緒・將耳朵放入金色框後點「❄️ 定格」即可對照貼按';
      }
      drawGuidedEarOverlay(ctx, W, H, arState.targetPointId, pulse, arState.earSide);
    }
  }

  arState.rafId = requestAnimationFrame(renderArLoop);
}

function stopCameraStream() {
  if (arState.rafId) {
    cancelAnimationFrame(arState.rafId);
    arState.rafId = null;
  }
  if (arState.stream) {
    arState.stream.getTracks().forEach((t) => t.stop());
    arState.stream = null;
  }
}

export function closeArModal() {
  arState.isOpen = false;
  arState.isFrozen = false;
  if (arState.countdownTimer) {
    clearInterval(arState.countdownTimer);
    arState.countdownTimer = null;
  }
  const countdownOverlay = document.getElementById('arCountdownOverlay');
  if (countdownOverlay) countdownOverlay.style.display = 'none';
  stopCameraStream();
  document.getElementById('arModal')?.classList.remove('open');
}

function updateArPointButtons() {
  document.querySelectorAll('.ar-point-chip').forEach((btn) => {
    const pid = btn.getAttribute('data-ar-point');
    btn.classList.toggle('active', pid === arState.targetPointId);
  });
}

export function initArControls(onSelectPointInMainApp) {
  // 綁定關閉按鈕
  document.getElementById('closeArModalBtn')?.addEventListener('click', closeArModal);

  // 綁定定格與 3 秒倒數定格按鈕
  document.getElementById('freezeArBtn')?.addEventListener('click', toggleFreezeFrame);
  document.getElementById('countdownFreezeBtn')?.addEventListener('click', startCountdownFreeze);

  // 綁定前後鏡頭切換按鈕
  document.getElementById('flipCameraBtn')?.addEventListener('click', async () => {
    arState.facingMode = arState.facingMode === 'user' ? 'environment' : 'user';
    await startArSession();
  });

  // 綁定足底左右腳切換按鈕
  const footSideBtn = document.getElementById('footSideBtn');
  if (footSideBtn) {
    footSideBtn.addEventListener('click', () => {
      arState.footSide = arState.footSide === 'right' ? 'left' : 'right';
      footSideBtn.textContent = `🦶 腳底：${arState.footSide === 'right' ? '右腳 (換左腳)' : '左腳 (換右腳)'}`;
    });
  }

  // 綁定耳穴左右耳切換按鈕
  const earSideBtn = document.getElementById('earSideBtn');
  if (earSideBtn) {
    earSideBtn.addEventListener('click', () => {
      arState.earSide = arState.earSide === 'right' ? 'left' : 'right';
      earSideBtn.textContent = `👂 耳朵：${arState.earSide === 'right' ? '右耳 (換左耳)' : '左耳 (換右耳)'}`;
    });
  }

  // 綁定 AR 視窗內的穴位快速切換膠囊
  const chipContainer = document.getElementById('arPointChips');
  if (chipContainer) {
    const getModeEmoji = (m) => {
      switch (m) {
        case 'hand': return '✋';
        case 'face': return '😊';
        case 'leg': return '🦵';
        case 'back': return '🧘';
        case 'torso': return '🫁';
        case 'foot': return '🦶';
        case 'ear': return '👂';
        default: return '📍';
      }
    };

    chipContainer.innerHTML = Object.entries(AR_SUPPORTED_POINTS)
      .map(([id, cfg]) => `
        <button type="button" class="ar-point-chip" data-ar-point="${id}">
          ${getModeEmoji(cfg.mode)} ${cfg.name} (${id})
        </button>
      `)
      .join('');

    chipContainer.querySelectorAll('.ar-point-chip').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const pid = btn.getAttribute('data-ar-point');
        const cfg = AR_SUPPORTED_POINTS[pid];
        if (!cfg) return;

        const prevMode = arState.mode;
        arState.targetPointId = pid;
        arState.mode = cfg.mode;
        if (cfg.footSide) {
          arState.footSide = cfg.footSide;
        }
        updateArPointButtons();

        const hintEl = document.getElementById('arHintBanner');
        if (hintEl) hintEl.textContent = cfg.hint;

        if (footSideBtn) {
          footSideBtn.style.display = cfg.mode === 'foot' ? 'inline-block' : 'none';
          footSideBtn.textContent = `🦶 腳底：${arState.footSide === 'right' ? '右腳 (換左腳)' : '左腳 (換右腳)'}`;
        }
        if (earSideBtn) {
          earSideBtn.style.display = cfg.mode === 'ear' ? 'inline-block' : 'none';
          earSideBtn.textContent = `👂 耳朵：${arState.earSide === 'right' ? '右耳 (換左耳)' : '左耳 (換右耳)'}`;
        }

        if (onSelectPointInMainApp) {
          onSelectPointInMainApp(pid);
        }

        // 若模式切換，自動重新啟動相機與對應模型
        if (prevMode !== cfg.mode) {
          arState.facingMode = cfg.mode === 'face' || cfg.mode === 'ear' ? 'user' : 'environment';
          await startArSession();
        }
      });
    });
  }
}
