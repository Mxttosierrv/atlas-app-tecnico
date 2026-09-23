import { C } from '../theme/colors';

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function dbmQuality(v: number) {
  if (v >= -70)  return { label: 'Excelente', bars: 4, color: C.green };
  if (v >= -85)  return { label: 'Buena',     bars: 3, color: C.blue };
  if (v >= -100) return { label: 'Regular',   bars: 2, color: C.amber };
  return               { label: 'Débil',      bars: 1, color: C.red };
}
