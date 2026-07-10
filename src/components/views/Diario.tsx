import { useState } from "react";
import { useStore, uid } from "@/lib/store";
import { PageHeader, Card, Field, Textarea, Button } from "@/components/ui-kit";
import { X } from "lucide-react";

export function DiarioView() {
  const { state, update } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const existing = state.diary.find((d) => d.date === today);

  const [achieved, setAchieved] = useState(existing?.achieved || "");
  const [learned, setLearned] = useState(existing?.learned || "");
  const [lostEnergy, setLostEnergy] = useState(existing?.lostEnergy || "");
  const [sovereign, setSovereign] = useState(existing?.sovereign || "");
  const [remember, setRemember] = useState(existing?.remember || "");

  function save() {
    update((s) => {
      const others = s.diary.filter((d) => d.date !== today);
      return { ...s, diary: [{ id: existing?.id || uid(), date: today, achieved, learned, lostEnergy, sovereign, remember }, ...others] };
    });
  }

  function remove(id: string) {
    update((s) => ({ ...s, diary: s.diary.filter((d) => d.id !== id) }));
  }

  return (
    <>
      <PageHeader eyebrow="Interior" title="Diário da Juliana" subtitle="Fecho consciente. Um retrato honesto do dia." />

      <Card>
        <div className="text-[10px] uppercase tracking-[0.3em] gold-text">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        <div className="mt-4 space-y-4">
          <Field label="Hoje consegui…"><Textarea value={achieved} onChange={(e) => setAchieved(e.target.value)} /></Field>
          <Field label="Hoje aprendi…"><Textarea value={learned} onChange={(e) => setLearned(e.target.value)} /></Field>
          <Field label="Hoje perdi energia quando…"><Textarea value={lostEnergy} onChange={(e) => setLostEnergy(e.target.value)} /></Field>
          <Field label="Hoje fui soberana quando…"><Textarea value={sovereign} onChange={(e) => setSovereign(e.target.value)} /></Field>
          <Field label="Amanhã preciso lembrar…"><Textarea value={remember} onChange={(e) => setRemember(e.target.value)} /></Field>
          <Button onClick={save}>Salvar entrada</Button>
        </div>
      </Card>

      {state.diary.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-2xl mb-4">Entradas anteriores</h3>
          <div className="space-y-3">
            {state.diary.filter((d) => d.date !== today).slice(0, 30).map((d) => (
              <Card key={d.id}>
                <div className="flex items-start justify-between">
                  <div className="text-[10px] uppercase tracking-widest gold-text">{new Date(d.date).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}</div>
                  <button onClick={() => remove(d.id)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                </div>
                <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
                  {d.achieved && <p><strong className="gold-text">Consegui:</strong> {d.achieved}</p>}
                  {d.learned && <p><strong className="gold-text">Aprendi:</strong> {d.learned}</p>}
                  {d.lostEnergy && <p><strong className="gold-text">Perdi energia:</strong> {d.lostEnergy}</p>}
                  {d.sovereign && <p><strong className="gold-text">Soberana:</strong> {d.sovereign}</p>}
                  {d.remember && <p className="md:col-span-2"><strong className="gold-text">Lembrar:</strong> {d.remember}</p>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
