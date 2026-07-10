import { useState } from "react";
import { useStore } from "@/lib/store";
import { Lock, Sparkles } from "lucide-react";

export function Login() {
  const { hasPassword, setPassword, unlock } = useStore();
  const [mode] = useState<"setup" | "unlock">(hasPassword ? "unlock" : "setup");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const current: "setup" | "unlock" = hasPassword ? "unlock" : "setup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (current === "setup") {
        if (pw.length < 4) return setError("Mínimo 4 caracteres.");
        if (pw !== pw2) return setError("As senhas não coincidem.");
        await setPassword(pw);
      } else {
        const ok = await unlock(pw, remember);
        if (!ok) setError("Senha incorreta.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md sanctum-card p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full gold-border flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 gold-text" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl">Juliana OS</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2 gold-text">
            Personal Sovereignty System
          </p>
          <div className="gold-divider w-24 my-6" />
          <p className="text-sm text-muted-foreground italic font-display text-lg">
            "Qual é a melhor versão da Juliana para este momento?"
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">
              {current === "setup" ? "Criar senha do santuário" : "Senha"}
            </label>
            <div className="relative mt-2">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoFocus
                className="w-full bg-input border border-border rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          {current === "setup" && (
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Confirmar senha</label>
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className="mt-2 w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {current === "unlock" && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Manter sessão neste dispositivo
            </label>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md font-medium tracking-wide uppercase text-xs bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "..." : current === "setup" ? "Consagrar acesso" : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-[10px] uppercase tracking-widest text-center text-muted-foreground">
          Privado · Local · Somente você
        </p>
      </div>
    </div>
  );
}
