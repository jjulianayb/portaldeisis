import { useStore } from "@/lib/store";
import { PageHeader, Card, Field, Input, Textarea, Chip } from "@/components/ui-kit";
import { calcExpression, calcLifePath, calcPersonality, calcSoul, MEANINGS } from "@/lib/numerology";

export function NumerologiaView() {
  const { state, update } = useStore();
  const p = state.profile;

  const lifePath = calcLifePath(p.birthDate);
  const expression = calcExpression(p.fullName);
  const soul = calcSoul(p.fullName);
  const personality = calcPersonality(p.fullName);

  return (
    <>
      <PageHeader
        eyebrow="Mapa simbólico"
        title="Numerologia pessoal"
        subtitle="Interpretação simbólica baseada em numerologia pitagórica — leitura pessoal, não afirmação científica."
      />

      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nome completo (como consta no registro)">
            <Input value={p.fullName} onChange={(e) => update((s) => ({ ...s, profile: { ...s.profile, fullName: e.target.value } }))} />
          </Field>
          <Field label="Data de nascimento">
            <Input type="date" value={p.birthDate} onChange={(e) => update((s) => ({ ...s, profile: { ...s.profile, birthDate: e.target.value } }))} />
          </Field>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <NumberCard label="Caminho de Vida" value={lifePath} />
        <NumberCard label="Expressão" value={expression} />
        <NumberCard label="Alma" value={soul} />
        <NumberCard label="Personalidade" value={personality} />
      </div>

      <Card className="mt-6">
        <div className="text-[10px] uppercase tracking-[0.3em] gold-text">Notas pessoais</div>
        <Textarea className="mt-3" value={state.numerologyNotes} onChange={(e) => update((s) => ({ ...s, numerologyNotes: e.target.value }))} placeholder="Como esses números se manifestam na minha vida?" />
      </Card>

      <p className="mt-6 text-xs text-muted-foreground text-center italic">
        Numerologia é tradição simbólica. Use como espelho de reflexão, não como diagnóstico.
      </p>
    </>
  );
}

function NumberCard({ label, value }: { label: string; value: number }) {
  const meaning = MEANINGS[value];
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <Chip>{label}</Chip>
          {meaning && <h3 className="font-display text-2xl mt-2">{meaning.name}</h3>}
        </div>
        <div className="font-display text-6xl gold-text leading-none">{value || "—"}</div>
      </div>
      {meaning && (
        <div className="mt-4 space-y-2 text-sm">
          <p><strong className="gold-text">Pontos fortes:</strong> {meaning.strengths}</p>
          <p><strong className="gold-text">Desafios:</strong> {meaning.challenges}</p>
          <p><strong className="gold-text">Arquétipo relacionado:</strong> {meaning.archetype}</p>
        </div>
      )}
      {!meaning && <p className="mt-4 text-sm text-muted-foreground italic">Preencha nome e data para calcular.</p>}
    </Card>
  );
}
