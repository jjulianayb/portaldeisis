import { useState } from "react";
import { useStore, uid } from "@/lib/store";
import { PageHeader, Card, Field, Input, Textarea, Button } from "@/components/ui-kit";
import { X } from "lucide-react";

export function RedeView() {
  const { state, update } = useStore();
  const [form, setForm] = useState({ name: "", area: "", relationship: "", potential: "", nextAction: "" });

  function add() {
    if (!form.name.trim()) return;
    update((s) => ({ ...s, contacts: [{ id: uid(), ...form }, ...s.contacts] }));
    setForm({ name: "", area: "", relationship: "", potential: "", nextAction: "" });
  }
  function remove(id: string) {
    update((s) => ({ ...s, contacts: s.contacts.filter((c) => c.id !== id) }));
  }

  return (
    <>
      <PageHeader eyebrow="Prosperidade" title="Rede estratégica" subtitle="Um CRM pessoal — as relações que constroem o Império." />

      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Pessoa"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Área"><Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></Field>
          <Field label="Relacionamento"><Input value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} /></Field>
          <Field label="Potencial"><Input value={form.potential} onChange={(e) => setForm({ ...form, potential: e.target.value })} /></Field>
          <div className="md:col-span-2"><Field label="Próxima ação"><Textarea value={form.nextAction} onChange={(e) => setForm({ ...form, nextAction: e.target.value })} /></Field></div>
        </div>
        <div className="mt-3"><Button onClick={add}>Adicionar contato</Button></div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {state.contacts.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl">{c.name}</h3>
                {c.area && <div className="text-[10px] uppercase tracking-widest gold-text mt-1">{c.area}</div>}
              </div>
              <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              {c.relationship && <p><strong className="gold-text">Relacionamento:</strong> {c.relationship}</p>}
              {c.potential && <p><strong className="gold-text">Potencial:</strong> {c.potential}</p>}
              {c.nextAction && <p><strong className="gold-text">Próxima ação:</strong> {c.nextAction}</p>}
            </div>
          </Card>
        ))}
        {state.contacts.length === 0 && <Card><p className="text-sm text-muted-foreground italic">Comece pelos 5 contatos mais estratégicos.</p></Card>}
      </div>
    </>
  );
}
