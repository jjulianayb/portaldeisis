import { useState } from "react";
import { TIRAGENS, tirar, sintese, type Tirada } from "@/lib/tarot";

export function TarotView() {
  const [tid, setTid] = useState("3");
  const [pergunta, setPergunta] = useState("");
  const [cartas, setCartas] = useState<Tirada[]>([]);
  const [abertas, setAbertas] = useState<boolean[]>([]);
  const [embaralhando, setEmb] = useState(false);
  const t = TIRAGENS.find((x) => x.id === tid)!;

  const jogar = () => {
    setEmb(true); setCartas([]);
    setTimeout(() => {
      const c = tirar(t.casas.length);
      setCartas(c); setAbertas(c.map(() => false)); setEmb(false);
    }, 1400);
  };
  const todasAbertas = cartas.length > 0 && abertas.every(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] uppercase tracking-[0.25em] gold-text">Taromancia</div>
        <h1 className="font-display text-4xl">Tarô de Marselha</h1>
        <p className="text-muted-foreground text-sm mt-1">22 Arcanos Maiores. Concentre-se na sua pergunta e embaralhe.</p>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {TIRAGENS.map((x) => (
            <button key={x.id} onClick={() => { setTid(x.id); setCartas([]); }}
              className={`px-4 py-2 rounded-full text-sm border transition ${tid === x.id ? "bg-secondary gold-text border-current" : "border-border text-muted-foreground"}`}>
              {x.nome}
            </button>
          ))}
        </div>
        <input value={pergunta} onChange={(e) => setPergunta(e.target.value)} placeholder="Sua pergunta ou intenção (opcional)"
          className="w-full bg-transparent border border-border rounded-md px-3 py-2 text-sm" />
        <button onClick={jogar} disabled={embaralhando}
          className="w-full py-3 rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-60">
          {embaralhando ? "Embaralhando e cortando…" : "Embaralhar e tirar cartas"}
        </button>
      </div>

      {embaralhando && (
        <div className="flex justify-center py-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-16 h-24 -mx-3 rounded-md gold-border bg-secondary animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      )}

      {cartas.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Toque em cada carta para revelar.</p>
            <button className="text-sm gold-text" onClick={() => setAbertas(cartas.map(() => true))}>Revelar todas</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {cartas.map((c, i) => (
              <div key={i} className="space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">{i + 1}. {t.casas[i]}</div>
                <button onClick={() => setAbertas((a) => a.map((v, j) => (j === i ? true : v)))}
                  className="w-full aspect-[2/3] [perspective:800px]">
                  <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
                    style={{ transform: abertas[i] ? "rotateY(180deg)" : "none" }}>
                    <div className="absolute inset-0 rounded-lg gold-border bg-secondary flex items-center justify-center [backface-visibility:hidden]">
                      <span className="font-display text-3xl gold-text">✦</span>
                    </div>
                    <div className="absolute inset-0 rounded-lg gold-border glass-card flex flex-col items-center justify-center p-2 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div className={c.invertida ? "rotate-180" : ""}>
                        <div className="font-display text-2xl gold-text">{c.arcano.n}</div>
                        <div className="font-display text-lg leading-tight">{c.arcano.nome}</div>
                      </div>
                      {c.invertida && <div className="text-[10px] mt-2 text-muted-foreground">invertida</div>}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {cartas.map((c, i) => abertas[i] && (
              <div key={i} className="glass-card p-4">
                <div className="text-[10px] uppercase tracking-widest gold-text">{t.casas[i]}</div>
                <div className="font-display text-xl">{c.arcano.nome}{c.invertida ? " (invertida)" : ""}</div>
                <div className="text-xs text-muted-foreground mb-2">{c.arcano.chaves}</div>
                <p className="text-sm">{c.invertida ? c.arcano.sombra : c.arcano.luz}</p>
                <p className="text-sm mt-2 italic gold-text">Conselho: {c.arcano.conselho}</p>
              </div>
            ))}
          </div>

          {todasAbertas && (
            <div className="glass-card p-5 gold-border">
              <div className="text-[10px] uppercase tracking-widest gold-text mb-1">Síntese da tiragem</div>
              <p className="leading-relaxed">{sintese(t, cartas, pergunta)}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
