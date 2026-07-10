import { useState } from "react";
import { useStore, uid } from "@/lib/store";
import { ARCHETYPES } from "@/lib/archetypes";
import { PageHeader, Card, Field, Input, Textarea, Button, Chip } from "@/components/ui-kit";
import { suggestArchetype } from "./Arquetipos";
import { Crown } from "lucide-react";

export function ConselhoView() {
  const { state, update } = useStore();
  const [situation, setSituation] = useState("");
  const [emotion, setEmotion] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<null | {
    responses: { archetypeId: string; question: string; answer: string }[];
    recommendation: string;
    principle: string;
    posture: string;
    activation: string;
  }>(null);

  function convene() {
    if (!situation.trim()) return;
    const recommended = suggestArchetype({ situation, emotion, goal });
    const responses = ARCHETYPES.map((a) => ({
      archetypeId: a.id,
      question: a.councilQuestion,
      answer: "", // reserved for future AI; user reflects
    }));
    const principle =
      state.constitution[Math.floor(Math.random() * Math.max(1, state.constitution.length))] || "";

    const recommendation = `Acesse ${recommended.name} para esta situação. ${recommended.tagline}. Pergunta central: ${recommended.councilQuestion}`;

    setResult({
      responses,
      recommendation,
      principle,
      posture: recommended.posture,
      activation: recommended.activation,
    });
  }

  function save() {
    if (!result) return;
    update((s) => ({
      ...s,
      council: [
        { id: uid(), date: Date.now(), situation, emotion, goal, responses: result.responses, recommendation: result.recommendation },
        ...s.council,
      ].slice(0, 100),
    }));
    setSituation(""); setEmotion(""); setGoal(""); setResult(null);
  }

  return (
    <>
      <PageHeader
        eyebrow="Comando"
        title="Conselho Soberano"
        subtitle="Traga uma situação. Os arquétipos oferecem perspectivas — você decide."
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <div className="space-y-4">
            <Field label="Situação / decisão / tarefa">
              <Textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="Recebi uma proposta de parceria…" />
            </Field>
            <Field label="Emoção atual">
              <Input value={emotion} onChange={(e) => setEmotion(e.target.value)} placeholder="Ansiedade, empolgação, dúvida…" />
            </Field>
            <Field label="Objetivo real">
              <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="O que quero desta situação?" />
            </Field>
            <Button onClick={convene} className="w-full"><Crown className="inline w-4 h-4 mr-2 -mt-0.5" />Convocar Conselho</Button>
          </div>
        </Card>

        <Card>
          {!result && (
            <div className="text-sm text-muted-foreground italic h-full flex items-center justify-center text-center min-h-[280px]">
              Descreva a situação para receber as perspectivas do Conselho.
            </div>
          )}
          {result && (
            <div className="space-y-5">
              <div>
                <Chip>Perspectivas</Chip>
                <ul className="mt-3 space-y-3">
                  {result.responses.map((r) => {
                    const a = ARCHETYPES.find((x) => x.id === r.archetypeId)!;
                    return (
                      <li key={r.archetypeId} className="p-3 rounded-md bg-secondary/50 border border-border">
                        <div className="font-display text-lg gold-text">{a.name}</div>
                        <div className="text-sm text-muted-foreground italic">"{r.question}"</div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="gold-divider" />
              <div>
                <Chip tone="wine">Recomendação</Chip>
                <p className="mt-2 text-sm">{result.recommendation}</p>
                <p className="mt-3 text-sm"><strong className="gold-text">Postura:</strong> {result.posture}</p>
                <p className="mt-2 italic gold-text">"{result.activation}"</p>
                {result.principle && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    <strong>Do seu Código Soberano:</strong> {result.principle}
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={save} className="w-full">Salvar consulta</Button>
            </div>
          )}
        </Card>
      </div>

      {state.council.length > 0 && (
        <div className="mt-8">
          <h3 className="font-display text-2xl mb-4">Consultas anteriores</h3>
          <div className="space-y-3">
            {state.council.slice(0, 10).map((c) => (
              <Card key={c.id}>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(c.date).toLocaleString("pt-BR")}
                </div>
                <div className="mt-1 text-sm">{c.situation}</div>
                <p className="mt-2 text-xs gold-text italic">{c.recommendation}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
