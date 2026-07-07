// Rounding utilities. Internal calculations preserve full precision (ESTIMATION.md);
// rounding is applied only at display time.

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
