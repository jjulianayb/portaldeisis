import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Chip } from "@/components/ui-kit";

export function InsightsView() {
  const { state } = useStore();

  const insights = useMemo(() => {
    const out: string[] = [];
    const doneTasks = state.tasks.filter((t) => t.done && t.completedAt);
    if (doneTasks.length >= 3) {
      const hours = doneTasks.map((t) => new Date(t.completedAt!).getHours());
      const buckets = { manhã: 0, tarde: 0, noite: 0 };
      hours.forEach((h) => { buckets[h < 12 ? "manhã" : h < 18 ? "tarde" : "noite"]++; });
      const top = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0];
      out.push(`Você tende a concluir mais tarefas pela ${top[0]}.`);
    }

    const archCount: Record<string, number> = {};
    state.tasks.forEach((t) => { if (t.archetype) archCount[t.archetype] = (archCount[t.archetype] || 0) + 1; });
    const topArch = Object.entries(archCount).sort((a, b) => b[1] - a[1])[0];
    if (topArch) out.push(`Seu arquétipo mais acionado tem sido ${topArch[0]}. Vale observar se está equilibrado.`);

    const overdue = state.tasks.filter((t) => !t.done && t.deadline && t.deadline < new Date().toISOString().slice(0, 10));
    if (overdue.length >= 3) out.push(`Há ${overdue.length} tarefas em atraso — possível padrão de sobrecarga ou procrastinação.`);

    const week7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); });
    const doneChecks = state.checklist.reduce((a, c) => a + c.doneOn.filter((d) => week7.includes(d)).length, 0);
    const totalChecks = state.checklist.length * 7;
    if (totalChecks > 0) {
      const pct = Math.round((doneChecks / totalChecks) * 100);
      if (pct >= 70) out.push(`Sua consistência de rituais está em ${pct}% — território de rainha.`);
      else if (pct < 30) out.push(`Consistência baixa nesta semana (${pct}%). Talvez simplificar seja mais soberano que expandir.`);
    }

    const emotions = state.tasks.map((t) => t.emotion?.toLowerCase()).filter(Boolean) as string[];
    const anx = emotions.filter((e) => /ansi/.test(e)).length;
    if (anx >= 3) out.push(`Ansiedade apareceu em várias tarefas recentes — considere ativar Ísis ou Árvore antes de Cavalo.`);

    if (!out.length) out.push("Ainda coletando dados. Continue registrando — os padrões aparecerão em breve.");
    return out;
  }, [state]);

  const archCount: Record<string, number> = {};
  state.tasks.forEach((t) => { if (t.archetype) archCount[t.archetype] = (archCount[t.archetype] || 0) + 1; });

  return (
    <>
      <PageHeader eyebrow="Evolução" title="Minha evolução" subtitle="Padrões extraídos do seu histórico. Espelho, não julgamento." />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Stat label="Tarefas concluídas" value={state.tasks.filter((t) => t.done).length} />
        <Stat label="Consultas ao Conselho" value={state.council.length} />
        <Stat label="Entradas de diário" value={state.diary.length} />
      </div>

      <Card>
        <div className="text-[10px] uppercase tracking-[0.3em] gold-text">Insights</div>
        <ul className="mt-3 space-y-2">
          {insights.map((i, idx) => (
            <li key={idx} className="p-3 rounded-md bg-secondary/40 border border-border text-sm">{i}</li>
          ))}
        </ul>
      </Card>

      {Object.keys(archCount).length > 0 && (
        <Card className="mt-5">
          <div className="text-[10px] uppercase tracking-[0.3em] gold-text">Arquétipos mais acionados</div>
          <div className="mt-3 space-y-2">
            {Object.entries(archCount).sort((a, b) => b[1] - a[1]).map(([n, c]) => (
              <div key={n} className="flex items-center gap-3">
                <div className="w-32 text-sm">{n}</div>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-soft)]" style={{ width: `${Math.min(100, c * 20)}%` }} />
                </div>
                <Chip>{c}</Chip>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="text-center">
      <div className="font-display text-4xl gold-text">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </Card>
  );
}
