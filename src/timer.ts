export function calcTimeDiff(start: number[], end: number[]): number {
  const actualStart = start[0] * 1e9 + start[1];
  const actualEnd = end[0] * 1e9 + end[1];
  const result = actualEnd - actualStart;
  const diff = result / 1e9;
  const decimalPlaces = 6;
  const factor = Math.pow(10, decimalPlaces);
  const num = Math.round(factor * diff) / factor;
  return num;
}
