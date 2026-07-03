import { useState, useEffect } from 'react';
import { Plus, Handshake, UserCheck, Trash2, DollarSign } from 'lucide-react';
import { fmt } from '../utils';
import * as api from '../api';
import { ConfirmModal } from '../components/ConfirmModal';
import type { DebtData } from '../types';

export function Debts() {
  const [debts, setDebts] = useState<DebtData[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [paying, setPaying] = useState<DebtData | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [deleting, setDeleting] = useState<DebtData | null>(null);
  const [newPerson, setNewPerson] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'lent' | 'borrowed'>('borrowed');
  const [newNotes, setNewNotes] = useState('');

  const load = async () => setDebts(await api.fetchDebts());
  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!newPerson.trim() || !newAmount) return;
    const amount = parseInt(newAmount.replace(/[^\d]/g, '')) || 0;
    if (!amount) return;
    await api.createDebt({
      person: newPerson.trim(),
      type: newType,
      originalAmount: amount,
      notes: newNotes || undefined,
    });
    setShowCreate(false);
    setNewPerson('');
    setNewAmount('');
    setNewNotes('');
    await load();
  };

  const handlePayment = async () => {
    if (!paying || !payAmount) return;
    const amount = parseInt(payAmount.replace(/[^\d]/g, '')) || 0;
    if (!amount || amount > paying.remainingBalance) return;
    await api.recordPayment(paying.id, amount);
    setPaying(null);
    setPayAmount('');
    await load();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await api.deleteDebt(deleting.id);
    setDeleting(null);
    await load();
  };

  const lent = debts.filter((d) => d.type === 'lent');
  const borrowed = debts.filter((d) => d.type === 'borrowed');
  const totalLent = lent.reduce((s, d) => s + d.remainingBalance, 0);
  const totalBorrowed = borrowed.reduce((s, d) => s + d.remainingBalance, 0);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Deudas</h1>
          <p className="text-sm text-muted-foreground">Control de préstamos y deudas</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          title="Nueva deuda"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-4 h-4 text-chart-2" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Me deben
            </span>
          </div>
          <p className="font-mono font-bold text-lg text-chart-2">{fmt(totalLent)}</p>
          <p className="text-[10px] text-muted-foreground">{lent.length} persona(s)</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Handshake className="w-4 h-4 text-destructive" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Debo
            </span>
          </div>
          <p className="font-mono font-bold text-lg text-destructive">{fmt(totalBorrowed)}</p>
          <p className="text-[10px] text-muted-foreground">{borrowed.length} persona(s)</p>
        </div>
      </div>

      <div className="space-y-2">
        {debts.map((debt) => (
          <div
            key={debt.id}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${debt.type === 'lent' ? 'bg-chart-2/10' : 'bg-destructive/10'}`}
            >
              {debt.type === 'lent' ? (
                <UserCheck
                  className={`w-5 h-5 ${debt.type === 'lent' ? 'text-chart-2' : 'text-destructive'}`}
                />
              ) : (
                <Handshake className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground truncate">{debt.person}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${debt.type === 'lent' ? 'bg-chart-2/10 text-chart-2' : 'bg-destructive/10 text-destructive'}`}
                >
                  {debt.type === 'lent' ? 'Presté' : 'Debo'}
                </span>
              </div>
              <p className="font-mono text-sm text-foreground mt-0.5">
                {fmt(debt.remainingBalance)}{' '}
                <span className="text-muted-foreground text-[11px]">
                  de {fmt(debt.originalAmount)}
                </span>
              </p>
              {debt.notes && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{debt.notes}</p>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              {debt.remainingBalance > 0 && (
                <button
                  onClick={() => {
                    setPaying(debt);
                    setPayAmount('');
                  }}
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  title="Registrar pago"
                >
                  <DollarSign className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setDeleting(debt)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {debts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No hay deudas registradas
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-card sm:border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Nueva deuda</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setNewType('borrowed')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${newType === 'borrowed' ? 'bg-destructive/10 text-destructive border-2 border-destructive/30' : 'bg-muted text-muted-foreground border-2 border-transparent'}`}
                >
                  Debo
                </button>
                <button
                  onClick={() => setNewType('lent')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${newType === 'lent' ? 'bg-chart-2/10 text-chart-2 border-2 border-chart-2/30' : 'bg-muted text-muted-foreground border-2 border-transparent'}`}
                >
                  Presté
                </button>
              </div>
              <input
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base"
                placeholder="Nombre de la persona"
              />
              <input
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value.replace(/[^\d]/g, ''))}
                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base font-mono"
                placeholder="Monto"
              />
              <input
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base"
                placeholder="Nota (opcional)"
              />
              <button
                onClick={handleCreate}
                className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paying && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
          onClick={() => setPaying(null)}
        >
          <div
            className="bg-card sm:border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Pago: {paying.person}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Saldo pendiente: {fmt(paying.remainingBalance)}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <input
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value.replace(/[^\d]/g, ''))}
                className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base font-mono"
                placeholder="Monto a pagar"
              />
              <button
                onClick={handlePayment}
                disabled={!payAmount || parseInt(payAmount) > paying.remainingBalance}
                className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Registrar pago
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmModal
          title="Eliminar deuda"
          message={`¿Eliminar deuda con ${deleting.person}?`}
          confirmLabel="Eliminar"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
