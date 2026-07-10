// Pythagorean numerology (Portuguese-friendly). Simplified, symbolic — never presented as science.

const VOWELS = "AEIOUÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕ";

// Pythagorean map A=1..I=9, J=1..R=9, S=1..Z=8
const LETTER_MAP: Record<string, number> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((c, i) => {
  LETTER_MAP[c] = (i % 9) + 1;
});

function stripAccents(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((a, d) => a + parseInt(d, 10), 0);
  }
  return n;
}

function letterValue(ch: string): number {
  const up = stripAccents(ch).toUpperCase();
  return LETTER_MAP[up] ?? 0;
}

function isVowel(ch: string): boolean {
  return VOWELS.includes(ch.toUpperCase());
}

export function calcExpression(fullName: string): number {
  const total = [...fullName].filter((c) => /[A-Za-zÀ-ÿ]/.test(c)).reduce((a, c) => a + letterValue(c), 0);
  return reduce(total);
}

export function calcSoul(fullName: string): number {
  const total = [...fullName].filter((c) => isVowel(c)).reduce((a, c) => a + letterValue(c), 0);
  return reduce(total);
}

export function calcPersonality(fullName: string): number {
  const total = [...fullName]
    .filter((c) => /[A-Za-zÀ-ÿ]/.test(c) && !isVowel(c))
    .reduce((a, c) => a + letterValue(c), 0);
  return reduce(total);
}

export function calcLifePath(birthISO: string): number {
  if (!birthISO) return 0;
  const digits = birthISO.replace(/\D/g, "");
  const total = digits.split("").reduce((a, d) => a + parseInt(d, 10), 0);
  return reduce(total);
}

export const MEANINGS: Record<number, { name: string; strengths: string; challenges: string; archetype: string }> = {
  1: { name: "Pioneira", strengths: "Iniciativa, liderança, coragem", challenges: "Solidão, impaciência", archetype: "Cavalo" },
  2: { name: "Diplomata", strengths: "Sensibilidade, cooperação, escuta", challenges: "Excesso de acomodação", archetype: "Afrodite" },
  3: { name: "Criadora", strengths: "Expressão, criatividade, alegria", challenges: "Dispersão", archetype: "Afrodite" },
  4: { name: "Construtora", strengths: "Estrutura, disciplina, base sólida", challenges: "Rigidez", archetype: "Árvore" },
  5: { name: "Livre", strengths: "Movimento, versatilidade, coragem", challenges: "Instabilidade", archetype: "Cavalo" },
  6: { name: "Guardiã", strengths: "Cuidado, harmonia, responsabilidade", challenges: "Excesso de proteção", archetype: "Ísis" },
  7: { name: "Sábia", strengths: "Análise, introspecção, intuição", challenges: "Isolamento", archetype: "Ísis" },
  8: { name: "Soberana", strengths: "Poder, estratégia, prosperidade", challenges: "Controle", archetype: "Cleópatra" },
  9: { name: "Legado", strengths: "Visão ampla, compaixão, encerramentos", challenges: "Apego", archetype: "Árvore" },
  11: { name: "Mestra da Intuição", strengths: "Inspiração, visão, magnetismo espiritual", challenges: "Sensibilidade extrema", archetype: "Ísis" },
  22: { name: "Mestra Construtora", strengths: "Realizar visão em larga escala", challenges: "Peso da missão", archetype: "Cleópatra" },
  33: { name: "Mestra do Cuidado", strengths: "Servir e elevar", challenges: "Auto-sacrifício", archetype: "Árvore" },
};
