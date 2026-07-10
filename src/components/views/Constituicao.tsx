import { useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Input, Button } from "@/components/ui-kit";
import { Plus, X, GripVertical } from "lucide-react";

export function ConstituicaoView() {
  const { state, update } = useStore();
  const [novo, setNovo] = useState("");

  function add() {
    if (!novo.trim()) return;
    update((s) => ({ ...s, constitution: [...s.constitution, novo.trim()] }));
    setNovo("");
  }
  function remove(i: number) {
    update((s) => ({ ...s, constitution: s.constitution.filter((_, idx) => idx !== i) }));
  }
  function edit(i: number, v: string) {
    update((s) => ({ ...s, constitution: s.constitution.map((p, idx) => (idx === i ? v : p)) }));
  }

  return (
    <>
      <PageHeader
        eyebrow="Código Soberano"
        title="Constituição da Juliana"
        subtitle="Seus princípios não-negociáveis. Consultar antes de decidir grande."
      />

      <Card>
        <div className="flex gap-2">
          <Input value={novo} onChange={(e) => setNovo(e.target.value)} placeholder="Novo princípio…" onKeyDown={(e) => e.key === "Enter" && add()} />
          <Button onClick={add}><Plus className="w-4 h-4" /></Button>
        </div>

        <ol className="mt-6 space-y-2">
          {state.constitution.map((p, i) => (
            <li key={i} className="group flex items-center gap-2 p-3 rounded-md border border-border bg-secondary/40 hover:border-[color-mix(in_oklab,var(--gold)_25%,transparent)]">
              <GripVertical className="w-4 h-4 text-muted-foreground opacity-40" />
              <div className="w-6 text-center gold-text font-display text-lg">{i + 1}</div>
              <input
                value={p}
                onChange={(e) => edit(i, e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm"
              />
              <button onClick={() => remove(i)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="mt-5">
        <div className="text-[10px] uppercase tracking-[0.3em] gold-text">Lembrete</div>
        <p className="mt-2 font-display text-xl">
          Sempre que registrar uma dúvida ou decisão, pergunte: qual princípio se aplica aqui?
        </p>
      </Card>
    </>
  );
}
