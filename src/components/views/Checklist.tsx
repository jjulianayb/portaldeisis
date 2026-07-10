import { useMemo, useState } from "react";
import { useStore, uid } from "@/lib/store";
import { PageHeader, Card, Input, Select, Button, Chip } from "@/components/ui-kit";
import { Check, Plus, X, Sparkles } from "lucide-react";

const CATEGORIES = ["Ativação", "Produtividade", "Limites", "Ambiente", "Negócios", "Espiritualidade", "Corpo e descanso"];

export function ChecklistView() {
  const { state, update } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const [text, setText] = useState("");
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [showCelebrate, setShowCelebrate] = useState(false);

  const doneToday = state.checklist.filter((c) => c.doneOn.includes(today)).length;
  const total = state.checklist.length;
  const pct = total ? Math.round((doneToday / total) * 100) : 0;

  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const iso = d.toISOString().slice(0, 10);
      const done = state.checklist.reduce((a, c) => a + (c.doneOn.includes(iso) ? 1 : 0), 0);
      return { iso, label: d.toLocaleDateString("pt-BR", { weekday: "short" }), pct: total ? Math.round((done / total) * 100) : 0 };
    });
  }, [state.checklist, total]);

  function toggle(id: string) {
    let allDoneAfter = false;
    update((s) => {
      const next = s.checklist.map((c) => {
        if (c.id !== id) return c;
        const has = c.doneOn.includes(today);
        return { ...c, doneOn: has ? c.doneOn.filter((d) => d !== today) : [...c.doneOn, today] };
      });
      allDoneAfter = next.every((c) => c.doneOn.includes(today));
      return { ...s, checklist: next };
    });
    if (allDoneAfter) {
      setShowCelebrate(true);
      setTimeout(() => setShowCelebrate(false), 3000);
    }
  }

  function add() {
    if (!text.trim()) return;
    update((s) => ({ ...s, checklist: [...s.checklist, { id: uid(), text: text.trim(), category: cat, doneOn: [] }] }));
    setText("");
  }

  function remove(id: string) {
    update((s) => ({ ...s, checklist: s.checklist.filter((c) => c.id !== id) }));
  }

  return (
    <>
      <PageHeader eyebrow="Ritual diário" title="Checklist" subtitle="Pequenas ações que sustentam a soberania." />

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <Card className="md:col-span-2">
          <div className="flex items-baseline justify-between">
            <div className="text-[10px] uppercase tracking-[0.3em] gold-text">Hoje</div>
            <div className="font-display text-4xl gold-text">{pct}%</div>
          </div>
          <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-soft)]" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {week.map((w) => (
              <div key={w.iso} className="text-center">
                <div className="text-[10px] uppercase text-muted-foreground">{w.label}</div>
                <div className="mt-1 h-16 flex items-end">
                  <div className="w-full bg-secondary rounded-sm overflow-hidden h-full flex items-end">
                    <div className="w-full bg-gradient-to-t from-[var(--gold)] to-[var(--gold-soft)]" style={{ height: `${w.pct}%` }} />
                  </div>
                </div>
                <div className="text-[10px] gold-text mt-1">{w.pct}%</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-[10px] uppercase tracking-[0.3em] gold-text">Adicionar</div>
          <div className="mt-3 space-y-2">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Novo ritual…" />
            <Select value={cat} onChange={(e) => setCat(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Button onClick={add} className="w-full"><Plus className="w-4 h-4 inline mr-1" />Adicionar</Button>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {CATEGORIES.map((c) => {
          const items = state.checklist.filter((i) => i.category === c);
          if (!items.length) return null;
          return (
            <div key={c}>
              <div className="flex items-center gap-3 mb-2">
                <Chip>{c}</Chip>
                <div className="flex-1 gold-divider" />
              </div>
              <div className="space-y-2">
                {items.map((i) => {
                  const done = i.doneOn.includes(today);
                  return (
                    <div key={i.id} className="group flex items-center gap-3 p-3 rounded-md border border-border bg-secondary/40">
                      <button onClick={() => toggle(i.id)} className={`w-5 h-5 rounded-full border flex items-center justify-center ${done ? "bg-primary border-primary" : "gold-border"}`}>
                        {done && <Check className="w-3 h-3 text-primary-foreground" />}
                      </button>
                      <span className={`flex-1 text-sm ${done ? "line-through text-muted-foreground" : ""}`}>{i.text}</span>
                      <button onClick={() => remove(i.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showCelebrate && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 sanctum-card px-6 py-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-5 h-5 gold-text" />
          <div>
            <div className="font-display text-xl">Dia completo.</div>
            <div className="text-xs text-muted-foreground">Você honrou o seu ritual.</div>
          </div>
        </div>
      )}
    </>
  );
}
