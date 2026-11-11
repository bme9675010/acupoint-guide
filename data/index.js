// 📚 資料彙整入口：整合全身經穴、足底反射區、耳穴全息與小兒推拿轉骨資料
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
import {
  CHILD_POINTS,
  CHILD_DIETARY_THERAPY,
  CHILD_SYNONYMS,
  CHILD_PRESETS
} from './childPoints.js';
import { getCloseupSvgMarkup as getBaseCloseupSvg } from './closeupDiagrams.js';
import { getEarCloseupSvgMarkup } from './earDiagrams.js';
import { getChildCloseupSvgMarkup } from './childDiagrams.js';

export const ACUPOINTS = [...BASE_ACUPOINTS, ...EAR_POINTS, ...CHILD_POINTS];
export const SYMPTOM_PRESETS = [...BASE_PRESETS, EAR_PRESET, ...CHILD_PRESETS];
export const DIETARY_THERAPY = { ...BASE_DIET, ...EAR_DIETARY_THERAPY, ...CHILD_DIETARY_THERAPY };
export { ZIWU_LIUZHU, ZIWU_DIET, EAR_SYNONYMS, CHILD_SYNONYMS };

export function getCloseupSvgMarkup(pointId) {
  if (pointId && pointId.startsWith('EAR-')) {
    return getEarCloseupSvgMarkup(pointId);
  }
  if (pointId && (pointId.startsWith('PED-') || pointId === 'GB39' || pointId === 'ST2')) {
    return getChildCloseupSvgMarkup(pointId);
  }
  return getBaseCloseupSvg(pointId);
}
