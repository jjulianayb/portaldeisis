import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/* ---------- Types ---------- */

export type Profile = {
  name: string;
  story: string;
  phase: string;
  becoming: string;
  values: string;
  mission: string;
  legacy: string;
  vision1y: string;
  vision3y: string;
  vision10y: string;
  goalsProfessional: string;
  goalsFinancial: string;
  goalsPersonal: string;
  goalsSpiritual: string;
  birthDate: string;
  fullName: string;
};

export type Task = {
  id: string;
  title: string;
  objective: string;
  deadline: string;
  importance: "baixa" | "média" | "alta" | "crítica";
  emotion: string;
  archetype?: string;
  done: boolean;
  createdAt: number;
  completedAt?: number;
  review?: { felt: string; worked: string; improve: string };
};

export type ChecklistItem = { id: string; text: string; category: string; doneOn: string[] };

export type DiaryEntry = {
  id: string;
  date: string;
  achieved: string;
  learned: string;
  lostEnergy: string;
  sovereign: string;
  remember: string;
};

export type Prayer = {
  id: string;
  title: string;
  category: string;
  text: string;
  meaning: string;
  whenToUse: string;
  duration: string;
  favorite: boolean;
};

export type Contact = {
  id: string;
  name: string;
  area: string;
  relationship: string;
  potential: string;
  nextAction: string;
};

export type EmpireItem = {
  id: string;
  kind: "meta" | "projeto" | "oportunidade" | "movimento";
  title: string;
  detail: string;
  aligned: boolean;
};

export type FengShuiCheck = {
  id: string;
  space: string;
  item: string;
  kind: "tradicional" | "pessoal" | "funcional";
  done: boolean;
};

export type CouncilSession = {
  id: string;
  date: number;
  situation: string;
  emotion: string;
  goal: string;
  responses: { archetypeId: string; question: string; answer: string }[];
  recommendation: string;
};

export type ArchetypeNotes = Record<string, string>;

export type NumerologyOverrides = {
  shortName: string;
  pinnacles: { value: number; startAge: number; endAge: number | null }[] | null;
  sectionNotes: Record<string, string>;
};

export type State = {
  version: 1;
  passwordHash: string | null;
  profile: Profile;
  constitution: string[];
  tasks: Task[];
  checklist: ChecklistItem[];
  diary: DiaryEntry[];
  prayers: Prayer[];
  contacts: Contact[];
  empire: EmpireItem[];
  fengshui: FengShuiCheck[];
  council: CouncilSession[];
  archetypeNotes: ArchetypeNotes;
  numerologyNotes: string;
  numerology: NumerologyOverrides;
};


/* ---------- Seed ---------- */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const DEFAULT_CONSTITUTION = [
  "Meu tempo tem valor.",
  "Eu não negocio meus valores.",
  "Eu construo riqueza de forma ética.",
  "Eu trato pessoas com respeito.",
  "Execução vence perfeição.",
  "Meu corpo merece descanso.",
  "Meu sim e meu não têm peso.",
];

const DEFAULT_CHECKLIST: Omit<ChecklistItem, "id" | "doneOn">[] = [
  { text: "Ativação da manhã (respiração + intenção)", category: "Ativação" },
  { text: "Definir as 3 prioridades do dia", category: "Produtividade" },
  { text: "Executar bloco profundo (90 min)", category: "Produtividade" },
  { text: "Um 'não' consciente hoje", category: "Limites" },
  { text: "Organizar mesa e ambiente de trabalho", category: "Ambiente" },
  { text: "Ação que move o Império", category: "Negócios" },
  { text: "Prática espiritual (oração / mantra)", category: "Espiritualidade" },
  { text: "Movimento corporal", category: "Corpo e descanso" },
  { text: "Sono protegido (dormir até 23h)", category: "Corpo e descanso" },
];

const DEFAULT_PRAYERS: Omit<Prayer, "id">[] = [
  { title: "Proteção da manhã", category: "proteção", text: "Que eu seja guardada em todos os caminhos deste dia.", meaning: "Selo de proteção pessoal.", whenToUse: "Ao acordar", duration: "1 min", favorite: true },
  { title: "Prosperidade que constrói", category: "prosperidade", text: "Que a abundância flua por caminhos éticos e sustentáveis.", meaning: "Alinhar riqueza com valores.", whenToUse: "Antes de decisões financeiras", duration: "2 min", favorite: false },
  { title: "Coragem soberana", category: "coragem", text: "Eu escolho a partir da minha soberania, não do medo.", meaning: "Ativa decisão consciente.", whenToUse: "Antes de dizer não", duration: "1 min", favorite: false },
  { title: "Foco de rainha", category: "foco", text: "Meu foco é meu trono. O que não é essencial, aguarda.", meaning: "Centraliza atenção.", whenToUse: "Antes de trabalho profundo", duration: "1 min", favorite: false },
  { title: "Gratidão pelo caminho", category: "gratidão", text: "Agradeço o que veio, o que ficou e o que ainda virá.", meaning: "Fecha o dia em paz.", whenToUse: "À noite", duration: "2 min", favorite: false },
];

