import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { Dashboard } from '../pages/Dashboard';
import { Transactions } from '../pages/Transactions';
import { Pockets } from '../pages/Pockets';
import { useMonth } from '../hooks/useMonth';
import { useBudgetData } from '../hooks/useBudgetData';
import type { Tab } from '../types';

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const { monthOffset, monthLabel, shortLabel, nextMonthLabel, setMonthOffset } = useMonth();
  const {
    income, services, loans, variableExp, pockets, chartHistory,
    loading, error,
    incomeH, servicesH, loansH, variableH, updatePockets,
  } = useBudgetData(monthOffset);

  const [servicesOpen, setServicesOpen] = useState(true);
  const [loansOpen, setLoansOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm font-semibold">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <div className="text-destructive text-sm font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Header
        tab={tab}
        monthLabel={monthLabel}
        onPrevMonth={() => setMonthOffset((o: number) => o - 1)}
        onNextMonth={() => setMonthOffset((o: number) => o + 1)}
        onTabChange={setTab}
      />

      <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-6">
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
            nextMonthLabel={nextMonthLabel}
            onPocketsUpdated={updatePockets}
            onMonthForward={() => setMonthOffset((o: number) => o + 1)}
          />
        )}
      </main>

      <MobileNav tab={tab} onTabChange={setTab} />
    </div>
  );
}
