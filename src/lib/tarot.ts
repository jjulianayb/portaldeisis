export type Arcano = { n: number; nome: string; chaves: string; luz: string; sombra: string; conselho: string };

export const MARSELHA: Arcano[] = [
  { n: 0, nome: "O Louco", chaves: "liberdade, início, salto", luz: "Coragem de começar sem garantias; espontaneidade e fé no caminho.", sombra: "Imprudência, dispersão, fuga de responsabilidades.", conselho: "Dê o passo, mas olhe onde pisa." },
  { n: 1, nome: "O Mago", chaves: "vontade, habilidade, iniciativa", luz: "Você tem os recursos nas mãos; é hora de agir e manifestar.", sombra: "Manipulação, talento desperdiçado, insegurança disfarçada.", conselho: "Use o que já tem e comece agora." },
  { n: 2, nome: "A Papisa", chaves: "intuição, segredo, estudo", luz: "Sabedoria silenciosa; respostas vêm de dentro e do recolhimento.", sombra: "Frieza, passividade, segredos que pesam.", conselho: "Observe antes de falar; confie na intuição." },
  { n: 3, nome: "A Imperatriz", chaves: "criação, fertilidade, expressão", luz: "Abundância, beleza e produtividade criativa florescendo.", sombra: "Vaidade, excesso, criatividade bloqueada.", conselho: "Crie, nutra e expresse sua presença." },
  { n: 4, nome: "O Imperador", chaves: "estrutura, poder, estabilidade", luz: "Autoridade, ordem e domínio sobre o próprio território.", sombra: "Rigidez, controle excessivo, autoritarismo.", conselho: "Organize, decida e sustente seus limites." },
  { n: 5, nome: "O Papa", chaves: "tradição, ensino, ponte", luz: "Orientação, mentoria e valores sólidos guiando escolhas.", sombra: "Dogma, conformismo, falsos mestres.", conselho: "Busque conselho sábio e honre seus valores." },
  { n: 6, nome: "O Enamorado", chaves: "escolha, afeto, união", luz: "Escolha guiada pelo coração; vínculos e harmonia.", sombra: "Indecisão, dividir-se entre caminhos, influência alheia.", conselho: "Escolha o que está alinhado com quem você é." },
  { n: 7, nome: "O Carro", chaves: "conquista, avanço, direção", luz: "Vitória pela determinação; movimento e progresso.", sombra: "Pressa, perda de controle, ego dirigindo.", conselho: "Mantenha o foco e conduza com firmeza." },
  { n: 8, nome: "A Justiça", chaves: "equilíbrio, verdade, decisão", luz: "Clareza, acordos justos e consequências merecidas.", sombra: "Julgamento duro, burocracia, desequilíbrio.", conselho: "Seja honesta e pese os fatos com frieza." },
  { n: 9, nome: "O Eremita", chaves: "introspecção, prudência, sabedoria", luz: "Tempo de busca interior; a luz que você carrega guia.", sombra: "Isolamento, lentidão, medo do mundo.", conselho: "Desacelere e ilumine o próximo passo." },
  { n: 10, nome: "A Roda da Fortuna", chaves: "ciclos, mudança, destino", luz: "A roda gira a seu favor; oportunidades e movimento.", sombra: "Instabilidade, repetição de padrões.", conselho: "Aproveite o fluxo e adapte-se ao ciclo." },
  { n: 11, nome: "A Força", chaves: "coragem, domínio, paixão", luz: "Força gentil que doma os instintos; confiança serena.", sombra: "Raiva contida, esgotamento, autoexigência.", conselho: "Domine com suavidade, não com violência." },
  { n: 12, nome: "O Pendurado", chaves: "pausa, entrega, nova visão", luz: "Sacrifício consciente que traz um novo ponto de vista.", sombra: "Estagnação, vitimismo, espera sem fim.", conselho: "Mude a perspectiva antes de agir." },
  { n: 13, nome: "Arcano Sem Nome", chaves: "transformação, fim, renovação", luz: "Corte necessário que abre espaço para o novo.", sombra: "Resistência à mudança, apego ao que acabou.", conselho: "Solte o que já cumpriu seu papel." },
  { n: 14, nome: "A Temperança", chaves: "equilíbrio, cura, paciência", luz: "Harmonia, moderação e cura gradual.", sombra: "Falta de medida, impaciência.", conselho: "Dose, misture e espere o tempo certo." },
  { n: 15, nome: "O Diabo", chaves: "desejo, apego, poder", luz: "Magnetismo, ambição e energia vital intensa.", sombra: "Vícios, dependências, relações de controle.", conselho: "Reconheça o que te prende e retome o poder." },
  { n: 16, nome: "A Torre", chaves: "ruptura, revelação, libertação", luz: "Queda de estruturas falsas; verdade libertadora.", sombra: "Choque, crise, perdas inesperadas.", conselho: "Deixe cair o que não tem base real." },
  { n: 17, nome: "A Estrela", chaves: "esperança, inspiração, fluxo", luz: "Fé, proteção e generosidade do universo.", sombra: "Ilusão, ingenuidade, esperança passiva.", conselho: "Confie e entregue seus dons ao mundo." },
  { n: 18, nome: "A Lua", chaves: "inconsciente, sonhos, ilusão", luz: "Intuição profunda, imaginação e sensibilidade.", sombra: "Medos, confusão, enganos.", conselho: "Não decida no escuro; espere a clareza." },
  { n: 19, nome: "O Sol", chaves: "sucesso, alegria, clareza", luz: "Vitalidade, reconhecimento e parcerias felizes.", sombra: "Orgulho, exposição excessiva.", conselho: "Brilhe e compartilhe o seu calor." },
  { n: 20, nome: "O Julgamento", chaves: "despertar, chamado, renascimento", luz: "Renascimento, notícias e resposta a um chamado.", sombra: "Culpa, autocrítica, recusa do chamado.", conselho: "Responda ao que sua alma está pedindo." },
  { n: 21, nome: "O Mundo", chaves: "realização, plenitude, conclusão", luz: "Ciclo completo, sucesso e integração total.", sombra: "Sensação de incompletude, medo de concluir.", conselho: "Celebre e conclua com plenitude." },
];

