import { useState } from "react";
import { useStore } from "@/lib/store";
import { ARCHETYPES, type Archetype } from "@/lib/archetypes";
import { ARCHETYPE_IMAGES } from "@/lib/archetype-images";
import { PageHeader, Chip, Textarea } from "@/components/ui-kit";
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

      {/* Horizontal rail on mobile, grid on desktop */}
      <div className="lg:hidden -mx-5 px-5 scroll-x flex gap-4 pb-4">
        {ARCHETYPES.map((a) => (
          <ArchetypeCard key={a.id} a={a} onOpen={() => setOpenId(a.id)} className="snap-card w-[78%] max-w-[320px]" />
        ))}
      </div>

      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-5">
        {ARCHETYPES.map((a) => (
          <ArchetypeCard key={a.id} a={a} onOpen={() => setOpenId(a.id)} />
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpenId(null)}>
          <div onClick={(e) => e.stopPropagation()} className="glass-card p-6 md:p-8 max-w-2xl w-full my-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Chip>Arquétipo</Chip>
                <h2 className="font-display text-4xl md:text-5xl mt-2 truncate">{open.name}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{open.tagline}</p>
              </div>
              <button onClick={() => setOpenId(null)} className="text-muted-foreground hover:text-foreground shrink-0"><X className="w-5 h-5" /></button>
            </div>
            {ARCHETYPE_IMAGES[open.id] && (
              <div className="mt-5 rounded-xl overflow-hidden gold-border">
                <img src={ARCHETYPE_IMAGES[open.id]} alt={open.name} className="w-full h-56 md:h-72 object-cover" loading="lazy" />
              </div>
            )}
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

function ArchetypeCard({ a, onOpen, className = "" }: { a: Archetype; onOpen: () => void; className?: string }) {
  const img = ARCHETYPE_IMAGES[a.id];
  return (
    <button
      onClick={onOpen}
      className={`group text-left glass-card overflow-hidden hover:border-[color-mix(in_oklab,var(--gold)_45%,transparent)] transition ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {img && (
          <img
            src={img}
            alt={a.name}
            className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute left-4 right-4 bottom-4">
          <div className="font-display text-3xl leading-tight">{a.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{a.tagline}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {a.symbols.slice(0, 3).map((s) => <Chip key={s} tone="muted">{s}</Chip>)}
        </div>
        <p className="mt-3 italic text-sm gold-text line-clamp-2">"{a.activation}"</p>
      </div>
    </button>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{label}</div>
      <div className="text-sm leading-relaxed">{children}</div>
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
