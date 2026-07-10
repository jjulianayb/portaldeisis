import { useState } from "react";
import { useStore } from "@/lib/store";
import { ARCHETYPES, type Archetype } from "@/lib/archetypes";
import { PageHeader, Card, Chip, Textarea, Button } from "@/components/ui-kit";
import { X } from "lucide-react";

export function ArquetiposView() {
  const { state, update } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ARCHETYPES.find((a) => a.id === openId);

  return (
    <>
      <PageHeader
        eyebrow="Panteão pessoal"
        title="Biblioteca de arquétipos"
        subtitle="Referências simbólicas para acessar diferentes posturas conforme a situação. Não são crenças factuais — são lentes."
      />

      <div className="grid md:grid-cols-2 gap-5">
        {ARCHETYPES.map((a) => (
          <button
            key={a.id}
            onClick={() => setOpenId(a.id)}
            className="text-left sanctum-card p-6 hover:border-[color-mix(in_oklab,var(--gold)_40%,transparent)] transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-3xl">{a.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{a.tagline}</div>
              </div>
            </div>
            <div className="gold-divider mt-4 mb-4" />
            <div className="flex flex-wrap gap-1.5">
              {a.symbols.slice(0, 4).map((s) => <Chip key={s} tone="muted">{s}</Chip>)}
            </div>
            <p className="mt-4 italic text-sm gold-text">"{a.activation}"</p>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpenId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="sanctum-card p-8 max-w-2xl w-full my-8">
            <div className="flex items-start justify-between">
              <div>
                <Chip>Arquétipo</Chip>
                <h2 className="font-display text-5xl mt-2">{open.name}</h2>
                <p className="text-muted-foreground mt-1">{open.tagline}</p>
              </div>
              <button onClick={() => setOpenId(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="gold-divider my-6" />

            <Detail label="Narrativa simbólica">{open.narrative}</Detail>
            <Detail label="Quando acessar">
              <ul className="list-disc list-inside space-y-1 text-sm">
                {open.uses.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </Detail>
            <Detail label="Postura & comportamento">{open.posture}</Detail>
            <Detail label="Vestimenta & objetos">
              <div className="flex flex-wrap gap-2 mt-1">{open.objects.map((o) => <Chip key={o} tone="muted">{o}</Chip>)}</div>
            </Detail>
            <Detail label="Frase de ativação"><span className="italic gold-text">"{open.activation}"</span></Detail>
            <Detail label="Sombra a observar">
              <div className="flex flex-wrap gap-2 mt-1">{open.shadow.map((s) => <Chip key={s} tone="wine">{s}</Chip>)}</div>
            </Detail>
            <ArchNotes id={open.id} value={state.archetypeNotes[open.id] || ""} onChange={(v) => update((s) => ({ ...s, archetypeNotes: { ...s.archetypeNotes, [open.id]: v } }))} />
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function ArchNotes({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Minhas notas pessoais</div>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={`Como ${id} aparece na minha vida?`} />
    </div>
  );
}

export function suggestArchetype(input: { emotion: string; goal: string; situation: string }): Archetype {
  const text = (input.emotion + " " + input.goal + " " + input.situation).toLowerCase();
  if (/(negocia|reuni|contrat|estrat|venda|alian|decis)/.test(text)) return ARCHETYPES.find((a) => a.id === "cleopatra")!;
  if (/(n[aã]o|limite|corta|proteger energia|cobrar)/.test(text)) return ARCHETYPES.find((a) => a.id === "medb")!;
  if (/(criar|conte[uú]do|evento|comunica|social|beleza)/.test(text)) return ARCHETYPES.find((a) => a.id === "afrodite")!;
  if (/(procrast|come[çc]ar|atrasada|execu|sprint|movimento)/.test(text)) return ARCHETYPES.find((a) => a.id === "cavalo")!;
  if (/(longo prazo|construir|patrim[oô]nio|expans|projeto grande)/.test(text)) return ARCHETYPES.find((a) => a.id === "arvore")!;
  return ARCHETYPES.find((a) => a.id === "isis")!;
}
