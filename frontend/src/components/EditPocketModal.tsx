import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { updatePocket } from '../api';
import { PocketIcon } from './PocketIcon';
import type { PocketData, PocketIcon as PocketIconType } from '../types';

const ICONS: { value: PocketIconType; label: string }[] = [
  { value: 'Shield', label: 'Escudo' },
  { value: 'Plane', label: 'Viaje' },
  { value: 'TrendingUp', label: 'Inversión' },
  { value: 'BookOpen', label: 'Educación' },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#16A34A', '#F59E0B', '#EF4444', '#EC4899'];

interface EditPocketForm {
  name: string;
  goal: string;
  color: string;
  icon: PocketIconType;
}

interface Props {
  pocket: PocketData;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

export function EditPocketModal({ pocket, onClose, onUpdated }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditPocketForm>({
    defaultValues: {
      name: pocket.name,
      goal: String(pocket.goal),
      color: pocket.color,
      icon: pocket.icon,
    },
  });

  const selectedColor = watch('color');

  const onSubmit = async (data: EditPocketForm) => {
    await updatePocket(pocket.id, {
      name: data.name,
      goal: parseInt(data.goal) || 0,
      color: data.color,
      icon: data.icon,
    });
    await onUpdated();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-card sm:border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Editar Bolsillo</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Nombre
            </label>
            <input
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              {...register('name', { required: 'El nombre es requerido' })}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Meta ($)
            </label>
            <input
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              {...register('goal')}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <label key={c} className="cursor-pointer">
                  <input type="radio" value={c} {...register('color')} className="sr-only" />
                  <div
                    className={`w-8 h-8 rounded-xl border-2 transition-all ${selectedColor === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Icono
            </label>
            <div className="flex gap-2">
              {ICONS.map(({ value, label }) => (
                <label key={value} className="cursor-pointer flex flex-col items-center gap-1">
                  <input type="radio" value={value} {...register('icon')} className="sr-only" />
                  <div
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                      watch('icon') === value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    <PocketIcon icon={value} color={selectedColor} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
