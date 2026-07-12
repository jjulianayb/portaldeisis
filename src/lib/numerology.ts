// Numerologia pitagórica — leitura simbólica, nunca apresentada como ciência.
// Fonte: manual clássico + laudo pessoal da Juliana Silva Camargo de Pinho.

/* ============================================================
   1. Utilitários de base
   ============================================================ */

// Vogais incluindo Y e W (regra do manual).
const VOWELS = "AEIOUYWÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕŸ";

// Mapa pitagórico A=1..I=9, J=1..R=9, S=1..Z=8
const LETTER_MAP: Record<string, number> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => {
  LETTER_MAP[c] = (i % 9) + 1;
});

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Reduz mantendo mestres 11, 22, 33. */
export function reduce(n: number, keepMasters = true): number {
  if (!isFinite(n) || n <= 0) return n;
  while (n > 9) {
    if (keepMasters && (n === 11 || n === 22 || n === 33)) return n;
    n = n.toString().split("").reduce((a, d) => a + parseInt(d, 10), 0);
  }
  return n;
}

/** Reduz sempre a um único dígito (0-9). Útil para desafios. */
export function reduceToDigit(n: number): number {
  n = Math.abs(n);
  while (n > 9) {
    n = n.toString().split("").reduce((a, d) => a + parseInt(d, 10), 0);
  }
  return n;
}

function letterValue(ch: string): number {
  const up = stripAccents(ch).toUpperCase();
  return LETTER_MAP[up] ?? 0;
}

function isVowel(ch: string): boolean {
  const up = stripAccents(ch).toUpperCase();
  return VOWELS.includes(up) || VOWELS.includes(ch.toUpperCase());
}

function letters(name: string): string[] {
  return [...name].filter((c) => /[A-Za-zÀ-ÿ]/.test(c));
}

function sumDigits(n: number): number {
  return n.toString().split("").reduce((a, d) => a + parseInt(d, 10), 0);
}

function parseDate(iso: string): { d: number; m: number; y: number } | null {
  if (!iso) return null;
  // Aceita YYYY-MM-DD ou DD/MM/YYYY
  let d = 0, m = 0, y = 0;
  if (/^\d{4}-\d{2}-\d{2}/.test(iso)) {
    [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  } else if (/^\d{2}\/\d{2}\/\d{4}/.test(iso)) {
    [d, m, y] = iso.split("/").map((n) => parseInt(n, 10));
  } else return null;
  if (!d || !m || !y) return null;
  return { d, m, y };
}

/* ============================================================
   2. Cálculos do NOME
   ============================================================ */

export function calcExpression(fullName: string): number {
  return reduce(letters(fullName).reduce((a, c) => a + letterValue(c), 0));
}

export function calcSoul(fullName: string): number {
  return reduce(letters(fullName).filter(isVowel).reduce((a, c) => a + letterValue(c), 0));
}

export function calcPersonality(fullName: string): number {
  return reduce(letters(fullName).filter((c) => !isVowel(c)).reduce((a, c) => a + letterValue(c), 0));
}

export function calcFirstName(fullName: string): number {
  const first = fullName.trim().split(/\s+/)[0] || "";
  return reduce(letters(first).reduce((a, c) => a + letterValue(c), 0));
}

export function calcLastName(fullName: string): number {
  const parts = fullName.trim().split(/\s+/);
  const last = parts[parts.length - 1] || "";
  return reduce(letters(last).reduce((a, c) => a + letterValue(c), 0));
}

/** Pedra Angular — valor da primeira letra. */
export function calcCornerstone(fullName: string): number {
  const ls = letters(fullName);
  return ls.length ? letterValue(ls[0]) : 0;
}

/** Desejo Instintivo — valor da primeira vogal. */
export function calcFirstVowel(fullName: string): number {
  const v = letters(fullName).find(isVowel);
  return v ? letterValue(v) : 0;
}

/** Número do Equilíbrio — soma das iniciais reduzida. */
export function calcBalance(fullName: string): number {
  const initials = fullName.trim().split(/\s+/).map((w) => w[0]).filter(Boolean);
  return reduce(initials.reduce((a, c) => a + letterValue(c), 0));
}

/* Lições Cármicas — números de 1 a 9 ausentes no nome. */
export function calcKarmicLessons(fullName: string): number[] {
  const present = new Set(letters(fullName).map((c) => letterValue(c)));
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) if (!present.has(i)) missing.push(i);
  return missing;
}

