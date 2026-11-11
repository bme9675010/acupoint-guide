// WebRTC + MediaPipe 端側 AI 即時手部與臉部穴位 AR 追蹤模組（零雲端費用，支援 iPhone 13 WebGL GPU 加速）

const VISION_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const WASM_PATH = `${VISION_CDN}/wasm`;
const HAND_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const FACE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

// 支援 AR 視覺定位的穴位清單與模式映射（共 13 個手部與臉部黃金穴位）
export const AR_SUPPORTED_POINTS = {
  // 手部穴位 (HandLandmarker 21 點骨骼追蹤)
  LI4: { mode: 'hand', name: '合谷', hint: '請將「手背或手掌」張開對準鏡頭，紅點即為第二掌骨中點合谷穴' },
  LU10: { mode: 'hand', name: '魚際', hint: '請將「大拇指根部魚際肌」對準鏡頭，標出第一掌骨中點魚際穴' },
  PC8: { mode: 'hand', name: '勞宮', hint: '請將「手掌心」張開對準鏡頭，標出掌心正中央勞宮穴' },
  LU7: { mode: 'hand', name: '列缺', hint: '請將「手腕大拇指外側緣」對準鏡頭，標出橈骨莖突上方列缺穴' },
  PC6: { mode: 'hand', name: '內關', hint: '請將「手掌心與手腕內側」對準鏡頭（露出手腕），自動換算 2 寸標出內關穴' },
  HT7: { mode: 'hand', name: '神門', hint: '請將「手掌心與手腕橫紋」對準鏡頭，標出小指側豌豆骨旁神門穴' },
  SI3: { mode: 'hand', name: '後谿', hint: '請將手掌「小指外側邊緣」對準鏡頭，標出第五掌骨頭後方後谿穴' },
  // 臉部穴位 (FaceLandmarker 478 點網格追蹤)
  'EX-HN3': { mode: 'face', name: '印堂', hint: '請將臉部對準前鏡頭，自動鎖定兩眉頭連線正中央「印堂穴」' },
  BL2: { mode: 'face', name: '攢竹', hint: '請將臉部對準前鏡頭，自動鎖定雙眉眉頭下方眶上切迹「攢竹穴」' },
  'EX-HN5': { mode: 'face', name: '太陽', hint: '請將臉部微側對準鏡頭，自動鎖定眉梢與眼尾後方凹窩「太陽穴」' },
  LI20: { mode: 'face', name: '迎香', hint: '請將臉部對準鏡頭，自動鎖定左右鼻翼外緣法令紋溝「迎香穴」' },
  TE17: { mode: 'face', name: '翳風', hint: '請將臉部微側露出耳垂，鎖定耳垂正後方凹窩「翳風穴」' },
  GV20: { mode: 'face', name: '百會', hint: '請將臉部正對鏡頭，沿鼻樑眉心中線向上標示頭頂正中央「百會穴」方位' }
};

let visionModule = null;
let handLandmarker = null;
let faceLandmarker = null;

const arState = {
  isOpen: false,
  mode: 'hand',              // 'hand' | 'face'
  targetPointId: 'LI4',      // 當前主標示穴位
  showAllInMode: true,       // 同時顯示同部位其他穴位作為參照
  facingMode: 'environment', // 手部預設後鏡頭('environment')，臉部預設前鏡頭('user')
  stream: null,
  rafId: null,
  lastVideoTime: -1,
  fps: 0,
  lastFrameTimestamp: 0
};

