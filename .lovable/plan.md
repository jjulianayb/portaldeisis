## Remover tela de login por senha

Fazer o Juliana OS abrir direto no dashboard, sem exigir senha nem tela de "consagrar acesso".

### Mudanças

1. **`src/routes/index.tsx`**
   - Remover o gate `if (!unlocked) return <Login />`.
   - Após hidratação, renderizar sempre `<AppRouter />`.
   - Remover import de `Login`.

2. **`src/lib/store.tsx`**
   - Forçar `unlocked: true` por padrão no estado inicial e após hidratação.
   - Manter as funções (`lock`, `unlock`, `setPassword`, `changePassword`, `hasPassword`) exportadas como no-ops/compat para não quebrar imports existentes (Backup, AppShell), mas sem efeito prático — `lock()` não desloga mais.
   - Preservar todos os outros dados (perfil, tarefas, diário, numerologia, etc.) intactos.

3. **`src/components/AppShell.tsx`**
   - Remover o botão "Trancar santuário" (chama `lock`) do rodapé da navegação, já que não há mais login.

4. **`src/components/views/Backup.tsx`**
   - Remover o card "Alterar senha" (não faz mais sentido sem login).
   - Manter export/import/reset intactos.

5. **`src/components/Login.tsx`**
   - Deletar o arquivo (não é mais referenciado).

### Observações

- Nenhuma mudança em dados, numerologia, arquétipos, estilos ou tema.
- O app continua 100% local e privado — apenas sem a barreira de senha.
- Backup JSON e reset continuam funcionando normalmente.
