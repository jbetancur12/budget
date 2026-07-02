import { useState, useMemo } from 'react';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const SHORT_MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export function useMonth() {
  const [monthOffset, setMonthOffset] = useState(0);

  const monthInfo = useMemo(() => {
    const rawIdx = 6 + monthOffset;
    const monthIdx = ((rawIdx % 12) + 12) % 12;
    const year = 2026 + Math.floor(rawIdx / 12);

    const nextMonthIdx = (monthIdx + 1) % 12;
    const nextYear = monthIdx === 11 ? year + 1 : year;

    return {
      monthOffset,
      monthLabel: `${MONTHS[monthIdx]} ${year}`,
      shortLabel: SHORT_MONTHS[monthIdx],
      nextMonthLabel: `${MONTHS[nextMonthIdx]} ${nextYear}`,
      monthIdx,
      year,
    };
  }, [monthOffset]);

  return { ...monthInfo, setMonthOffset };
}
