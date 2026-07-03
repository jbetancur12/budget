export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const SHORT_MONTHS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export const fmt = (n: number): string => {
  const abs = Math.abs(Math.round(n));
  const formatted = abs.toLocaleString('es-CO');
  return (n < 0 ? '-$' : '$') + formatted;
};

export const formatInput = (v: string): string => {
  const digits = v.replace(/[^\d]/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toLocaleString('es-CO');
};

export const parseAmount = (v: string): number => parseFloat(v.replace(/[^\d]/g, '')) || 0;

export const safePercent = (num: number, den: number): number =>
  den === 0 ? 0 : Math.round((num / den) * 100);

export function monthLabel(offset: number): string {
  const rawIdx = 6 + offset;
  const monthIdx = ((rawIdx % 12) + 12) % 12;
  const year = 2026 + Math.floor(rawIdx / 12);
  return `${MONTHS[monthIdx]} ${year}`;
}

export function shortMonth(offset: number): string {
  const rawIdx = 6 + offset;
  const idx = ((rawIdx % 12) + 12) % 12;
  return SHORT_MONTHS[idx];
}
