import { Shield, Plane, TrendingUp, BookOpen } from 'lucide-react';
import type { PocketIcon as PocketIconType } from '../types';

export function PocketIcon({ icon, color }: { icon: PocketIconType; color: string }) {
  const cls = 'w-5 h-5';
  const style = { color };
  switch (icon) {
    case 'Shield':
      return <Shield className={cls} style={style} />;
    case 'Plane':
      return <Plane className={cls} style={style} />;
    case 'TrendingUp':
      return <TrendingUp className={cls} style={style} />;
    case 'BookOpen':
      return <BookOpen className={cls} style={style} />;
  }
}
