import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { MobileNav } from '../components/layout/MobileNav';
import { PwaUpdatePrompt } from '../components/PwaUpdatePrompt';
import { Toast } from '../components/Toast';
import { Dashboard } from '../pages/Dashboard';
import { Transactions } from '../pages/Transactions';
import { Pockets } from '../pages/Pockets';
import { Debts } from '../pages/Debts';
import { LoginPage } from '../pages/LoginPage';
import { useAuth } from '../hooks/useAuth';
import { useMonth } from '../hooks/useMonth';
import { useBudgetData } from '../hooks/useBudgetData';
import { createItem } from '../api';
import type { Tab } from '../types';

export default function App() {
  const { user, loading, logout } = useAuth();
  const { monthOffset, monthLabel, shortLabel, nextMonthLabel, setMonthOffset } = useMonth();
  const budgetData = useBudgetData(user ? monthOffset : null);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (user) {
      const meta = document.querySelector('meta[name=viewport]');
      if (meta) {
        meta.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0',
        );
        setTimeout(
          () =>
            meta.setAttribute(
              'content',
              'width=device-width, initial-scale=1.0, viewport-fit=cover',
            ),
          300,
        );
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
    categories,
    incomeCategories,
    expenseCategories,
    itemsByCategory,
    pockets,
    chartHistory,
    search,
    setSearch,
    makeHandlers,
    updatePockets,
    refresh,
    deletedItem,
    undoDelete,
    clearLastDeleted,
  } = budgetData;

  // Computed from categories for backward compat with Dashboard/Pockets
  const incomeItems = incomeCategories.flatMap((c) => itemsByCategory[c.id] ?? []);
  const expenseItems = expenseCategories.flatMap((c) => itemsByCategory[c.id] ?? []);

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
            income={incomeItems}
            services={[]}
            loans={[]}
            variableExp={expenseItems}
            pockets={pockets}
            chartHistory={chartHistory}
            shortLabel={shortLabel}
            onGoToPockets={() => setTab('pockets')}
            categories={categories}
            onQuickAdd={async (name, amount, catId, date) => {
              await createItem({
                name,
                amount,
                type: 'Variable',
                categoryId: catId,
                monthOffset,
                date,
              });
              refresh(monthOffset, search || undefined);
            }}
          />
        )}

        {tab === 'transactions' && (
          <Transactions
            categories={categories}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
            itemsByCategory={itemsByCategory}
            monthLabel={monthLabel}
            openCategories={openCategories}
            onToggleCategory={(id) => setOpenCategories((o) => ({ ...o, [id]: !o[id] }))}
            makeHandlers={makeHandlers}
            search={search}
            onSearchChange={setSearch}
            onCategoriesChange={() => refresh(monthOffset, search || undefined)}
          />
        )}

        {tab === 'debts' && <Debts />}

        {tab === 'pockets' && (
          <Pockets
            pockets={pockets}
            income={incomeItems}
            services={[]}
            loans={[]}
            variableExp={expenseItems}
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
      {deletedItem && (
        <Toast
          message={`"${deletedItem.name}" eliminado`}
          action={{ label: 'Deshacer', onClick: undoDelete }}
          onDone={clearLastDeleted}
        />
      )}
    </div>
  );
}
