// 🧪 本草尋穴自動化靜態與單元驗證腳本（執行：node scripts/verify.mjs）
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';

const root = path.resolve(process.cwd());
let failures = 0;

function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    failures += 1;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

// 1. 全站 JS 語法檢查
const jsFiles = [
  'app.js',
  'arFinder.js',
  'sw.js',
  ...fs.readdirSync(path.join(root, 'data')).filter((f) => f.endsWith('.js')).map((f) => `data/${f}`),
  ...fs.readdirSync(path.join(root, 'modules')).filter((f) => f.endsWith('.js')).map((f) => `modules/${f}`)
];

for (const f of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', path.join(root, f)], { stdio: 'pipe' });
  } catch (err) {
    assert(false, `JS syntax error in ${f}: ${err.stderr?.toString()}`);
  }
}
assert(failures === 0, `全站 ${jsFiles.length} 支 JS 語法驗證通過`);

// 2. 載入資料與模組檢查
const dataMod = await import(pathToFileURL(path.join(root, 'data/index.js')).href);
const arMod = await import(pathToFileURL(path.join(root, 'arFinder.js')).href);
const stateMod = await import(pathToFileURL(path.join(root, 'modules/state.js')).href);
const wizardMod = await import(pathToFileURL(path.join(root, 'modules/wizard.js')).href);
const deeplinkMod = await import(pathToFileURL(path.join(root, 'modules/deeplink.js')).href);

const { ACUPOINTS, SYMPTOM_PRESETS, DIETARY_THERAPY, ZIWU_LIUZHU, SOLAR_TERMS, getCurrentSolarTerm, getCloseupSvgMarkup } = dataMod;
const ids = new Set(ACUPOINTS.map((p) => p.id));

assert(ACUPOINTS.length === 56, `穴位總數 = ${ACUPOINTS.length}`);

const missingAr = ACUPOINTS.filter((p) => !arMod.AR_SUPPORTED_POINTS[p.id]).map((p) => p.id);
assert(missingAr.length === 0, `AR 覆蓋率 100% (缺失: ${missingAr.join(', ') || '無'})`);

const missingDiet = ACUPOINTS.filter((p) => !DIETARY_THERAPY[p.id]).map((p) => p.id);
assert(missingDiet.length === 0, `本草食療覆蓋率 100% (缺失: ${missingDiet.join(', ') || '無'})`);

const missingCloseup = ACUPOINTS.filter((p) => {
  const s = getCloseupSvgMarkup(p.id);
  return !s || s.length < 150;
}).map((p) => p.id);
assert(missingCloseup.length === 0, `1:1 微距解剖圖覆蓋率 100% (缺失: ${missingCloseup.join(', ') || '無'})`);

const badPairings = [];
ACUPOINTS.forEach((p) => (p.pairings || []).forEach((pr) => { if (!ids.has(pr.partnerId)) badPairings.push(`${p.id}->${pr.partnerId}`); }));
assert(badPairings.length === 0, `配穴 ID 全部有效`);

const badPresets = [];
SYMPTOM_PRESETS.forEach((pr) => pr.points.forEach((pid) => { if (!ids.has(pid)) badPresets.push(`${pr.id}->${pid}`); }));
assert(badPresets.length === 0, `內建 ${SYMPTOM_PRESETS.length} 組處方穴位 ID 全部有效`);

const badSolar = [];
SOLAR_TERMS.forEach((t) => t.recommendedPointIds.forEach((pid) => { if (!ids.has(pid)) badSolar.push(`${t.name}->${pid}`); }));
assert(SOLAR_TERMS.length === 24 && badSolar.length === 0, `24 節氣推薦穴位全部有效`);

// 全年 365 天節氣推算無例外
let solarOk = true;
for (let m = 0; m < 12; m++) {
  for (let d = 1; d <= 28; d++) {
    const r = getCurrentSolarTerm(new Date(2026, m, d));
    if (!r?.current?.name) solarOk = false;
  }
}
assert(solarOk, '24 節氣全年日期推算正常');

