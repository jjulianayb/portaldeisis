import { useEffect, useState, type ReactNode } from "react";

const HASH = "6facc7a8c3518545c72fd367efdd7634f13e69201acee3d07942d7bdff445611";
const KEY = "juliana-os:unlocked";

async function sha256(input: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function LockGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    setOk(localStorage.getItem(KEY) === HASH);
  }, []);

  if (ok === null) return null;
  if (ok) return <>{children}</>;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if ((await sha256(pw)) === HASH) {
      localStorage.setItem(KEY, HASH);
      setOk(true);
    } else {
      setErr(true);
      setPw("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="glass-card w-full max-w-sm rounded-2xl p-8 space-y-5 text-center">
        <div className="font-display text-3xl gold-text">Santuário</div>
        <p className="text-sm text-muted-foreground">Acesso privado</p>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(false); }}
          placeholder="Chave de acesso"
          className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-base text-foreground outline-none focus:ring-2 focus:ring-primary"
        />
        {err && <p className="text-sm text-destructive">Chave incorreta</p>}
        <button type="submit" className="w-full rounded-xl bg-primary px-4 py-3 text-primary-foreground font-medium">
          Entrar
        </button>
      </form>
    </div>
  );
}
