import { useState } from "react";
import { useStore, uid } from "@/lib/store";
import { PageHeader, Card, Field, Input, Select, Textarea, Button, Chip } from "@/components/ui-kit";
import { Heart, HeartOff, X } from "lucide-react";

const CATS = ["proteção", "prosperidade", "coragem", "foco", "gratidão", "perdão", "paz"];

export function EspiritualidadeView() {
  const { state, update } = useStore();
  const [filter, setFilter] = useState<string>("todas");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: CATS[0], text: "", meaning: "", whenToUse: "", duration: "1 min" });

  function add() {
    if (!form.title.trim() || !form.text.trim()) return;
    update((s) => ({ ...s, prayers: [{ id: uid(), favorite: false, ...form }, ...s.prayers] }));
    setForm({ title: "", category: CATS[0], text: "", meaning: "", whenToUse: "", duration: "1 min" });
    setOpen(false);
  }
  function toggleFav(id: string) {
    update((s) => ({ ...s, prayers: s.prayers.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)) }));
  }
  function remove(id: string) {
    update((s) => ({ ...s, prayers: s.prayers.filter((p) => p.id !== id) }));
  }

  const items = state.prayers.filter((p) => filter === "todas" || p.category === filter);

  return (
    <>
      <PageHeader
        eyebrow="Práticas pessoais"
        title="Orações, mantras e rituais"
        subtitle="Biblioteca íntima. Interpretações pessoais — não afirmações factuais."
        action={<Button onClick={() => setOpen(!open)}>{open ? "Fechar" : "Adicionar prática"}</Button>}
      />

      {open && (
        <Card className="mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Título"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Categoria"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field label="Duração"><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></Field>
            <Field label="Quando usar"><Input value={form.whenToUse} onChange={(e) => setForm({ ...form, whenToUse: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Texto"><Textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><Field label="Significado pessoal"><Textarea value={form.meaning} onChange={(e) => setForm({ ...form, meaning: e.target.value })} /></Field></div>
          </div>
          <div className="mt-4"><Button onClick={add}>Adicionar</Button></div>
        </Card>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip active={filter === "todas"} onClick={() => setFilter("todas")}>Todas</FilterChip>
        {CATS.map((c) => <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</FilterChip>)}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((p) => (
          <Card key={p.id} className="relative">
            <div className="flex items-start justify-between">
              <div>
                <Chip>{p.category}</Chip>
                <h3 className="font-display text-2xl mt-2">{p.title}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleFav(p.id)} className="text-muted-foreground hover:gold-text">{p.favorite ? <Heart className="w-4 h-4 fill-current gold-text" /> : <HeartOff className="w-4 h-4" />}</button>
                <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="mt-3 font-display text-lg italic">"{p.text}"</p>
            {p.meaning && <p className="mt-3 text-xs text-muted-foreground"><strong className="gold-text">Significado:</strong> {p.meaning}</p>}
            <div className="mt-3 flex gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              {p.whenToUse && <span>{p.whenToUse}</span>}<span>·</span><span>{p.duration}</span>
            </div>
          </Card>
        ))}
        {items.length === 0 && <Card><p className="text-sm text-muted-foreground italic">Nenhuma prática nesta categoria.</p></Card>}
      </div>
    </>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest transition ${active ? "bg-primary text-primary-foreground" : "gold-border gold-text hover:bg-secondary"}`}>{children}</button>
  );
}