const badZiwu = [];
ZIWU_LIUZHU.forEach((z) => z.recommendedIds.forEach((pid) => { if (!ids.has(pid)) badZiwu.push(`${z.zhi}->${pid}`); }));
assert(badZiwu.length === 0, '子午流注推薦穴位全部有效');

// 3. DOM ID & HTML 一致性檢查
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const allCode = jsFiles.filter((f) => f !== 'sw.js').map((f) => ({ f, code: fs.readFileSync(path.join(root, f), 'utf8') }));
const missingDomIds = [];
allCode.forEach(({ f, code }) => {
  for (const m of code.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)) {
    const id = m[1];
    const inHtml = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
    const inJs = allCode.some((x) =>
      x.code.includes(`id="${id}"`) || x.code.includes(`id='${id}'`) || x.code.includes(`id = '${id}'`) || x.code.includes(`id = "${id}"`)
    );
    if (!inHtml && !inJs) missingDomIds.push(`${f}: #${id}`);
  }
});
assert(missingDomIds.length === 0, `JS 引用的 DOM ID 全部存在 (${missingDomIds.join(', ') || '0 缺失'})`);

// 確認 quick-preset 按鈕都在 SYMPTOM_PRESETS
const presetIds = new Set(SYMPTOM_PRESETS.map((p) => p.id));
const quickPresets = [...html.matchAll(/data-quick-preset="([^"]+)"/g)].map((m) => m[1]);
assert(
  quickPresets.length > 0 && quickPresets.every((id) => presetIds.has(id)),
  `搜尋無結果推薦按鈕有效 (${quickPresets.join(', ')})`
);

// 確認沒有殘留 state.timer.isRunning 錯字
const appCode = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
assert(!appCode.includes('timer.isRunning'), '無殘留 timer.isRunning 錯字');

// 4. Service Worker ASSETS 實體檔案存在檢查
const swCode = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const assetsMatch = swCode.match(/const ASSETS = \[([\s\S]*?)\];/);
const assetPaths = assetsMatch ? [...assetsMatch[1].matchAll(/'(\.\/[^']*)'/g)].map((m) => m[1]) : [];
const missingAssets = assetPaths.filter((p) => p !== './' && !fs.existsSync(path.join(root, p.slice(2))));
assert(assetPaths.length > 10 && missingAssets.length === 0, `SW 快取清單 ${assetPaths.length} 筆檔案全部存在 (${missingAssets.join(', ') || '0 缺失'})`);

// 5. 單元測試：Deep Link 解析自訂分享處方
global.window = { location: { search: '?preset=shared&pts=LI4,PC6,KI1,INVALID&title=%E5%AA%BD%E5%AA%BD%E7%9D%A1%E5%89%8D' } };
const dl = deeplinkMod.readDeepLinkFromUrl(ACUPOINTS);
assert(
  dl.sharedPreset && dl.sharedPreset.points.join(',') === 'LI4,PC6,KI1' && dl.sharedPreset.title === '媽媽睡前',
  'Deep Link 分享處方解析與無效 ID 過濾正常'
);

// 6. 單元測試：3 題問診精靈演算法（含孕期安全鎖）
stateMod.state.pregnancySafeMode = true;
const wiz = wizardMod.computeWizardPrescription(ACUPOINTS, {
  symptoms: ['cold_edema', 'neck_back'],
  constitution: 'cold',
  posture: 'office'
});
const hasForbidden = wiz.pointObjects.some((p) => p.contraindications?.pregnancyForbidden);
assert(wiz.points.length === 4 && !hasForbidden, `問診精靈配出 4 穴且孕期禁穴已安全過濾 (${wiz.points.join(', ')})`);
stateMod.state.pregnancySafeMode = false;

console.log('\n========================================');
if (failures === 0) {
  console.log('🎉 ALL CHECKS PASSED (0 failures)');
  process.exit(0);
} else {
  console.error(`💥 ${failures} CHECK(S) FAILED`);
  process.exit(1);
}
