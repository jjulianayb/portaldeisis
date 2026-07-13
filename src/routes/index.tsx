import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StoreProvider, useStore } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";

import { AppShell, type ViewKey } from "@/components/AppShell";
import { DashboardView } from "@/components/views/Dashboard";
import { PerfilView } from "@/components/views/Perfil";
import { ConstituicaoView } from "@/components/views/Constituicao";
import { ArquetiposView } from "@/components/views/Arquetipos";
import { ConselhoView } from "@/components/views/Conselho";
import { TarefasView } from "@/components/views/Tarefas";
import { ChecklistView } from "@/components/views/Checklist";
import { DiarioView } from "@/components/views/Diario";
import { NumerologiaView } from "@/components/views/Numerologia";
import { EspiritualidadeView } from "@/components/views/Espiritualidade";
import { FengShuiView } from "@/components/views/FengShui";
import { InsightsView } from "@/components/views/Insights";
import { ImperioView } from "@/components/views/Imperio";
import { RedeView } from "@/components/views/Rede";
import { BackupView } from "@/components/views/Backup";

export const Route = createFileRoute("/")({
  component: () => (
    <StoreProvider>
      <RootGate />
    </StoreProvider>
  ),
});

function RootGate() {
  const hydrated = useHydrated();
  const { hydrated: storeHydrated, unlocked } = useStore();

  if (!hydrated || !storeHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-display text-2xl gold-text animate-pulse">Juliana OS</div>
      </div>
    );
  }
  if (!unlocked) return <Login />;
  return <AppRouter />;
}

function AppRouter() {
  const [view, setView] = useState<ViewKey>("dashboard");
  return (
    <AppShell active={view} onNavigate={setView}>
      {view === "dashboard" && <DashboardView onNavigate={setView} />}
      {view === "perfil" && <PerfilView />}
      {view === "constituicao" && <ConstituicaoView />}
      {view === "arquetipos" && <ArquetiposView />}
      {view === "conselho" && <ConselhoView />}
      {view === "tarefas" && <TarefasView />}
      {view === "checklist" && <ChecklistView />}
      {view === "diario" && <DiarioView />}
      {view === "numerologia" && <NumerologiaView />}
      {view === "espiritualidade" && <EspiritualidadeView />}
      {view === "fengshui" && <FengShuiView />}
      {view === "insights" && <InsightsView />}
      {view === "imperio" && <ImperioView />}
      {view === "rede" && <RedeView />}
      {view === "backup" && <BackupView />}
    </AppShell>
  );
}
