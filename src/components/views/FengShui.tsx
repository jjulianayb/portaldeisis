import { useState } from "react";
import { useStore, uid } from "@/lib/store";
import { PageHeader, Card, Field, Input, Select, Button, Chip } from "@/components/ui-kit";
import { Check, X, Plus } from "lucide-react";

const SPACES = ["Home office", "Quarto", "Sala", "Entrada", "Mesa de trabalho"];
const KINDS = ["tradicional", "pessoal", "funcional"] as const;

export function FengShuiView() {
  const { state, update } = useStore();
  const [form, setForm] = useState({ space: SPACES[0], item: "", kind: "funcional" as (typeof KINDS)[number] });

  function add() {
    if (!form.item.trim()) return;
    update((s) => ({ ...s, fengshui: [...s.fengshui, { id: uid(), ...form, done: false }] }));
    setForm({ space: SPACES[0], item: "", kind: "funcional" });
  }
  function toggle(id: string) {
    update((s) => ({ ...s, fengshui: s.fengshui.map((c) => (c.id === id ? { ...c, done: !c.done } : c)) }));
  }
  function remove(id: string) {
    update((s) => ({ ...s, fengshui: s.fengshui.filter((c) => c.id !== id) }));
  }

  return (
    <>
      <PageHeader
        eyebrow="Ambiente"
        title="Feng Shui & Ambiente"
        subtitle="Distinguindo prática tradicional, preferência pessoal e hábito funcional."
      />

      <Card className="mb-6">
        <div className="grid md:grid-cols-4 gap-3">
          <Field label="Espaço"><Select value={form.space} onChange={(e) => setForm({ ...form, space: e.target.value })}>{SPACES.map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="Tipo"><Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as (typeof KINDS)[number] })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</Select></Field>
          <div className="md:col-span-2"><Field label="Item / prática"><Input value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} /></Field></div>
        </div>
        <div className="mt-3"><Button onClick={add}><Plus className="inline w-4 h-4 mr-1" />Adicionar</Button></div>
      </Card>

      <div className="space-y-6">
        {SPACES.map((sp) => {
          const items = state.fengshui.filter((f) => f.space === sp);
          if (!items.length) return null;
          return (
            <div key={sp}>
              <div className="flex items-center gap-3 mb-2">
                <Chip>{sp}</Chip>
                <div className="flex-1 gold-divider" />
              </div>
              <div className="space-y-2">
                {items.map((i) => (
                  <div key={i.id} className="group flex items-center gap-3 p-3 rounded-md border border-border bg-secondary/40">
                    <button onClick={() => toggle(i.id)} className={`w-5 h-5 rounded-full border flex items-center justify-center ${i.done ? "bg-primary border-primary" : "gold-border"}`}>
                      {i.done && <Check className="w-3 h-3 text-primary-foreground" />}
                    </button>
                    <span className={`flex-1 text-sm ${i.done ? "line-through text-muted-foreground" : ""}`}>{i.item}</span>
                    <Chip tone={i.kind === "tradicional" ? "wine" : i.kind === "pessoal" ? "gold" : "muted"}>{i.kind}</Chip>
                    <button onClick={() => remove(i.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center italic">
        Feng Shui é conhecimento tradicional. Aqui coexiste com preferência estética e hábito funcional — sem confundir os planos.
      </p>
    </>
  );
}