// 動態載入 MediaPipe Tasks Vision 並初始化 GPU 模型
async function ensureDetectorLoaded(mode, onStatusUpdate) {
  if (!visionModule) {
    onStatusUpdate('正在載入端側 AI 視覺引擎 (WebAssembly)...');
    visionModule = await import(`${VISION_CDN}/vision_bundle.mjs`);
  }

  const { FilesetResolver, HandLandmarker, FaceLandmarker } = visionModule;
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

  return { LI4: li4, LU10: lu10, PC8: pc8, LU7: lu7, SI3: si3, HT7: ht7, PC6: pc6 };
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
    LI20: { id: 'LI20', name: '迎香', points: [li20Left, li20Right] },
    TE17: { id: 'TE17', name: '翳風(耳垂後)', points: [te17Left, te17Right] },
    GV20: { id: 'GV20', name: '百會(頭頂中線)', points: [gv20Top], midline: [landmarks[168], gv20Top] }
  };
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

  if (!modal || !video || !canvas) return;

  // 決定初始穴位與模式
  const pointConfig = AR_SUPPORTED_POINTS[initialPointId] || AR_SUPPORTED_POINTS.LI4;
  arState.targetPointId = initialPointId in AR_SUPPORTED_POINTS ? initialPointId : 'LI4';
  arState.mode = pointConfig.mode;
  // 臉部預設用自拍前鏡頭 ('user')，手部預設用後鏡頭 ('environment')
  arState.facingMode = arState.mode === 'face' ? 'user' : 'environment';
  arState.isOpen = true;

  modal.classList.add('open');
  updateArPointButtons();
  hintEl.textContent = pointConfig.hint;

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

  stopCameraStream();

  try {
    await ensureDetectorLoaded(arState.mode, (msg) => {
      statusEl.textContent = msg;
    });

    statusEl.textContent = '正在開啟 iPhone 相機鏡頭...';
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
      // 電腦無前後鏡頭之分時 fallback
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    arState.stream = stream;
    video.srcObject = stream;

    // 前鏡頭自拍時開啟鏡像翻轉，讓畫面像照鏡子一樣直覺
    const isMirrored = arState.facingMode === 'user';
    video.style.transform = isMirrored ? 'scaleX(-1)' : 'none';
    canvas.style.transform = isMirrored ? 'scaleX(-1)' : 'none';

    await video.play();
    statusEl.textContent = `🟢 AI 即時追蹤中（${arState.mode === 'hand' ? '手部 21 骨骼點' : '臉部 478 特徵點'}）`;

    arState.lastVideoTime = -1;
    renderArLoop();
  } catch (err) {
    statusEl.textContent = `⚠️ 無法啟動相機：${err.message || '請確認已允許瀏覽器相機權限'}`;
  }
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
    if (video.currentTime !== arState.lastVideoTime) {
      arState.lastVideoTime = video.currentTime;

      // 計算即時 FPS
      if (arState.lastFrameTimestamp > 0) {
        const currentFps = Math.round(1000 / (nowMs - arState.lastFrameTimestamp));
        arState.fps = Math.round(arState.fps * 0.8 + currentFps * 0.2);
      }
      arState.lastFrameTimestamp = nowMs;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulse = 1 + 0.22 * Math.sin(nowMs / 180);
      const W = canvas.width;
      const H = canvas.height;

      if (arState.mode === 'hand' && handLandmarker) {
        const res = handLandmarker.detectForVideo(video, nowMs);
        if (res.landmarks && res.landmarks.length > 0) {
          statusEl.textContent = `🟢 已鎖定手部骨骼 (${arState.fps} FPS)・紅點即為目標穴位`;
          for (const handLms of res.landmarks) {
            // 繪製淡金色掌骨連線輔助對位
            const boneChains = [
              [0, 1, 2, 3, 4],
              [0, 5, 6, 7, 8],
              [0, 9, 10, 11, 12],
              [0, 13, 14, 15, 16],
              [0, 17, 18, 19, 20],
              [5, 9, 13, 17]
            ];
            ctx.strokeStyle = 'rgba(196, 137, 59, 0.45)';
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

            // 計算並繪製手部四大穴位
            const pts = computeHandAcupoints(handLms);
            Object.values(pts).forEach((p) => {
              const isPrimary = p.id === arState.targetPointId;
              if (!isPrimary && !arState.showAllInMode) return;

              // 若是合谷穴且為主目標，額外畫出「第二掌骨基準線」
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

              // 若是內關穴且為主目標，畫出手腕到內關的 2 寸延伸虛線
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

              drawAcupointMarker(ctx, p.x * W, p.y * H, p.name, isPrimary, pulse);
            });
          }
        } else {
          statusEl.textContent = '👋 請將手掌或手背放進畫面中（保持光線充足）...';
        }
      } else if (arState.mode === 'face' && faceLandmarker) {
        const res = faceLandmarker.detectForVideo(video, nowMs);
        if (res.faceLandmarks && res.faceLandmarks.length > 0) {
          statusEl.textContent = `🟢 已鎖定臉部骨度 (${arState.fps} FPS)・紅點即為目標穴位`;
          for (const faceLms of res.faceLandmarks) {
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
                // 對稱雙穴只在其中一側顯示文字標籤避免重疊，雙側都畫紅點
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
        } else {
          statusEl.textContent = '😊 請將臉部對準畫面中央...';
        }
      }
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

  // 綁定前後鏡頭切換按鈕
  document.getElementById('flipCameraBtn')?.addEventListener('click', async () => {
    arState.facingMode = arState.facingMode === 'user' ? 'environment' : 'user';
    await startArSession();
  });

  // 綁定 AR 視窗內的穴位快速切換膠囊
  const chipContainer = document.getElementById('arPointChips');
  if (chipContainer) {
    chipContainer.innerHTML = Object.entries(AR_SUPPORTED_POINTS)
      .map(([id, cfg]) => `
        <button type="button" class="ar-point-chip" data-ar-point="${id}">
          ${cfg.mode === 'hand' ? '✋' : '😊'} ${cfg.name} (${id})
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
        updateArPointButtons();

        const hintEl = document.getElementById('arHintBanner');
        if (hintEl) hintEl.textContent = cfg.hint;

        if (onSelectPointInMainApp) {
          onSelectPointInMainApp(pid);
        }

        // 若手部與臉部模式切換，自動切換對應模型與前後鏡頭
        if (prevMode !== cfg.mode) {
          arState.facingMode = cfg.mode === 'face' ? 'user' : 'environment';
          await startArSession();
        }
      });
    });
  }
}
