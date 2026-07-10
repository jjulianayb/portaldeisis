export type Archetype = {
  id: string;
  name: string;
  tagline: string;
  symbols: string[];
  uses: string[];
  narrative: string;
  activation: string;
  posture: string;
  objects: string[];
  shadow: string[];
  councilQuestion: string;
};

export const ARCHETYPES: Archetype[] = [
  {
    id: "isis",
    name: "Ísis",
    tagline: "Magnetismo, proteção e valor",
    symbols: ["magnetismo", "proteção", "reconstrução", "valor", "soberania feminina"],
    uses: [
      "Networking e primeiros contatos",
      "Imagem pessoal e presença",
      "Criação de conteúdo",
      "Situações onde deseja ser lembrada com sofisticação",
    ],
    narrative:
      "Deusa egípcia da restauração e proteção. Reúne o que foi fragmentado, guarda o valor do que cria e magnetiza pelo cuidado.",
    activation: "Eu protejo e valorizo o que crio.",
    posture: "Postura serena, olhar firme, gestos deliberados. Fala pouco e com peso.",
    objects: ["dourado suave", "tecidos fluidos", "aromas resinosos", "joia única"],
    shadow: ["excesso de proteção", "apego ao criado", "dificuldade de soltar"],
    councilQuestion: "Isso honra meu valor?",
  },
  {
    id: "cleopatra",
    name: "Cleópatra",
    tagline: "Estratégia, negociação e poder elegante",
    symbols: ["estratégia", "liderança", "inteligência social", "negociação", "poder elegante"],
    uses: ["Contratos e reuniões importantes", "Vendas e alianças", "Decisões estratégicas"],
    narrative:
      "Rainha do Egito associada à estratégia política, comunicação e leitura de cenário. Constrói alianças e usa a presença de forma consciente.",
    activation: "Eu vejo o tabuleiro inteiro e escolho a melhor jogada.",
    posture: "Coluna ereta, escuta ativa, respostas medidas. Pergunta antes de afirmar.",
    objects: ["tons profundos", "linhas limpas", "acessório de autoridade"],
    shadow: ["controle excessivo", "distância emocional"],
    councilQuestion: "Qual é o ganho estratégico aqui?",
  },
  {
    id: "medb",
    name: "Medb / Maeve",
    tagline: "Soberania, limites e coragem",
    symbols: ["soberania", "limites", "autonomia", "coragem"],
    uses: ["Dizer não", "Cobrar valor", "Cortar excessos", "Proteger energia"],
    narrative:
      "Rainha guerreira celta. Não pertence — escolhe. Reconhece o próprio preço e não negocia o que é essencial.",
    activation: "Eu decido o que merece meu tempo.",
    posture: "Direta, breve, sem justificativas em excesso.",
    objects: ["vermelho profundo", "metais", "botas firmes"],
    shadow: ["rigidez", "excesso de confronto"],
    councilQuestion: "Estou aceitando por escolha ou por medo?",
  },
  {
    id: "afrodite",
    name: "Afrodite / Vênus",
    tagline: "Criatividade, prazer e magnetismo",
    symbols: ["criatividade", "magnetismo", "beleza", "conexão", "prazer"],
    uses: ["Criação de conteúdo", "Eventos e comunicação", "Presença social"],
    narrative:
      "Arquétipo da beleza que conecta. Convida em vez de convencer. Move o mundo por atração.",
    activation: "Eu irradio criatividade e presença.",
    posture: "Calor, curiosidade genuína, sorriso presente.",
    objects: ["rosa", "flores", "aromas florais", "tecidos macios"],
    shadow: ["busca por aprovação"],
    councilQuestion: "Existe conexão e alinhamento aqui?",
  },
  {
    id: "cavalo",
    name: "Cavalo",
    tagline: "Movimento, execução e coragem",
    symbols: ["movimento", "velocidade", "execução", "ação"],
    uses: ["Vencer procrastinação", "Início de projetos", "Sprints de produtividade"],
    narrative:
      "Força de movimento. Não delibera em excesso — corre. Quando ansiosa, precisa de rédea, não de esporas.",
    activation: "Eu ajo com movimento e coragem.",
    posture: "Ritmo firme, respiração longa, um passo depois do outro.",
    objects: ["couro", "café", "playlist de execução"],
    shadow: ["impulsividade", "impaciência", "aceleração ansiosa"],
    councilQuestion: "Qual ação precisa acontecer agora?",
  },
  {
    id: "arvore",
    name: "Árvore",
    tagline: "Crescimento, prosperidade e legado",
    symbols: ["crescimento", "prosperidade", "estabilidade", "legado"],
    uses: ["Planejamento de longo prazo", "Expansão", "Construção de patrimônio"],
    narrative:
      "Raízes fundas, copa larga. Cresce devagar, oferece sombra e frutos no tempo certo.",
    activation: "Eu cultivo prosperidade com raízes fortes.",
    posture: "Paciência, decisão a partir do longo prazo, generosidade com retorno.",
    objects: ["verdes profundos", "madeira", "chá quente"],
    shadow: ["excesso de generosidade sem retorno", "lentidão que vira estagnação"],
    councilQuestion: "Isso constrói algo sustentável?",
  },
];

export const ARCHETYPES_BY_ID: Record<string, Archetype> = Object.fromEntries(
  ARCHETYPES.map((a) => [a.id, a]),
);
