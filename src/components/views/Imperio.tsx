import { useState } from "react";
import { useStore, uid, type EmpireItem } from "@/lib/store";
import { PageHeader, Card, Field, Input, Select, Textarea, Button, Chip } from "@/components/ui-kit";
import { X, Check } from "lucide-react";

const KINDS: EmpireItem["kind"][] = ["meta", "projeto", "oportunidade", "movimento"];

export function ImperioView() {
  const { state, update } = useStore();
  const [form, setForm] = useState({ kind: "meta" as EmpireItem["kind"], title: "", detail: "", aligned: true });

  function add() {
    if (!form.title.trim()) return;
    update((s) => ({ ...s, empire: [{ id: uid(), ...form }, ...s.empire] }));
    setForm({ kind: "meta", title: "", detail: "", aligned: true });
  }
  function toggleAligned(id: string) {
    update((s) => ({ ...s, empire: s.empire.map((e) => (e.id === id ? { ...e, aligned: !e.aligned } : e)) }));
  }
  function remove(id: string) {
    update((s) => ({ ...s, empire: s.empire.filter((e) => e.id !== id) }));
  }

  return (
    <>
      <PageHeader
        eyebrow="Prosperidade"
        title="Império"
        subtitle="Metas, projetos, oportunidades e movimentos estratégicos. Pergunta guia: essa ação aproxima ou afasta você da sua visão?"
      />

      <Card className="mb-6">
        <div className="grid md:grid-cols-4 gap-3">
          <Field label="Tipo"><Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as EmpireItem["kind"] })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</Select></Field>
          <div className="md:col-span-3"><Field label="Título"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field></div>
          <div className="md:col-span-4"><Field label="Detalhe"><Textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} /></Field></div>
        </div>
        <div className="mt-3"><Button onClick={add}>Adicionar</Button></div>
      </Card>

      <div className="space-y-6">
        {KINDS.map((k) => {
          const items = state.empire.filter((e) => e.kind === k);
          if (!items.length) return null;
          return (
            <div key={k}>
              <div className="flex items-center gap-3 mb-2">
                <Chip tone="wine">{k}</Chip>
                <div className="flex-1 gold-divider" />
              </div>
              <div className="space-y-2">
                {items.map((i) => (
                  <Card key={i.id} className="!p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-medium">{i.title}</div>
                        {i.detail && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{i.detail}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleAligned(i.id)} title="Alinhado com a visão?"
                          className={`w-6 h-6 rounded-full border flex items-center justify-center ${i.aligned ? "bg-primary border-primary" : "border-border"}`}>
                          {i.aligned && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                        </button>
                        <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        {state.empire.length === 0 && <Card><p className="text-sm text-muted-foreground italic">Comece pela sua visão de 1 ano — depois derive metas, projetos e movimentos.</p></Card>}
      </div>
    </>
  );
}
