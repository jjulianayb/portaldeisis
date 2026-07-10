import { useState } from "react";
import { useStore, uid, type Task } from "@/lib/store";
import { PageHeader, Card, Field, Input, Textarea, Select, Button, Chip } from "@/components/ui-kit";
import { suggestArchetype } from "./Arquetipos";
import { ARCHETYPES_BY_ID } from "@/lib/archetypes";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

export function TarefasView() {
  const { state, update } = useStore();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [deadline, setDeadline] = useState("");
  const [importance, setImportance] = useState<Task["importance"]>("média");
  const [emotion, setEmotion] = useState("");

  function suggested() {
    if (!title && !objective) return null;
    return suggestArchetype({ situation: title + " " + objective, emotion, goal: objective });
  }

  function add() {
    if (!title.trim()) return;
    const arch = suggested();
    const task: Task = {
      id: uid(), title, objective, deadline, importance, emotion,
      archetype: arch?.name, done: false, createdAt: Date.now(),
    };
    update((s) => ({ ...s, tasks: [task, ...s.tasks] }));
    setTitle(""); setObjective(""); setDeadline(""); setImportance("média"); setEmotion("");
    setOpen(false);
  }

  function toggle(t: Task) {
    update((s) => ({
      ...s,
      tasks: s.tasks.map((x) =>
        x.id === t.id ? { ...x, done: !x.done, completedAt: !x.done ? Date.now() : undefined } : x,
      ),
    }));
    if (!t.done) setExpandedId(t.id);
  }

  function remove(id: string) {
    update((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== id) }));
  }

  function setReview(id: string, key: "felt" | "worked" | "improve", value: string) {
    update((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, review: { felt: "", worked: "", improve: "", ...t.review, [key]: value } } : t)),
    }));
  }

  const active = state.tasks.filter((t) => !t.done);
  const done = state.tasks.filter((t) => t.done);
  const arch = suggested();

  return (
    <>
      <PageHeader
        eyebrow="Comando"
        title="Tarefas inteligentes"
        subtitle="Cada tarefa sugere o arquétipo ideal, a preparação e o comportamento."
        action={<Button onClick={() => setOpen(!open)}>{open ? "Fechar" : "Nova tarefa"}</Button>}
      />

      {open && (
        <Card className="mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Título"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
            <Field label="Prazo"><Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></Field>
            <Field label="Importância">
              <Select value={importance} onChange={(e) => setImportance(e.target.value as Task["importance"])}>
                <option value="baixa">Baixa</option><option value="média">Média</option>
                <option value="alta">Alta</option><option value="crítica">Crítica</option>
              </Select>
            </Field>
            <Field label="Emoção atual"><Input value={emotion} onChange={(e) => setEmotion(e.target.value)} placeholder="Ansiosa, animada, resistente…" /></Field>
            <div className="md:col-span-2">
              <Field label="Objetivo"><Textarea value={objective} onChange={(e) => setObjective(e.target.value)} /></Field>
            </div>
          </div>

          {arch && (
            <div className="mt-4 p-4 rounded-md gold-border bg-secondary/40">
              <Chip>Sugestão do sistema</Chip>
              <div className="mt-2 font-display text-xl">Acesse {arch.name}</div>
              <p className="text-sm text-muted-foreground mt-1">{arch.tagline}</p>
              <p className="text-sm mt-2"><strong className="gold-text">Preparação:</strong> {arch.posture}</p>
              <p className="text-sm mt-1 italic gold-text">"{arch.activation}"</p>
              {arch.id === "cavalo" && /ansi/.test(emotion.toLowerCase()) && (
                <p className="text-xs text-[color-mix(in_oklab,var(--ivory)_80%,var(--wine))] mt-2">
                  Nota: você está ansiosa — Cavalo com rédea, não com esporas. Respire antes de acelerar.
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2"><Button onClick={add}>Adicionar</Button><Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button></div>
        </Card>
      )}

      <div className="space-y-3">
        {active.length === 0 && <Card><p className="text-sm text-muted-foreground italic">Nenhuma tarefa ativa.</p></Card>}
        {active.map((t) => (
          <TaskCard key={t.id} t={t} expanded={expandedId === t.id} onToggleExpand={() => setExpandedId(expandedId === t.id ? null : t.id)}
            onDone={() => toggle(t)} onRemove={() => remove(t.id)} onReview={setReview} />
        ))}
      </div>

      {done.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-2xl mb-4">Concluídas</h3>
          <div className="space-y-3 opacity-70">
            {done.slice(0, 20).map((t) => (
              <TaskCard key={t.id} t={t} expanded={expandedId === t.id} onToggleExpand={() => setExpandedId(expandedId === t.id ? null : t.id)}
                onDone={() => toggle(t)} onRemove={() => remove(t.id)} onReview={setReview} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function TaskCard({ t, expanded, onToggleExpand, onDone, onRemove, onReview }: {
  t: Task; expanded: boolean; onToggleExpand: () => void; onDone: () => void; onRemove: () => void;
  onReview: (id: string, k: "felt" | "worked" | "improve", v: string) => void;
}) {
  const arch = t.archetype ? Object.values(ARCHETYPES_BY_ID).find((a) => a.name === t.archetype) : null;
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <button onClick={onDone} aria-label="concluir"
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${t.done ? "bg-primary border-primary" : "gold-border hover:bg-secondary"}`}>
          {t.done && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className={`font-medium truncate ${t.done ? "line-through text-muted-foreground" : ""}`}>{t.title}</div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.importance}</span>
            {t.deadline && <span className="text-[10px] text-muted-foreground">· {t.deadline}</span>}
            {t.archetype && <Chip>{t.archetype}</Chip>}
          </div>
        </div>
        <button onClick={onToggleExpand} className="text-muted-foreground p-1">{expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive p-1"><X className="w-4 h-4" /></button>
      </div>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4 bg-secondary/30">
          {t.objective && <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Objetivo</div><p className="text-sm">{t.objective}</p></div>}
          {arch && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Preparação</div>
              <p className="text-sm">{arch.posture}</p>
              <p className="text-sm italic gold-text mt-1">"{arch.activation}"</p>
              <ul className="mt-2 text-sm list-disc list-inside text-muted-foreground">
                <li>Revisar objetivo em uma frase</li><li>Definir perguntas-chave</li><li>Ouvir mais do que falar</li>
              </ul>
            </div>
          )}
          {t.done && (
            <div className="space-y-3">
              <div className="gold-divider" />
              <div className="text-[10px] uppercase tracking-widest gold-text">Revisão</div>
              <Field label="Como me senti?"><Textarea value={t.review?.felt || ""} onChange={(e) => onReview(t.id, "felt", e.target.value)} /></Field>
              <Field label="O que funcionou?"><Textarea value={t.review?.worked || ""} onChange={(e) => onReview(t.id, "worked", e.target.value)} /></Field>
              <Field label="O que melhorar?"><Textarea value={t.review?.improve || ""} onChange={(e) => onReview(t.id, "improve", e.target.value)} /></Field>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