/* Tendências Ocultas — números que aparecem mais de 3 vezes. */
export function calcHiddenTendencies(fullName: string): number[] {
  const count: Record<number, number> = {};
  letters(fullName).forEach((c) => { const v = letterValue(c); count[v] = (count[v] || 0) + 1; });
  return Object.entries(count).filter(([, n]) => n > 3).map(([k]) => parseInt(k, 10)).sort();
}

/* ============================================================
   3. Cálculos da DATA de nascimento
   ============================================================ */

/** Caminho de Vida / Destino / Estrada da Vida. */
export function calcLifePath(birthISO: string): number {
  const p = parseDate(birthISO); if (!p) return 0;
  return reduce(sumDigits(p.d) + sumDigits(p.m) + sumDigits(p.y));
}

export function calcBirthDay(birthISO: string): number {
  const p = parseDate(birthISO); if (!p) return 0;
  return reduce(p.d);
}

/** Maturidade = Expressão + Destino (mantém mestres). */
export function calcMaturity(fullName: string, birthISO: string): number {
  return reduce(calcExpression(fullName) + calcLifePath(birthISO));
}

/** Quintessência = Expressão + Estrada da Vida (mesmo que Maturidade na tradição usada). */
export function calcQuintessence(fullName: string, birthISO: string): number {
  return reduce(calcExpression(fullName) + calcLifePath(birthISO));
}

/** Pensamento Racional = prenome + dia de nascimento. */
export function calcRationalThought(fullName: string, birthISO: string): number {
  const p = parseDate(birthISO); if (!p) return 0;
  return reduce(calcFirstName(fullName) + p.d);
}

/** Ciclos de Vida: mês, dia, ano — três fases. Idade das transições depende do Caminho de Vida. */
export function calcLifeCycles(birthISO: string): { values: [number, number, number]; boundaries: [number, number] } {
  const p = parseDate(birthISO); if (!p) return { values: [0, 0, 0], boundaries: [0, 0] };
  const values: [number, number, number] = [reduce(p.m), reduce(p.d), reduce(sumDigits(p.y))];
  // Tradição comum: 1º ciclo até 28-30 anos; 2º até 56-58; 3º daí em diante.
  // Usamos regra baseada no Caminho de Vida: primeira transição = 36 - lifePath (arredondado ao múltiplo de 9).
  const lp = calcLifePath(birthISO);
  const first = 36 - reduceToDigit(lp);
  const second = first + 27;
  return { values, boundaries: [first, second] };
}

/** Momentos Decisivos (4). */
export function calcDecisiveMoments(birthISO: string): [number, number, number, number] {
  const p = parseDate(birthISO); if (!p) return [0, 0, 0, 0];
  const d = reduce(p.d), m = reduce(p.m), y = reduce(sumDigits(p.y));
  const m1 = reduce(d + m);
  const m2 = reduce(d + y);
  const m3 = reduce(m1 + m2);
  const m4 = reduce(m + y);
  return [m1, m2, m3, m4];
}

/** Desafios (4). */
export function calcChallenges(birthISO: string): [number, number, number, number] {
  const p = parseDate(birthISO); if (!p) return [0, 0, 0, 0];
  const d = reduceToDigit(p.d), m = reduceToDigit(p.m), y = reduceToDigit(sumDigits(p.y));
  const c1 = reduceToDigit(Math.abs(d - m));
  const c2 = reduceToDigit(Math.abs(d - y));
  const c3 = reduceToDigit(Math.abs(c1 - c2));
  const c4 = reduceToDigit(Math.abs(m - y));
  return [c1, c2, c3, c4];
}

