import { useStore, type Profile } from "@/lib/store";
import { PageHeader, Card, Field, Input, Textarea } from "@/components/ui-kit";

const SECTIONS: { title: string; fields: { key: keyof Profile; label: string; multi?: boolean; hint?: string }[] }[] = [
  {
    title: "Identidade",
    fields: [
      { key: "name", label: "Como quero ser chamada" },
      { key: "fullName", label: "Nome completo (para numerologia)" },
      { key: "birthDate", label: "Data de nascimento" },
      { key: "story", label: "Minha história pessoal", multi: true },
      { key: "phase", label: "Fase atual da vida", multi: true },
      { key: "becoming", label: "Quem estou me tornando", multi: true },
      { key: "values", label: "Meus valores principais", multi: true },
    ],
  },
  {
    title: "Visão & Legado",
    fields: [
      { key: "mission", label: "Minha missão", multi: true },
      { key: "legacy", label: "Meu legado", multi: true },
      { key: "vision1y", label: "Visão de 1 ano", multi: true },
      { key: "vision3y", label: "Visão de 3 anos", multi: true },
      { key: "vision10y", label: "Visão de 10 anos", multi: true },
    ],
  },
  {
    title: "Objetivos",
    fields: [
      { key: "goalsProfessional", label: "Profissionais", multi: true },
      { key: "goalsFinancial", label: "Financeiros", multi: true },
      { key: "goalsPersonal", label: "Pessoais", multi: true },
      { key: "goalsSpiritual", label: "Espirituais", multi: true },
    ],
  },
];

export function PerfilView() {
  const { state, update } = useStore();
  const set = (k: keyof Profile, v: string) => update((s) => ({ ...s, profile: { ...s.profile, [k]: v } }));

  return (
    <>
      <PageHeader
        eyebrow="DNA pessoal"
        title="Perfil da Juliana"
        subtitle="A base do sistema. Tudo aqui alimenta as sugestões do Conselho, do Diário e da Numerologia."
      />
      <div className="space-y-6">
        {SECTIONS.map((sec) => (
          <Card key={sec.title}>
            <h2 className="font-display text-2xl mb-1">{sec.title}</h2>
            <div className="gold-divider w-16 mb-6" />
            <div className="grid md:grid-cols-2 gap-5">
              {sec.fields.map((f) => (
                <div key={f.key} className={f.multi ? "md:col-span-2" : ""}>
                  <Field label={f.label} hint={f.hint}>
                    {f.multi ? (
                      <Textarea value={state.profile[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} />
                    ) : (
                      <Input
                        type={f.key === "birthDate" ? "date" : "text"}
                        value={state.profile[f.key] || ""}
                        onChange={(e) => set(f.key, e.target.value)}
                      />
                    )}
                  </Field>
                </div>
              ))}
            </div>
          </Card>
        ))}
        <p className="text-xs text-muted-foreground text-center">Alterações são salvas automaticamente neste dispositivo.</p>
      </div>
    </>
  );
}
