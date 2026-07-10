import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, subtitle, action }: {
  eyebrow?: string; title: string; subtitle?: string; action?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          {eyebrow && <div className="text-[10px] uppercase tracking-[0.3em] gold-text mb-2">{eyebrow}</div>}
          <h1 className="font-display text-3xl md:text-5xl leading-tight">{title}</h1>
          {subtitle && <p className="mt-3 text-muted-foreground max-w-2xl">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="gold-divider mt-6 w-40" />
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`sanctum-card p-6 ${className}`}>{children}</div>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${props.className ?? ""}`}
    />
  );
}

export function Button({
  children, variant = "primary", className = "", ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "danger" }) {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
    outline: "gold-border gold-text hover:bg-secondary",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  }[variant];
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-md text-sm font-medium tracking-wide transition ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "wine" | "muted" }) {
  const colors = {
    gold: "gold-border gold-text",
    wine: "border border-[color-mix(in_oklab,var(--wine)_60%,transparent)] text-[color-mix(in_oklab,var(--ivory)_90%,var(--wine))] bg-[color-mix(in_oklab,var(--wine)_20%,transparent)]",
    muted: "border border-border text-muted-foreground",
  }[tone];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest ${colors}`}>{children}</span>;
}
