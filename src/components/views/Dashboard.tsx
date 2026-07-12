import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { ARCHETYPES } from "@/lib/archetypes";
import { ARCHETYPE_IMAGES } from "@/lib/archetype-images";
import { PageHeader, Chip, Button } from "@/components/ui-kit";
import type { ViewKey } from "@/components/AppShell";
import { ArrowRight, Crown, ScrollText, Sparkles, CheckSquare, BookHeart, Flower2 } from "lucide-react";

const PHRASES = [
  "Você não precisa se apressar. Você precisa se alinhar.",
  "O trono é interno. O resto é consequência.",
  "Escolha a versão que constrói, não a que apenas responde.",
  "Seu silêncio também é estratégia.",
  "O que você repete, você se torna.",
  "Sofisticação é saber o que recusar.",
  "Prosperidade cresce em solo de disciplina.",
];

function dayOfYear(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export function DashboardView({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  const { state } = useStore();

  const today = new Date().toISOString().slice(0, 10);
  const dayIdx = dayOfYear();
  const phrase = PHRASES[dayIdx % PHRASES.length];
  const archetype = ARCHETYPES[dayIdx % ARCHETYPES.length];

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Boa madrugada" : hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const name = state.profile.name || "Juliana";

  const dailyDone = state.checklist.filter((c) => c.doneOn.includes(today)).length;
  const dailyTotal = state.checklist.length;
  const dailyPct = dailyTotal ? Math.round((dailyDone / dailyTotal) * 100) : 0;

  const weeklyPct = useMemo(() => {
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return d.toISOString().slice(0, 10);
    });
    const total = state.checklist.length * 7;
    if (!total) return 0;
    const done = state.checklist.reduce((a, c) => a + c.doneOn.filter((d) => last7.includes(d)).length, 0);
    return Math.round((done / total) * 100);
  }, [state.checklist]);

  const priorities = state.tasks
    .filter((t) => !t.done)
    .sort((a, b) => {
      const rank = { crítica: 0, alta: 1, média: 2, baixa: 3 } as const;
      return rank[a.importance] - rank[b.importance];
    })
    .slice(0, 4);

  const heroImg = ARCHETYPE_IMAGES[archetype.id];

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        title={`${greeting}, ${name}.`}
        subtitle="Qual é a melhor versão da Juliana para este momento?"
      />

      {/* Hero emocional */}
      <div className="relative glass-card overflow-hidden mb-5 anim-fade-up">
        {heroImg && (
          <div className="absolute inset-0">
            <img src={heroImg} alt="" className="w-full h-full object-cover opacity-30 anim-float" loading="lazy" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
          </div>
        )}
        <div className="relative p-6 md:p-10 max-w-2xl">
          <Chip>Frase do dia</Chip>
          <p className="mt-4 font-display text-[26px] md:text-4xl leading-snug anim-fade-up" style={{ animationDelay: "140ms" }}>"{phrase}"</p>
          <div className="mt-6 w-32 h-px shimmer rounded-full" />
          <div className="mt-6 anim-fade-up" style={{ animationDelay: "260ms" }}>
            <Chip tone="wine">Arquétipo do dia</Chip>
            <div className="mt-3">
              <div className="font-display text-2xl md:text-3xl">
                Hoje a Juliana precisa ser… <span className="gold-text">{archetype.name}</span>
              </div>
              <p className="mt-2 text-muted-foreground text-sm max-w-xl leading-relaxed">
                {archetype.tagline}. {archetype.narrative}
              </p>
              <p className="mt-3 italic text-sm gold-text">"{archetype.activation}"</p>
            </div>
            <Button variant="outline" className="mt-5" onClick={() => onNavigate("arquetipos")}>
              Consultar arquétipos <ArrowRight className="inline w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Rail horizontal de arquétipos */}
      <div className="mb-6 anim-fade-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <div className="text-[10px] uppercase tracking-[0.3em] gold-text">Panteão</div>
          <button onClick={() => onNavigate("arquetipos")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">ver biblioteca →</button>
        </div>
        <div className="-mx-5 md:-mx-10 px-5 md:px-10 scroll-x scroll-x-fade flex gap-3 pb-3">
          {ARCHETYPES.map((a, i) => (
            <button
              key={a.id}
              onClick={() => onNavigate("arquetipos")}
              className="snap-card relative w-[140px] h-[180px] rounded-xl overflow-hidden gold-border group hover-lift hover-glow-img anim-fade-up"
              style={{ animationDelay: `${300 + i * 70}ms` }}
            >
              {ARCHETYPE_IMAGES[a.id] && (
                <img src={ARCHETYPE_IMAGES[a.id]} alt={a.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
              <div className="absolute left-3 right-3 bottom-3">
                <div className="font-display text-lg leading-tight">{a.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">{a.tagline.split(",")[0]}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progresso + prioridades */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass-card p-6 hover-lift anim-fade-up" style={{ animationDelay: "340ms" }}>
          <Chip>Progresso</Chip>
          <div className="mt-4 space-y-5">
            <ProgressBar label="Hoje" value={dailyPct} caption={`${dailyDone}/${dailyTotal} rituais`} />
            <ProgressBar label="Últimos 7 dias" value={weeklyPct} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <Stat label="Tarefas ativas" value={state.tasks.filter((t) => !t.done).length} />
            <Stat label="Concluídas" value={state.tasks.filter((t) => t.done).length} />
          </div>
        </div>

        <div className="glass-card p-6 hover-lift anim-fade-up" style={{ animationDelay: "420ms" }}>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <Chip>Prioridades</Chip>
              <h3 className="font-display text-2xl mt-3 truncate">O que pede sua presença</h3>
            </div>
            <Button variant="ghost" onClick={() => onNavigate("tarefas")}>Ver tudo</Button>
          </div>
          <ul className="mt-4 space-y-2">
            {priorities.length === 0 && (
              <li className="text-sm text-muted-foreground italic">Nenhuma prioridade cadastrada. Comece pela mais leve.</li>
            )}
            {priorities.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-secondary/60 border border-border">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.importance}{t.deadline ? ` · até ${t.deadline}` : ""}</div>
                </div>
                {t.archetype && <Chip>{t.archetype}</Chip>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Atalhos */}
      <div className="glass-card p-6 mt-5 anim-fade-up" style={{ animationDelay: "500ms" }}>
        <Chip>Atalhos</Chip>
        <h3 className="font-display text-2xl mt-3">Portas rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 anim-stagger">
          <Shortcut icon={CheckSquare} label="Nova tarefa" onClick={() => onNavigate("tarefas")} />
          <Shortcut icon={Crown} label="Conselho Soberano" onClick={() => onNavigate("conselho")} />
          <Shortcut icon={Sparkles} label="Consultar arquétipo" onClick={() => onNavigate("arquetipos")} />
          <Shortcut icon={BookHeart} label="Escrever diário" onClick={() => onNavigate("diario")} />
          <Shortcut icon={ScrollText} label="Revisar Constituição" onClick={() => onNavigate("constituicao")} />
          <Shortcut icon={Flower2} label="Prática espiritual" onClick={() => onNavigate("espiritualidade")} />
        </div>
      </div>
    </>
  );
}

function Shortcut({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex flex-col items-start gap-2 p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-[color-mix(in_oklab,var(--gold)_35%,transparent)] hover-lift text-left">
      <Icon className="w-4 h-4 gold-text transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]" />
      <span className="text-sm">{label}</span>
    </button>
  );
}

function ProgressBar({ label, value, caption }: { label: string; value: number; caption?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-sm gold-text font-medium">{value}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-soft)] progress-fill" style={{ width: `${value}%` }} />
      </div>
      {caption && <div className="text-[11px] text-muted-foreground mt-1">{caption}</div>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-3 rounded-lg border border-border bg-secondary/50">
      <div className="font-display text-2xl gold-text">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