/** Pináculos — 4 fases com vigências etárias baseadas no Caminho de Vida. */
export function calcPinnacles(birthISO: string): { value: number; startAge: number; endAge: number | null }[] {
  const p = parseDate(birthISO); if (!p) return [];
  const d = reduce(p.d), m = reduce(p.m), y = reduce(sumDigits(p.y));
  const p1 = reduce(d + m);
  const p2 = reduce(d + y);
  const p3 = reduce(p1 + p2);
  const p4 = reduce(m + y);
  const lp = calcLifePath(birthISO);
  const first = 36 - reduceToDigit(lp);
  return [
    { value: p1, startAge: 0, endAge: first },
    { value: p2, startAge: first, endAge: first + 9 },
    { value: p3, startAge: first + 9, endAge: first + 18 },
    { value: p4, startAge: first + 18, endAge: null },
  ];
}

/* ============================================================
   4. Ciclos dinâmicos: Ano / Mês / Dia Pessoal
   ============================================================ */

/** Ano Pessoal: aniversário-a-aniversário. */
export function calcPersonalYear(birthISO: string, today = new Date()): { value: number; startISO: string; endISO: string } {
  const p = parseDate(birthISO);
  if (!p) return { value: 0, startISO: "", endISO: "" };
  const y = today.getFullYear();
  const thisYearBirthday = new Date(y, p.m - 1, p.d);
  const anchorYear = today >= thisYearBirthday ? y : y - 1;
  const value = reduce(sumDigits(p.d) + sumDigits(p.m) + sumDigits(anchorYear));
  const start = new Date(anchorYear, p.m - 1, p.d);
  const end = new Date(anchorYear + 1, p.m - 1, p.d - 1);
  return {
    value,
    startISO: start.toISOString().slice(0, 10),
    endISO: end.toISOString().slice(0, 10),
  };
}

/** Mês Pessoal: só vira no dia do aniversário dentro do mês. */
export function calcPersonalMonth(birthISO: string, today = new Date()): { value: number; monthLabel: string } {
  const p = parseDate(birthISO);
  if (!p) return { value: 0, monthLabel: "" };
  const py = calcPersonalYear(birthISO, today).value;
  // Se ainda não chegou ao dia do aniversário no mês, considera mês anterior.
  const effectiveMonth = today.getDate() >= p.d ? today.getMonth() + 1 : today.getMonth();
  const m = effectiveMonth === 0 ? 12 : effectiveMonth;
  const monthDate = new Date(today.getFullYear(), m - 1, 1);
  return {
    value: reduce(py + m),
    monthLabel: monthDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  };
}

/** Dia Pessoal = Mês Pessoal + dia atual. */
export function calcPersonalDay(birthISO: string, today = new Date()): number {
  const pm = calcPersonalMonth(birthISO, today).value;
  return reduce(pm + today.getDate());
}

/* ============================================================
   5. Triângulo da Vida — sequências e arcano dominante por idade
   ============================================================ */

const NEGATIVE_SEQUENCES = ["333", "444", "555", "666", "999"];

export function findNegativeSequences(fullName: string): string[] {
  const seq = letters(fullName).map(letterValue).join("");
  return NEGATIVE_SEQUENCES.filter((s) => seq.includes(s));
}

/** Arcano dominante por idade (aproximação simbólica com base no Caminho de Vida e Pináculos). */
export function dominantArcanumByAge(birthISO: string, age: number): { value: number; startAge: number; endAge: number | null } | null {
  const pins = calcPinnacles(birthISO);
  return pins.find((p) => age >= p.startAge && (p.endAge === null || age < p.endAge)) ?? null;
}

/* ============================================================
   6. Interpretações (base simbólica do manual)
   ============================================================ */