const emptyProfile: Profile = {
  name: "Juliana", story: "", phase: "", becoming: "", values: "",
  mission: "", legacy: "", vision1y: "", vision3y: "", vision10y: "",
  goalsProfessional: "", goalsFinancial: "", goalsPersonal: "", goalsSpiritual: "",
  birthDate: "", fullName: "",
};

const INITIAL: State = {
  version: 1,
  passwordHash: null,
  profile: emptyProfile,
  constitution: DEFAULT_CONSTITUTION,
  tasks: [],
  checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c, id: uid(), doneOn: [] })),
  diary: [],
  prayers: DEFAULT_PRAYERS.map((p) => ({ ...p, id: uid() })),
  contacts: [],
  empire: [],
  fengshui: [
    { id: uid(), space: "Home office", item: "Cadeira ergonômica e apoiada", kind: "funcional", done: false },
    { id: uid(), space: "Home office", item: "Símbolo de prosperidade no canto esquerdo (Feng Shui)", kind: "tradicional", done: false },
    { id: uid(), space: "Entrada", item: "Espaço limpo — nada bloqueando a porta", kind: "tradicional", done: false },
    { id: uid(), space: "Quarto", item: "Sem eletrônicos ativos ao dormir", kind: "funcional", done: false },
    { id: uid(), space: "Mesa de trabalho", item: "Objeto pessoal significativo à vista", kind: "pessoal", done: false },
  ],
  council: [],
  archetypeNotes: {},
  numerologyNotes: "",
  numerology: { shortName: "", pinnacles: null, sectionNotes: {} },
};

/* ---------- Password hash (simple, local) ---------- */

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ---------- Storage ---------- */

const STORAGE_KEY = "juliana-os:v1";
const SESSION_KEY = "juliana-os:session";

function loadState(): State {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as State;
    return { ...INITIAL, ...parsed, profile: { ...emptyProfile, ...parsed.profile } };
  } catch {
    return INITIAL;
  }
}

/* ---------- Context ---------- */

type Ctx = {
  state: State;
  hydrated: boolean;
  unlocked: boolean;
  hasPassword: boolean;
  setPassword: (pw: string) => Promise<void>;
  changePassword: (oldPw: string, newPw: string) => Promise<boolean>;
  unlock: (pw: string, remember: boolean) => Promise<boolean>;
  lock: () => void;
  update: (fn: (s: State) => State) => void;
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(INITIAL);
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    if (typeof window !== "undefined") {
      const remembered = localStorage.getItem(SESSION_KEY) === "1";
      if (remembered && loaded.passwordHash) setUnlocked(true);
      if (!loaded.passwordHash) setUnlocked(false);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const setPassword = useCallback(async (pw: string) => {
    const h = await sha256(pw);
    setState((s) => ({ ...s, passwordHash: h }));
    setUnlocked(true);
  }, []);

  const changePassword = useCallback(async (oldPw: string, newPw: string) => {
    const oldH = await sha256(oldPw);
    if (oldH !== state.passwordHash) return false;
    const newH = await sha256(newPw);
    setState((s) => ({ ...s, passwordHash: newH }));
    return true;
  }, [state.passwordHash]);

  const unlock = useCallback(async (pw: string, remember: boolean) => {
    const h = await sha256(pw);
    if (h !== state.passwordHash) return false;
    setUnlocked(true);
    if (remember) localStorage.setItem(SESSION_KEY, "1");
    else localStorage.removeItem(SESSION_KEY);
    return true;
  }, [state.passwordHash]);

  const lock = useCallback(() => {
    setUnlocked(false);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const exportJSON = useCallback(() => JSON.stringify(state, null, 2), [state]);
  const importJSON = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as State;
      setState({ ...INITIAL, ...parsed });
      return true;
    } catch { return false; }
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    setState(INITIAL);
    setUnlocked(false);
  }, []);

  const value = useMemo<Ctx>(() => ({
    state, hydrated, unlocked,
    hasPassword: !!state.passwordHash,
    setPassword, changePassword, unlock, lock, update,
    exportJSON, importJSON, reset,
  }), [state, hydrated, unlocked, setPassword, changePassword, unlock, lock, update, exportJSON, importJSON, reset]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export { uid };
