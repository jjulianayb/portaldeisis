import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, UserCircle2, ScrollText, Crown, Sparkles, CheckSquare, ListChecks,
  BookHeart, Calculator, Flower2, Home, TrendingUp, Building2, Users, Download, LogOut, Menu, X,
  Sun, Moon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useTheme } from "@/hooks/use-theme";

export type ViewKey =
  | "dashboard" | "perfil" | "constituicao" | "arquetipos" | "conselho"
  | "tarefas" | "checklist" | "diario" | "numerologia" | "espiritualidade"
  | "fengshui" | "insights" | "imperio" | "rede" | "backup";

const NAV: { key: ViewKey; label: string; icon: React.ComponentType<{ className?: string }>; group: string }[] = [
  { key: "dashboard", label: "Santuário", icon: LayoutDashboard, group: "Comando" },
  { key: "conselho", label: "Conselho Soberano", icon: Crown, group: "Comando" },
  { key: "tarefas", label: "Tarefas", icon: CheckSquare, group: "Comando" },
  { key: "checklist", label: "Checklist diário", icon: ListChecks, group: "Comando" },

  { key: "perfil", label: "DNA pessoal", icon: UserCircle2, group: "Identidade" },
  { key: "constituicao", label: "Código Soberano", icon: ScrollText, group: "Identidade" },
  { key: "arquetipos", label: "Arquétipos", icon: Sparkles, group: "Identidade" },

  { key: "imperio", label: "Império", icon: Building2, group: "Prosperidade" },
  { key: "rede", label: "Rede estratégica", icon: Users, group: "Prosperidade" },
  { key: "insights", label: "Minha evolução", icon: TrendingUp, group: "Prosperidade" },

  { key: "diario", label: "Diário", icon: BookHeart, group: "Interior" },
  { key: "espiritualidade", label: "Práticas & Orações", icon: Flower2, group: "Interior" },
  { key: "numerologia", label: "Mapa numerológico", icon: Calculator, group: "Interior" },
  { key: "fengshui", label: "Feng Shui & Ambiente", icon: Home, group: "Interior" },

  { key: "backup", label: "Backup & Config", icon: Download, group: "Sistema" },
];

const GROUPS = ["Comando", "Identidade", "Prosperidade", "Interior", "Sistema"];

export function AppShell({
  active, onNavigate, children,
}: { active: ViewKey; onNavigate: (v: ViewKey) => void; children: ReactNode }) {
  const { lock, state } = useStore();
  const [open, setOpen] = useState(false);

  const NavList = (
    <nav className="p-4 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-full gold-border flex items-center justify-center">
            <Sparkles className="w-4 h-4 gold-text" />
          </div>
          <div>
            <div className="font-display text-xl leading-none">Juliana OS</div>
            <div className="text-[10px] uppercase tracking-widest gold-text mt-1">Sovereignty</div>
          </div>
        </div>
      </div>
      {GROUPS.map((g) => (
        <div key={g}>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 px-2">{g}</div>
          <ul className="space-y-0.5">
            {NAV.filter((n) => n.group === g).map((n) => {
              const Icon = n.icon;
              const isActive = active === n.key;
              return (
                <li key={n.key}>
                  <button
                    onClick={() => { onNavigate(n.key); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                      ${isActive
                        ? "bg-secondary gold-text border border-[color-mix(in_oklab,var(--gold)_25%,transparent)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{n.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="pt-4 border-t border-border">
        <button
          onClick={lock}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60"
        >
          <LogOut className="w-4 h-4" /> Trancar santuário
        </button>
        <p className="mt-4 px-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          {state.profile.name || "Juliana"}
        </p>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 border-r border-border bg-[color-mix(in_oklab,var(--card)_70%,transparent)] backdrop-blur-sm sticky top-0 h-screen overflow-y-auto">
        {NavList}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 gold-text" />
          <span className="font-display text-lg">Juliana OS</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-2"><Menu className="w-5 h-5" /></button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between px-4 h-14 border-b border-border">
            <span className="font-display text-lg">Menu</span>
            <button onClick={() => setOpen(false)} className="p-2"><X className="w-5 h-5" /></button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-3.5rem)]">{NavList}</div>
        </div>
      )}

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-8 md:py-12">{children}</div>
      </main>
    </div>
  );
}

export { NAV };