export const MEANINGS: Record<number, { name: string; strengths: string; challenges: string; archetype: string; keywords: string }> = {
  1: { name: "Pioneira", strengths: "Iniciativa, liderança, coragem, autonomia", challenges: "Solidão, impaciência, autoritarismo", archetype: "Cavalo", keywords: "liderança, individualidade, iniciativa" },
  2: { name: "Diplomata", strengths: "Sensibilidade, cooperação, escuta, paciência", challenges: "Excesso de acomodação, dependência", archetype: "Afrodite", keywords: "diplomacia, paciência, cooperação" },
  3: { name: "Criadora", strengths: "Expressão, criatividade, alegria, comunicação", challenges: "Dispersão, superficialidade", archetype: "Afrodite", keywords: "comunicação, criatividade, expressão" },
  4: { name: "Construtora", strengths: "Estrutura, disciplina, método, base sólida", challenges: "Rigidez, excesso de controle", archetype: "Árvore", keywords: "disciplina, trabalho, estrutura" },
  5: { name: "Livre", strengths: "Movimento, versatilidade, coragem, adaptação", challenges: "Instabilidade, impulsividade", archetype: "Cavalo", keywords: "mudança, liberdade, versatilidade" },
  6: { name: "Guardiã", strengths: "Cuidado, harmonia, beleza, responsabilidade", challenges: "Excesso de proteção, martírio", archetype: "Ísis", keywords: "cuidado, harmonia, família, beleza" },
  7: { name: "Sábia", strengths: "Análise, introspecção, intuição, pesquisa", challenges: "Isolamento, ceticismo, frieza", archetype: "Ísis", keywords: "introspecção, sabedoria, espiritualidade" },
  8: { name: "Soberana", strengths: "Poder, estratégia, prosperidade, justiça", challenges: "Controle, ansiedade material, autoritarismo", archetype: "Cleópatra", keywords: "poder, justiça, gestão, realização" },
  9: { name: "Legado", strengths: "Visão ampla, compaixão, encerramentos, humanitarismo", challenges: "Apego, drama, ilusão de salvador", archetype: "Árvore", keywords: "universalismo, compaixão, conclusão de ciclos" },
  11: { name: "Mestra da Intuição", strengths: "Inspiração, visão, magnetismo, liderança elevada", challenges: "Sensibilidade extrema, ansiedade espiritual", archetype: "Ísis", keywords: "inspiração, intuição, diplomacia" },
  22: { name: "Mestra Construtora", strengths: "Realizar visão em larga escala, obra material sagrada", challenges: "Peso da missão, exigência", archetype: "Cleópatra", keywords: "construção monumental" },
  33: { name: "Mestra do Cuidado", strengths: "Servir e elevar, ensinar pelo amor", challenges: "Auto-sacrifício, desgaste emocional", archetype: "Árvore", keywords: "serviço amoroso" },
};

export const PERSONAL_YEAR_MEANING: Record<number, { theme: string; do: string; avoid: string }> = {
  1: { theme: "Recomeços, plantio de sementes, novo ciclo de 9 anos.", do: "Iniciar projetos, tomar decisões, afirmar identidade.", avoid: "Esperar aprovação, ficar em relações antigas por comodismo." },
  2: { theme: "Cooperação, paciência, alianças, semente amadurecendo.", do: "Cultivar parcerias, escutar, refinar o que foi iniciado.", avoid: "Impor ritmo, forçar decisões, isolamento." },
  3: { theme: "Expressão, criatividade, visibilidade, socialização.", do: "Comunicar, mostrar seu trabalho, criar.", avoid: "Dispersão, prometer demais, superficialidade." },
  4: { theme: "Trabalho, estrutura, disciplina, construção da base.", do: "Organizar rotinas, fechar operações, cuidar do corpo.", avoid: "Fugir da rotina, decisões impulsivas." },
  5: { theme: "Mudança, movimento, liberdade, expansão inesperada.", do: "Aceitar reviravoltas, viajar, arriscar com consciência.", avoid: "Excessos, decisões precipitadas, romper vínculos por impulso." },
  6: { theme: "Casa, família, responsabilidade, harmonia estética.", do: "Cuidar dos vínculos, embelezar espaços, assumir responsabilidades escolhidas.", avoid: "Sobrecarga afetiva, culpa, controle sobre outros." },
  7: { theme: "Introspecção, estudo, silêncio, retiro, análise.", do: "Estudar, meditar, refinar processos internos.", avoid: "Grandes exposições públicas, casamentos apressados." },
  8: { theme: "Poder, colheita material, gestão, reconhecimento.", do: "Fechar negócios, cobrar valor, assumir posições de liderança.", avoid: "Prepotência, gastos por status, atalhos éticos." },
  9: { theme: "Encerramento de ciclo, síntese, entrega, limpeza.", do: "Concluir, doar, perdoar, arquivar. Deixar espaço para o próximo 1.", avoid: "Começar coisas novas por ansiedade, apego ao que já morreu." },
};

