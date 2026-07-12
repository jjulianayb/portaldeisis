import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Field, Input, Textarea, Chip, Button } from "@/components/ui-kit";
import {
  calcExpression, calcSoul, calcPersonality, calcFirstName, calcLastName,
  calcCornerstone, calcFirstVowel, calcBalance, calcKarmicLessons, calcHiddenTendencies,
  calcLifePath, calcBirthDay, calcMaturity, calcRationalThought,
  calcLifeCycles, calcDecisiveMoments, calcChallenges, calcPinnacles,
  calcPersonalYear, calcPersonalMonth, calcPersonalDay,
  findNegativeSequences, dominantArcanumByAge,
  MEANINGS, PERSONAL_YEAR_MEANING,
  JULIANA_NATAL, JULIANA_HISTORICAL_YEARS, JULIANA_READINGS,
} from "@/lib/numerology";

type Tab = "geral" | "natal" | "ciclos" | "atual" | "triangulo" | "prosperidade" | "notas";

const TABS: { id: Tab; label: string }[] = [
  { id: "geral", label: "Visão Geral" },
  { id: "natal", label: "Mapa Natal" },
  { id: "ciclos", label: "Ciclos" },
  { id: "atual", label: "Ano · Mês · Dia" },
  { id: "triangulo", label: "Triângulo da Vida" },
  { id: "prosperidade", label: "Relacionamentos & Prosperidade" },
  { id: "notas", label: "Notas Pessoais" },
];

