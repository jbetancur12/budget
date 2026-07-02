import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { PwaUpdatePrompt } from '../components/PwaUpdatePrompt';
import { Dashboard } from '../pages/Dashboard';
import { Transactions } from '../pages/Transactions';
import { Pockets } from '../pages/Pockets';
import { LoginPage } from '../pages/LoginPage';
import { useAuth } from '../hooks/useAuth';
import { useMonth } from '../hooks/useMonth';
import { useBudgetData } from '../hooks/useBudgetData';
import type { Tab } from '../types';

export default function App() {
  const { user, loading, logout } = useAuth();
  const { monthOffset, monthLabel, shortLabel, nextMonthLabel, setMonthOffset } = useMonth();
  const budgetData = useBudgetData(user ? monthOffset : null);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [servicesOpen, setServicesOpen] = useState(true);
  const [loansOpen, setLoansOpen] = useState(true);

  // Reset iOS zoom after login transitions
  useEffect(() => {
    if (user) {
      const meta = document.querySelector('meta[name=viewport]');
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0');
        setTimeout(() => meta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover'), 300);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm font-semibold">Cargando...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const {
    income, services, loans, variableExp, pockets, chartHistory,
    incomeH, servicesH, loansH, variableH, updatePockets,
  } = budgetData;

  return (
    <div className="h-full bg-background flex flex-col">
      <Header
        tab={tab}
        monthLabel={monthLabel}
        monthOffset={monthOffset}
        onPrevMonth={() => setMonthOffset((o: number) => o - 1)}
        onNextMonth={() => setMonthOffset((o: number) => o + 1)}
        onTabChange={setTab}
        onLogout={logout}
        onMonthPick={setMonthOffset}
      />

      <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-16 sm:pb-6">
        {tab === 'dashboard' && (
          <Dashboard
            income={income}
            services={services}
            loans={loans}
            variableExp={variableExp}
            pockets={pockets}
            chartHistory={chartHistory}
            shortLabel={shortLabel}
            onGoToPockets={() => setTab('pockets')}
          />
        )}

        {tab === 'transactions' && (
          <Transactions
            income={income}
            services={services}
            loans={loans}
            variableExp={variableExp}
            monthLabel={monthLabel}
            servicesOpen={servicesOpen}
            loansOpen={loansOpen}
            onToggleServices={() => setServicesOpen((o) => !o)}
            onToggleLoans={() => setLoansOpen((o) => !o)}
            incomeH={incomeH}
            servicesH={servicesH}
            loansH={loansH}
            variableH={variableH}
          />
        )}

        {tab === 'pockets' && (
          <Pockets
            pockets={pockets}
            income={income}
            services={services}
            loans={loans}
            variableExp={variableExp}
            monthLabel={monthLabel}
            monthOffset={monthOffset}
            nextMonthLabel={nextMonthLabel}
            onPocketsUpdated={updatePockets}
            onMonthForward={() => setMonthOffset((o: number) => o + 1)}
          />
        )}
      </main>

      <MobileNav tab={tab} onTabChange={setTab} onLogout={logout} />
      <PwaUpdatePrompt />
    </div>
  );
}
