import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader, Card, Field, Input, Button } from "@/components/ui-kit";
import { Download, Upload, RotateCcw } from "lucide-react";

export function BackupView() {
  const { exportJSON, importJSON, reset, changePassword } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const [oldPw, setOldPw] = useState(""); const [newPw, setNewPw] = useState("");

  function doExport() {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `juliana-os-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    setMsg("Backup exportado.");
  }

  function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importJSON(String(reader.result));
      setMsg(ok ? "Dados importados." : "Arquivo inválido.");
    };
    reader.readAsText(f);
  }

  async function doChangePw(e: React.FormEvent) {
    e.preventDefault();
    if (newPw.length < 4) return setMsg("Nova senha muito curta.");
    const ok = await changePassword(oldPw, newPw);
    setMsg(ok ? "Senha alterada." : "Senha atual incorreta.");
    if (ok) { setOldPw(""); setNewPw(""); }
  }

  return (
    <>
      <PageHeader eyebrow="Sistema" title="Backup & Configuração" subtitle="Seus dados vivem apenas neste dispositivo. Exporte para não perder." />

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-display text-2xl">Dados</h3>
          <div className="gold-divider my-4 w-16" />
          <div className="space-y-3">
            <Button onClick={doExport}><Download className="inline w-4 h-4 mr-2 -mt-0.5" />Exportar JSON</Button>
            <div>
              <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
              <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="inline w-4 h-4 mr-2 -mt-0.5" />Importar JSON</Button>
            </div>
            <div>
              <Button variant="danger" onClick={() => { if (confirm("Apagar todos os dados locais?")) reset(); }}>
                <RotateCcw className="inline w-4 h-4 mr-2 -mt-0.5" />Restaurar padrão
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-display text-2xl">Alterar senha</h3>
          <div className="gold-divider my-4 w-16" />
          <form onSubmit={doChangePw} className="space-y-3">
            <Field label="Senha atual"><Input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} /></Field>
            <Field label="Nova senha"><Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} /></Field>
            <Button type="submit">Alterar</Button>
          </form>
        </Card>
      </div>

      {msg && <p className="mt-6 text-sm text-center gold-text">{msg}</p>}

      <div className="mt-10">
        <Card>
          <h3 className="font-display text-2xl">Sobre este sistema</h3>
          <div className="gold-divider my-4 w-16" />
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Juliana OS é um sistema pessoal privado. Nenhum dado sai deste dispositivo.</p>
            <p><strong className="gold-text">Três camadas de conhecimento</strong> coexistem, sem confusão:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Evidência (hábitos, produtividade, comportamento)</li>
              <li>Tradição simbólica (arquétipos, Feng Shui, numerologia)</li>
              <li>Prática pessoal (orações, mantras, interpretações)</li>
            </ul>
            <p className="italic">Símbolos são espelhos de reflexão — nunca apresentados como fatos científicos.</p>
          </div>
        </Card>
      </div>
    </>
  );
}
