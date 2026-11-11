// 📚 資料彙整入口：整合全身經穴、足底反射區與耳穴全息資料
import {
  ACUPOINTS as BASE_ACUPOINTS,
  SYMPTOM_PRESETS as BASE_PRESETS,
  ZIWU_LIUZHU,
  DIETARY_THERAPY as BASE_DIET,
  ZIWU_DIET
} from './acupoints.js';
import {
  EAR_POINTS,
  EAR_DIETARY_THERAPY,
  EAR_SYNONYMS,
  EAR_PRESET
} from './earPoints.js';
import { getCloseupSvgMarkup as getBaseCloseupSvg } from './closeupDiagrams.js';
import { getEarCloseupSvgMarkup } from './earDiagrams.js';

export const ACUPOINTS = [...BASE_ACUPOINTS, ...EAR_POINTS];
export const SYMPTOM_PRESETS = [...BASE_PRESETS, EAR_PRESET];
export const DIETARY_THERAPY = { ...BASE_DIET, ...EAR_DIETARY_THERAPY };
export { ZIWU_LIUZHU, ZIWU_DIET, EAR_SYNONYMS };

export function getCloseupSvgMarkup(pointId) {
  if (pointId && pointId.startsWith('EAR-')) {
    return getEarCloseupSvgMarkup(pointId);
  }
  return getBaseCloseupSvg(pointId);
}