export function NumerologiaView() {
  const { state, update } = useStore();
  const [tab, setTab] = useState<Tab>("geral");
  const p = state.profile;
  const num = state.numerology;

  const fullName = p.fullName || JULIANA_NATAL.fullName;
  const birthDate = p.birthDate || JULIANA_NATAL.birthDate;
  const nameForCalc = num.shortName?.trim() ? num.shortName : fullName;

  const today = new Date();
  const py = useMemo(() => calcPersonalYear(birthDate, today), [birthDate]);
  const pm = useMemo(() => calcPersonalMonth(birthDate, today), [birthDate]);
  const pdNum = useMemo(() => calcPersonalDay(birthDate, today), [birthDate]);

  const age = useMemo(() => {
    if (!birthDate) return 0;
    const [y, m, d] = birthDate.split("-").map(Number);
    const now = new Date();
    let a = now.getFullYear() - y;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) a--;
    return a;
  }, [birthDate]);

  const pinsAuto = useMemo(() => calcPinnacles(birthDate), [birthDate]);
  const pins = num.pinnacles ?? pinsAuto;
  const cycles = useMemo(() => calcLifeCycles(birthDate), [birthDate]);
  const moments = useMemo(() => calcDecisiveMoments(birthDate), [birthDate]);
  const challenges = useMemo(() => calcChallenges(birthDate), [birthDate]);
  const currentPin = pins.find((p) => age >= p.startAge && (p.endAge === null || age < p.endAge));
  const currentCycleIdx = age < cycles.boundaries[0] ? 0 : age < cycles.boundaries[1] ? 1 : 2;
  const currentCycleValue = cycles.values[currentCycleIdx];
  const dominant = dominantArcanumByAge(birthDate, age);

  const setNum = (patch: Partial<typeof num>) =>
    update((s) => ({ ...s, numerology: { ...s.numerology, ...patch } }));

  return (
    <>
      <PageHeader
        eyebrow="Santuário simbólico"
        title="Numerologia"
        subtitle="Mapa natal fixo, ciclos calculados agora, leitura simbólica. Não é ciência — é espelho para escolhas."
      />

      {/* Identidade base */}
      <Card className="mb-5">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Nome completo de nascimento" hint="Base do mapa natal fixo.">
            <Input value={p.fullName} placeholder={JULIANA_NATAL.fullName}
              onChange={(e) => update((s) => ({ ...s, profile: { ...s.profile, fullName: e.target.value } }))} />
          </Field>
          <Field label="Data de nascimento" hint="Base dos ciclos e cálculos dinâmicos.">
            <Input type="date" value={p.birthDate} placeholder={JULIANA_NATAL.birthDate}
              onChange={(e) => update((s) => ({ ...s, profile: { ...s.profile, birthDate: e.target.value } }))} />
          </Field>
          <Field label="Nome de uso / assinatura" hint="Vibração do nome social — opcional.">
            <Input value={num.shortName} placeholder="Juliana Camargo"
              onChange={(e) => setNum({ shortName: e.target.value })} />
          </Field>
        </div>
      </Card>

      {/* Tabs */}
      <div className="scroll-x scroll-x-fade -mx-5 px-5 mb-5 flex gap-2">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`snap-card px-4 py-2 rounded-full text-xs uppercase tracking-widest whitespace-nowrap transition ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground hover:border-[color-mix(in_oklab,var(--gold)_35%,transparent)]"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "geral" && (
        <Overview
          age={age}
          personalYear={py.value}
          personalMonth={pm.value}
          personalDay={pdNum}
          cycleValue={currentCycleValue}
          pinnacle={currentPin?.value ?? 0}
          dominant={dominant?.value ?? 0}
          onNavigate={setTab}
        />
      )}

      {tab === "natal" && (
        <NatalMap
          fullName={fullName}
          birthDate={birthDate}
          nameForCalc={nameForCalc}
        />
      )}

      {tab === "ciclos" && (
        <CyclesTab
          cycles={cycles}
          moments={moments}
          challenges={challenges}
          pinnacles={pins}
          pinnaclesAuto={pinsAuto}
          onOverride={(v) => setNum({ pinnacles: v })}
          age={age}
        />
      )}

      {tab === "atual" && (
        <CurrentTab py={py} pm={pm} pd={pdNum} />
      )}

      {tab === "triangulo" && (
        <TriangleTab fullName={fullName} age={age} dominant={dominant} />
      )}

      {tab === "prosperidade" && <ProsperityTab />}

      {tab === "notas" && (
        <NotesTab
          notes={state.numerologyNotes}
          onChange={(v) => update((s) => ({ ...s, numerologyNotes: v }))}
          sectionNotes={num.sectionNotes}
          onSection={(k, v) => setNum({ sectionNotes: { ...num.sectionNotes, [k]: v } })}
        />
      )}

      <Disclaimer />
    </>
  );
}

/* ============================================================
   Visão Geral
   ============================================================ */
function Overview({ age, personalYear, personalMonth, personalDay, cycleValue, pinnacle, dominant, onNavigate }: {
  age: number; personalYear: number; personalMonth: number; personalDay: number;
  cycleValue: number; pinnacle: number; dominant: number; onNavigate: (t: Tab) => void;
}) {
  const pyRead = PERSONAL_YEAR_MEANING[personalYear];
  const central = MEANINGS[personalYear];

  return (
    <>
      <div className="glass-card p-6 md:p-8 mb-5">
        <Chip>Momento presente</Chip>
        <div className="mt-4 grid md:grid-cols-3 gap-6">
          <BigNumber label="Ano Pessoal" value={personalYear} caption={central?.name} />
          <BigNumber label="Mês Pessoal" value={personalMonth} />
          <BigNumber label="Dia Pessoal" value={personalDay} />
        </div>
        <div className="gold-divider my-6 w-40" />
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <MiniStat label="Idade" value={age || "—"} />
          <MiniStat label="Ciclo de Vida vigente" value={cycleValue || "—"} />
          <MiniStat label="Pináculo vigente" value={pinnacle || "—"} />
        </div>
      </div>

      {pyRead && (
        <div className="glass-card p-6 mb-5">
          <Chip tone="wine">Síntese do ano</Chip>
          <p className="mt-3 font-display text-xl md:text-2xl leading-snug">"{pyRead.theme}"</p>
          <div className="grid md:grid-cols-2 gap-4 mt-5 text-sm">
            <ReadingBlock label="Favorece" body={pyRead.do} tone="gold" />
            <ReadingBlock label="Evitar" body={pyRead.avoid} tone="wine" />
          </div>
          <p className="mt-5 text-sm italic text-muted-foreground">
            Ponto de atenção: reduza decisões movidas por ansiedade. Pergunte:{" "}
            <span className="gold-text not-italic">qual princípio da sua Constituição se aplica aqui?</span>
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => onNavigate("atual")}>Ver Ano · Mês · Dia</Button>
            <Button variant="ghost" onClick={() => onNavigate("natal")}>Ver Mapa Natal</Button>
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <Chip>Arcano dominante do momento</Chip>
        <div className="mt-4 flex items-start gap-6 flex-wrap">
          <div className="font-display text-7xl gold-text leading-none">{dominant || "—"}</div>
          <div className="flex-1 min-w-[220px]">
            {MEANINGS[dominant] ? (
              <>
                <div className="font-display text-2xl">{MEANINGS[dominant].name}</div>
                <p className="text-sm text-muted-foreground mt-1">{MEANINGS[dominant].keywords}</p>
                <p className="text-sm mt-3"><span className="gold-text">Força:</span> {MEANINGS[dominant].strengths}</p>
                <p className="text-sm mt-1"><span className="gold-text">Sombra:</span> {MEANINGS[dominant].challenges}</p>
              </>
            ) : <p className="text-sm text-muted-foreground italic">Preencha data de nascimento.</p>}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   Mapa Natal
   ============================================================ */
function NatalMap({ fullName, birthDate, nameForCalc }: { fullName: string; birthDate: string; nameForCalc: string }) {
  const isJuliana = fullName.trim().toLowerCase() === JULIANA_NATAL.fullName.toLowerCase()
    && birthDate === JULIANA_NATAL.birthDate;

  const calc = {
    diaNatalicio: calcBirthDay(birthDate),
    motivacao: calcSoul(fullName),
    impressao: calcPersonality(fullName),
    expressao: calcExpression(fullName),
    numeroChave: calcFirstName(fullName),
    numeroSobrenome: calcLastName(fullName),
    pedraAngular: calcCornerstone(fullName),
    desejoInstintivo: calcFirstVowel(fullName),
    talentoOculto: calcCornerstone(fullName), // aproximação
    destino: calcLifePath(birthDate),
    maturidade: calcMaturity(fullName, birthDate),
    pensamentoRacional: calcRationalThought(fullName, birthDate),
    equilibrio: calcBalance(fullName),
    licoesCarmicas: calcKarmicLessons(fullName),
    tendenciasOcultas: calcHiddenTendencies(fullName),
    respostaSubconsciente: 9 - calcKarmicLessons(fullName).length, // regra clássica
  };

  const historic = isJuliana ? JULIANA_NATAL : null;

  const row = (label: string, natal: number | number[] | undefined, current: number | number[] | undefined) => (
    <NatalRow key={label} label={label} historic={natal} current={current} />
  );

  return (
    <>
      {isJuliana && (
        <div className="glass-soft p-4 mb-5 text-xs">
          <span className="gold-text uppercase tracking-widest mr-2">Fonte:</span>
          Laudo natal fixo da Juliana Silva Camargo de Pinho + recálculo agora. Divergências são mostradas lado a lado.
        </div>
      )}

      <div className="glass-card overflow-hidden mb-5">
        <div className="grid grid-cols-[1fr,auto,auto] gap-x-4 gap-y-2 p-5 text-sm">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Número</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-right">Laudo</div>
          <div className="text-[10px] uppercase tracking-widest gold-text text-right">Cálculo atual</div>
          {row("Dia Natalício", historic?.diaNatalicio, calc.diaNatalicio)}
          {row("Motivação (Alma)", historic?.motivacao, calc.motivacao)}
          {row("Impressão (Personalidade)", historic?.impressao, calc.impressao)}
          {row("Expressão / Missão da Alma", historic?.expressao, calc.expressao)}
          {row("Número Chave (prenome)", undefined, calc.numeroChave)}
          {row("Número do Sobrenome", undefined, calc.numeroSobrenome)}
          {row("Pedra Angular", undefined, calc.pedraAngular)}
          {row("Desejo Instintivo", undefined, calc.desejoInstintivo)}
          {row("Talento Oculto", historic?.talentoOculto, calc.talentoOculto)}
          {row("Destino / Estrada da Vida", historic?.destino, calc.destino)}
          {row("Maturidade / Quintessência", undefined, calc.maturidade)}
          {row("Pensamento Racional", undefined, calc.pensamentoRacional)}
          {row("Equilíbrio", undefined, calc.equilibrio)}
          {row("Resposta Subconsciente", historic?.respostaSubconsciente, calc.respostaSubconsciente)}
          {row("Lições Cármicas", historic?.licoesCarmicas as unknown as number[], calc.licoesCarmicas)}
          {row("Tendências Ocultas", historic?.tendenciasOcultas as unknown as number[], calc.tendenciasOcultas)}
          {historic?.dividaCarmica ? row("Dívida Cármica", historic.dividaCarmica, undefined) : null}
        </div>
      </div>

      {nameForCalc !== fullName && (
        <div className="glass-soft p-4 mb-5 text-xs text-muted-foreground">
          Vibração do nome de uso <span className="gold-text">"{nameForCalc}"</span>: Expressão{" "}
          <span className="gold-text">{calcExpression(nameForCalc)}</span> · Alma{" "}
          <span className="gold-text">{calcSoul(nameForCalc)}</span> · Personalidade{" "}
          <span className="gold-text">{calcPersonality(nameForCalc)}</span>
        </div>
      )}

      {/* Leituras fixas quando é Juliana */}
      {isJuliana && (
        <div className="glass-card p-6">
          <Chip>Leituras do laudo</Chip>
          <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
            {Object.entries(JULIANA_READINGS).map(([k, v]) => (
              <div key={k} className="p-3 rounded-md bg-secondary/50 border border-border">
                <div className="gold-text text-[11px] uppercase tracking-widest mb-1">{k}</div>
                <div>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function NatalRow({ label, historic, current }: { label: string; historic?: number | number[]; current?: number | number[] }) {
  const fmt = (v: number | number[] | undefined) => {
    if (v === undefined || v === null) return "—";
    if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
    return v || "—";
  };
  const eq = JSON.stringify(historic ?? null) === JSON.stringify(current ?? null);
  return (
    <>
      <div className="text-sm py-1.5 border-t border-border">{label}</div>
      <div className="text-sm py-1.5 border-t border-border text-right text-muted-foreground">{fmt(historic)}</div>
      <div className={`text-sm py-1.5 border-t border-border text-right font-medium ${historic !== undefined && !eq ? "text-[color-mix(in_oklab,var(--wine)_70%,var(--foreground))]" : "gold-text"}`}>
        {fmt(current)}
      </div>
    </>
  );
}

/* ============================================================
   Ciclos
   ============================================================ */
function CyclesTab({ cycles, moments, challenges, pinnacles, pinnaclesAuto, onOverride, age }: {
  cycles: ReturnType<typeof calcLifeCycles>;
  moments: [number, number, number, number];
  challenges: [number, number, number, number];
  pinnacles: { value: number; startAge: number; endAge: number | null }[];
  pinnaclesAuto: { value: number; startAge: number; endAge: number | null }[];
  onOverride: (v: { value: number; startAge: number; endAge: number | null }[] | null) => void;
  age: number;
}) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(pinnacles);

  return (
    <>
      <div className="glass-card p-6 mb-5">
        <Chip>Ciclos de Vida</Chip>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {cycles.values.map((v, i) => (
            <div key={i} className={`p-4 rounded-lg border ${i === (age < cycles.boundaries[0] ? 0 : age < cycles.boundaries[1] ? 1 : 2) ? "gold-border bg-secondary/60" : "border-border bg-secondary/30"}`}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {i === 0 ? "Formação" : i === 1 ? "Produção" : "Colheita"}
              </div>
              <div className="font-display text-4xl gold-text mt-1">{v}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {i === 0 ? `até ${cycles.boundaries[0]} anos` : i === 1 ? `${cycles.boundaries[0]}–${cycles.boundaries[1]} anos` : `${cycles.boundaries[1]}+ anos`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Chip>Pináculos</Chip>
          <div className="flex gap-2">
            {edit ? (
              <>
                <Button variant="outline" onClick={() => { setDraft(pinnaclesAuto); onOverride(null); setEdit(false); }}>Restaurar automático</Button>
                <Button onClick={() => { onOverride(draft); setEdit(false); }}>Salvar</Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => { setDraft(pinnacles); setEdit(true); }}>Editar manualmente</Button>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {(edit ? draft : pinnacles).map((p, i) => {
            const active = age >= p.startAge && (p.endAge === null || age < p.endAge);
            return (
              <div key={i} className={`p-4 rounded-lg border ${active ? "gold-border bg-secondary/60" : "border-border bg-secondary/30"}`}>
                {edit ? (
                  <div className="grid grid-cols-4 gap-2">
                    <Field label={`Pináculo ${i + 1}`}>
                      <Input type="number" value={p.value} onChange={(e) => {
                        const v = parseInt(e.target.value) || 0;
                        setDraft(draft.map((d, idx) => idx === i ? { ...d, value: v } : d));
                      }} />
                    </Field>
                    <Field label="Início (anos)">
                      <Input type="number" value={p.startAge} onChange={(e) => {
                        const v = parseInt(e.target.value) || 0;
                        setDraft(draft.map((d, idx) => idx === i ? { ...d, startAge: v } : d));
                      }} />
                    </Field>
                    <Field label="Fim (anos)">
                      <Input type="number" value={p.endAge ?? ""} placeholder="—" onChange={(e) => {
                        const v = e.target.value === "" ? null : parseInt(e.target.value) || 0;
                        setDraft(draft.map((d, idx) => idx === i ? { ...d, endAge: v } : d));
                      }} />
                    </Field>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Pináculo {i + 1}</div>
                      <div className="font-display text-3xl gold-text">{p.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.startAge} → {p.endAge ?? "∞"} anos
                      </div>
                    </div>
                    {MEANINGS[p.value] && (
                      <div className="text-right text-sm max-w-xs">
                        <div className="font-display text-lg">{MEANINGS[p.value].name}</div>
                        <div className="text-xs text-muted-foreground">{MEANINGS[p.value].keywords}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass-card p-6">
          <Chip>Momentos Decisivos</Chip>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {moments.map((m, i) => (
              <div key={i} className="text-center p-3 rounded-md bg-secondary/50 border border-border">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">M{i + 1}</div>
                <div className="font-display text-3xl gold-text">{m}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <Chip tone="wine">Desafios</Chip>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {challenges.map((c, i) => (
              <div key={i} className="text-center p-3 rounded-md bg-secondary/50 border border-border">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">D{i + 1}</div>
                <div className="font-display text-3xl gold-text">{c}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   Ano · Mês · Dia
   ============================================================ */
function CurrentTab({ py, pm, pd }: {
  py: { value: number; startISO: string; endISO: string };
  pm: { value: number; monthLabel: string };
  pd: number;
}) {
  const pyRead = PERSONAL_YEAR_MEANING[py.value];
  const pmRead = PERSONAL_YEAR_MEANING[pm.value];
  const pdRead = PERSONAL_YEAR_MEANING[pd];

  return (
    <>
      <div className="glass-card p-6 mb-5">
        <div className="grid md:grid-cols-3 gap-6">
          <BigNumber label={`Ano Pessoal · ${py.startISO} → ${py.endISO}`} value={py.value} caption={MEANINGS[py.value]?.name} />
          <BigNumber label={`Mês Pessoal · ${pm.monthLabel}`} value={pm.value} caption={MEANINGS[pm.value]?.name} />
          <BigNumber label={`Dia Pessoal · hoje`} value={pd} caption={MEANINGS[pd]?.name} />
        </div>
      </div>

      {pyRead && <CycleReadCard title={`Ano Pessoal ${py.value}`} r={pyRead} />}
      {pmRead && <CycleReadCard title={`Mês Pessoal ${pm.value}`} r={pmRead} />}
      {pdRead && <CycleReadCard title={`Dia Pessoal ${pd}`} r={pdRead} />}

      <div className="glass-card p-6 mt-5">
        <Chip>Histórico do laudo (referência)</Chip>
        <div className="mt-4 space-y-2 text-sm">
          {JULIANA_HISTORICAL_YEARS.map((h, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-secondary/40 border border-border">
              <div className="font-display text-2xl gold-text w-8 text-center">{h.personalYear}</div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{h.period}</div>
                <div>{h.note}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground italic">Histórico do laudo original. Compare com o cálculo atual acima.</p>
      </div>
    </>
  );
}

function CycleReadCard({ title, r }: { title: string; r: { theme: string; do: string; avoid: string } }) {
  return (
    <div className="glass-card p-6 mb-4">
      <div className="text-[10px] uppercase tracking-[0.3em] gold-text">{title}</div>
      <p className="mt-2 font-display text-xl leading-snug">"{r.theme}"</p>
      <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
        <ReadingBlock label="Favorece" body={r.do} tone="gold" />
        <ReadingBlock label="Evitar" body={r.avoid} tone="wine" />
      </div>
    </div>
  );
}

/* ============================================================
   Triângulo da Vida
   ============================================================ */
function TriangleTab({ fullName, age, dominant }: {
  fullName: string; age: number;
  dominant: { value: number; startAge: number; endAge: number | null } | null;
}) {
  const sequences = useMemo(() => findNegativeSequences(fullName), [fullName]);
  const isJuliana = fullName.trim().toLowerCase() === JULIANA_NATAL.fullName.toLowerCase();
  const seqRefs = isJuliana ? JULIANA_NATAL.sequenciasNegativas : sequences;

  const SEQ_MEANING: Record<string, string> = {
    "333": "Excesso de exposição, dispersão criativa, palavras que ferem.",
    "444": "Rigidez, sobrecarga de trabalho, teimosia com estruturas.",
    "555": "Instabilidade, mudanças bruscas, excessos sensoriais.",
    "666": "Sobrecarga afetiva, martírio, controle no cuidado.",
    "999": "Ilusão de salvador, apego a finais, dificuldade em soltar.",
  };

  return (
    <>
      <div className="glass-soft p-4 mb-5 text-xs">
        <span className="gold-text uppercase tracking-widest mr-2">Simbólico:</span>
        Triângulo da Vida é uma tradição interpretativa. Use como espelho, não como diagnóstico.
      </div>

      <div className="glass-card p-6 mb-5">
        <Chip>Arcano dominante por idade</Chip>
        {dominant ? (
          <div className="mt-4 flex items-center gap-6 flex-wrap">
            <div className="font-display text-7xl gold-text">{dominant.value}</div>
            <div className="text-sm">
              <div className="text-muted-foreground">Vigência: {dominant.startAge} → {dominant.endAge ?? "fim"} anos</div>
              <div>Idade atual: <span className="gold-text">{age}</span></div>
              {MEANINGS[dominant.value] && (
                <div className="mt-2 font-display text-xl">{MEANINGS[dominant.value].name}</div>
              )}
            </div>
          </div>
        ) : <p className="text-sm text-muted-foreground italic mt-3">Preencha data de nascimento.</p>}
      </div>

      <div className="glass-card p-6">
        <Chip tone="wine">Sequências negativas do nome</Chip>
        <div className="mt-4 space-y-2">
          {seqRefs.length === 0 && (
            <p className="text-sm text-muted-foreground italic">Nenhuma sequência crítica detectada no nome atual.</p>
          )}
          {seqRefs.map((s) => (
            <div key={s} className="p-3 rounded-md bg-secondary/50 border border-border flex items-start gap-3">
              <div className="font-display text-2xl gold-text w-14 text-center">{s}</div>
              <div className="text-sm">{SEQ_MEANING[s]}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   Relacionamentos & Prosperidade
   ============================================================ */
function ProsperityTab() {
  const h = JULIANA_NATAL.harmoniaConjugal;
  return (
    <>
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="glass-card p-6">
          <Chip>Harmonia Conjugal</Chip>
          <div className="mt-4 space-y-2 text-sm">
            <Row k="Número base" v={String(h.numero)} />
            <Row k="Vibra com" v={h.vibraCom.join(", ")} />
            <Row k="Atrai" v={h.atrai.join(", ")} />
            <Row k="Oposto a" v={h.opostoA.join(", ")} />
            <Row k="Passivo com" v={h.passivoCom.join(", ")} />
          </div>
        </div>

        <div className="glass-card p-6">
          <Chip>Números na vida diária</Chip>
          <div className="mt-4 space-y-3 text-sm">
            <NumLine label="Favoráveis" nums={JULIANA_NATAL.numerosFavoraveis} tone="gold" />
            <NumLine label="Neutros" nums={JULIANA_NATAL.numerosNeutros} tone="muted" />
            <NumLine label="Evitar" nums={JULIANA_NATAL.numerosEvitar} tone="wine" />
            <div className="pt-2 border-t border-border">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Dias favoráveis</div>
              <div className="flex flex-wrap gap-1.5">
                {JULIANA_NATAL.diasFavoraveis.map((d) => <Chip key={d}>{d}</Chip>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass-card p-6">
          <Chip>Cores harmônicas</Chip>
          <div className="mt-4 flex flex-wrap gap-2">
            {JULIANA_NATAL.coresHarmonicas.map((c) => <Chip key={c}>{c}</Chip>)}
          </div>
          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Segunda escolha</div>
            <div className="flex flex-wrap gap-2">
              {JULIANA_NATAL.coresSegundaEscolha.map((c) => <Chip key={c} tone="muted">{c}</Chip>)}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <Chip>Joias & cristais de prosperidade</Chip>
          <div className="mt-4 flex flex-wrap gap-2">
            {JULIANA_NATAL.joiasCristais.map((j) => <Chip key={j}>{j}</Chip>)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   Notas
   ============================================================ */
function NotesTab({ notes, onChange, sectionNotes, onSection }: {
  notes: string; onChange: (v: string) => void;
  sectionNotes: Record<string, string>; onSection: (k: string, v: string) => void;
}) {
  const sections = ["Visão Geral", "Mapa Natal", "Ciclos", "Ano · Mês · Dia", "Triângulo", "Relacionamentos"];
  return (
    <>
      <div className="glass-card p-6 mb-5">
        <Chip>Nota geral</Chip>
        <Textarea className="mt-4 min-h-[140px]" value={notes} onChange={(e) => onChange(e.target.value)}
          placeholder="Como esses números se manifestam na minha vida? O que estou percebendo neste ciclo?" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <div key={s} className="glass-card p-5">
            <div className="text-[10px] uppercase tracking-widest gold-text mb-2">{s}</div>
            <Textarea value={sectionNotes[s] || ""} onChange={(e) => onSection(s, e.target.value)}
              placeholder={`Insights sobre ${s.toLowerCase()}…`} />
          </div>
        ))}
      </div>
    </>
  );
}

/* ============================================================
   Blocos comuns
   ============================================================ */
function BigNumber({ label, value, caption }: { label: string; value: number; caption?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className="font-display text-6xl md:text-7xl gold-text leading-none mt-2">{value || "—"}</div>
      {caption && <div className="text-sm mt-2 font-display">{caption}</div>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 rounded-md bg-secondary/50 border border-border">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-2xl gold-text mt-1">{value}</div>
    </div>
  );
}

function ReadingBlock({ label, body, tone }: { label: string; body: string; tone: "gold" | "wine" }) {
  return (
    <div className={`p-4 rounded-md border ${tone === "gold" ? "gold-border" : "border-[color-mix(in_oklab,var(--wine)_50%,transparent)]"} bg-secondary/40`}>
      <div className={`text-[10px] uppercase tracking-widest mb-1 ${tone === "gold" ? "gold-text" : "text-[color-mix(in_oklab,var(--wine)_60%,var(--foreground))]"}`}>{label}</div>
      <div>{body}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 border-b border-border last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="gold-text font-medium">{v}</span>
    </div>
  );
}

function NumLine({ label, nums, tone }: { label: string; nums: readonly number[]; tone: "gold" | "wine" | "muted" }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-24">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {nums.map((n) => <Chip key={n} tone={tone}>{n}</Chip>)}
      </div>
    </div>
  );
}

function Disclaimer() {
  return (
    <p className="mt-8 text-xs text-muted-foreground text-center italic">
      Numerologia é tradição simbólica. Este mapa separa <span className="gold-text not-italic">cálculo</span>,{" "}
      <span className="gold-text not-italic">interpretação</span> e{" "}
      <span className="gold-text not-italic">nota pessoal</span> — use como espelho de escolhas, não como diagnóstico.
    </p>
  );
}
