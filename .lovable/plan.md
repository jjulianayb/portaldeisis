# Animações suaves & microinterações premium

Adicionar camada de movimento sutil (fade-in, float, shimmer, hover lifts) ao Dashboard e Arquétipos — sem tocar em lógica, dados ou estrutura.

## 1. `src/styles.css` — novos keyframes e utilitários

Adicionar (no final do arquivo):

- `@keyframes fade-up` — opacity 0→1 + translateY(12px→0), 600ms ease-out
- `@keyframes float-slow` — translateY(0 → -6px → 0), 6s ease-in-out infinite
- `@keyframes shimmer-gold` — background-position sweep, 3s infinite (para divisor dourado)
- `@keyframes scale-in-soft` — scale(.96→1) + fade, 500ms

Utilitários (`@utility`):
- `.anim-fade-up` → aplica `fade-up` com `animation-fill-mode: both`
- `.anim-fade-up-stagger > *` → cada filho com `animation-delay` incremental (nth-child 1..8, +80ms cada)
- `.anim-float` → `float-slow` infinito
- `.hover-lift` → `transition: transform .5s ease, box-shadow .5s ease; will-change:transform` + no `:hover` `translateY(-4px)` e sombra dourada suave (`0 20px 40px -20px color-mix(in oklab, var(--gold) 35%, transparent)`)
- `.hover-glow` → no `:hover` aumenta brilho da borda dourada
- `.scroll-x-fade` → máscara lateral (`mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent)`) para o rail horizontal ganhar fade nas bordas

Respeitar `prefers-reduced-motion`: envolver keyframes/utilitários em bloco que zera animação e transform quando `@media (prefers-reduced-motion: reduce)`.

## 2. `src/components/views/Dashboard.tsx`

- Hero: envolver o bloco de imagem hero com `anim-fade-up`; a `<img>` de fundo recebe `anim-float` (movimento lento imperceptível) além do `opacity-30` atual.
- Frase do dia: `anim-fade-up` com delay leve (via style `animationDelay: "120ms"`).
- Divisor dourado do hero: adicionar classe `shimmer` que aplica `shimmer-gold` (gradient animado).
- Rail do Panteão: wrapper ganha `scroll-x-fade`; cada card do rail recebe `hover-lift` + `hover-glow` e entra com `anim-fade-up` + delay escalonado por índice (`style={{ animationDelay: ${i*60}ms }}`).
- Cards de Progresso e Prioridades: adicionar `anim-fade-up` com delays 200ms/280ms e `hover-lift` suave.
- `ProgressBar`: barra interna passa a animar largura (`transition: width 900ms cubic-bezier(.22,.61,.36,1)`).
- Atalhos: grid recebe `anim-fade-up-stagger`; cada `Shortcut` ganha `hover-lift` e ícone com `transition-transform` (scale 1.1 no hover).

## 3. `src/components/views/Arquetipos.tsx`

- Rail mobile e grid desktop: wrapper ganha `anim-fade-up-stagger` (desktop) e `scroll-x-fade` (mobile).
- `ArchetypeCard`: adicionar `hover-lift` + `hover-glow`; a `<img>` já faz `scale-105` no hover — trocar `duration-700` por `duration-[900ms] ease-out` e adicionar leve `brightness(1.05)` no hover via classe utilitária inline.
- Overlay do modal: adicionar `animate-fade-in` (já existe no tailwind config) na camada de fundo; o painel `.glass-card` ganha `anim-fade-up` com `animationDuration: 500ms`.
- Frase de ativação dentro do card (`gold-text italic`): micro brilho ao hover (opacidade sobe de 0.9 → 1).

## 4. Detalhes técnicos

- Nenhuma nova dependência (sem framer-motion) — tudo CSS puro para performance mobile.
- Nenhuma mudança em store, rotas, dados ou tipografia.
- Verificar `prefers-reduced-motion` desativa `float`, `shimmer` e translateY de entrada, mantendo apenas fade.
- Testar visualmente no viewport atual (414px) que rails continuam roláveis e sem overflow horizontal indesejado do body (máscara não altera layout).

## Arquivos alterados
- `src/styles.css` (adições)
- `src/components/views/Dashboard.tsx` (classes)
- `src/components/views/Arquetipos.tsx` (classes)