/* ============================================================
   7. Mapa NATAL FIXO da Juliana (referência declarada)
   ============================================================ */

export const JULIANA_NATAL = {
  fullName: "Juliana Silva Camargo de Pinho",
  birthDate: "1989-10-01",
  diaNatalicio: 1,
  motivacao: 6,
  impressao: 1,
  expressao: 7,
  numeroPsiquico: 1,
  talentoOculto: 4,
  destino: 11,
  missao: 9,
  respostaSubconsciente: 8,
  licoesCarmicas: [9],
  tendenciasOcultas: [1, 3, 5],
  dividaCarmica: 16,
  desafios: [0, 8, 8, 8],
  ciclosDeVida: [1, 1, 9],
  momentosDecisivos: [2, 1, 3, 1],
  sequenciasNegativas: ["333", "444", "555", "666", "999"],
  coresHarmonicas: ["verde", "amarelo", "branco", "cinza", "azul-claro"],
  coresSegundaEscolha: ["prateado", "laranja"],
  joiasCristais: ["olho-de-gato", "pedra-da-lua", "ágata", "jade", "pérola", "quartzo transparente", "berilo"],
  numerosFavoraveis: [2, 4, 9],
  numerosNeutros: [1, 5, 6, 8],
  numerosEvitar: [3, 7],
  diasFavoraveis: [2, 7, 14, 16, 23, 25],
  harmoniaConjugal: {
    numero: 9,
    vibraCom: [1],
    atrai: [2, 3, 5, 6],
    opostoA: [7],
    passivoCom: [4, 8],
  },
} as const;

export const JULIANA_HISTORICAL_YEARS: { period: string; personalYear: number; note: string }[] = [
  { period: "01/10/2023 → 30/09/2024", personalYear: 9, note: "Encerramento de ciclo de 9 anos: síntese, entrega, limpeza." },
  { period: "01/10/2024 → 30/09/2025", personalYear: 1, note: "Recomeço: plantio de novo ciclo, afirmação de identidade." },
  { period: "01/10/2025 → 30/09/2026", personalYear: 2, note: "Cooperação, refinamento, alianças que consolidam o novo." },
];

/** Leituras fixas do laudo da Juliana. */
export const JULIANA_READINGS: Record<string, string> = {
  "Dia Natalício 1": "Essência de liderança e independência. Postura de quem inicia.",
  "Motivação 6": "Busca harmonia, estética, conforto, acolhimento e responsabilidade afetiva.",
  "Impressão 1": "Primeira impressão forte, direta, independente e dominante.",
  "Expressão 7": "Profundidade, estudo, análise, espiritualidade e perfeccionismo.",
  "Talento Oculto 4": "Talento para estrutura, organização e expressão mais prática.",
  "Destino 11": "Liderança inspiradora, intuição, visão, diplomacia, espiritualidade.",
  "Missão 9": "Humanitarismo, conhecimento, serviço ao todo, compaixão.",
  "Resposta Subconsciente 8": "Reação firme, organizada, segura e eficiente em crises.",
  "Lição Cármica 9": "Aprender compaixão, altruísmo, ética e serviço sem se perder de si.",
  "Dívida Cármica 16": "Humildade, desapego, fé, quebra de orgulho e de vaidade.",
  "Tendências Ocultas 1, 3, 5": "Impulso de dominar, dispersão, impulsividade e busca de liberdade sem freio.",
  "Desafio 8": "Equilibrar poder, dinheiro, justiça e ansiedade material.",
};