export type Tiragem = { id: string; nome: string; casas: string[] };
export const TIRAGENS: Tiragem[] = [
  { id: "1", nome: "Carta única", casas: ["Mensagem do momento"] },
  { id: "3", nome: "Três cartas", casas: ["Passado / Origem", "Presente / Momento", "Futuro / Tendência"] },
  { id: "5", nome: "Cinco cartas (Cruz)", casas: ["O momento", "O desafio", "A raiz inconsciente", "O conselho / aliado", "O desfecho"] },
];

export type Tirada = { arcano: Arcano; invertida: boolean };

export function tirar(qtd: number): Tirada[] {
  const deck = [...MARSELHA];
  const arr = new Uint32Array(deck.length);
  crypto.getRandomValues(arr);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = arr[i] % (i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const r = new Uint32Array(qtd);
  crypto.getRandomValues(r);
  return deck.slice(0, qtd).map((arcano, i) => ({ arcano, invertida: r[i] % 4 === 0 }));
}

export function sintese(t: Tiragem, cartas: Tirada[], pergunta: string): string {
  const inv = cartas.filter((c) => c.invertida).length;
  const altos = cartas.filter((c) => c.arcano.n >= 11).length;
  const tom = inv > cartas.length / 2
    ? "A tiragem pede atenção às sombras: há bloqueios internos a reconhecer antes de avançar."
    : "A energia geral é fluida: as forças estão a seu favor se você agir com consciência.";
  const fase = altos > cartas.length / 2
    ? "Predominam arcanos da segunda metade do caminho — tema de transformação interior e espiritual."
    : "Predominam arcanos da primeira metade — tema de ação no mundo, escolhas e construção.";
  const p = pergunta ? `Sobre "${pergunta}": ` : "";
  if (cartas.length === 1) {
    const c = cartas[0];
    return `${p}${c.arcano.nome} responde ${c.invertida ? "em sombra" : "em luz"}. ${c.invertida ? c.arcano.sombra : c.arcano.luz} Conselho: ${c.arcano.conselho}`;
  }
  if (cartas.length === 3) {
    const [a, b, c] = cartas;
    return `${p}Você vem de ${a.arcano.nome} (${a.arcano.chaves}), vive agora ${b.arcano.nome} (${b.arcano.chaves}) e caminha para ${c.arcano.nome} (${c.arcano.chaves}). ${tom} ${fase} A chave para que o futuro se cumpra: ${b.arcano.conselho.toLowerCase()}`;
  }
  const [m, d, r, a, f] = cartas;
  return `${p}O momento é regido por ${m.arcano.nome}, desafiado por ${d.arcano.nome}${d.invertida ? " (invertido, desafio interno)" : ""}. Na raiz está ${r.arcano.nome}: ${r.arcano.chaves}. O aliado é ${a.arcano.nome} — ${a.arcano.conselho.toLowerCase()} Seguindo esse conselho, o desfecho aponta para ${f.arcano.nome}: ${f.invertida ? f.arcano.sombra : f.arcano.luz} ${tom} ${fase}`;
}
