# Dejá Vue

**Equipe:** Dejá Vue
**Disciplina:** Desenvolvimento Frontend · 2026.2 (Profª Marianne Lacerda Dutra Theodoro)
**Projeto:** Gerenciador de Tarefas Acadêmicas

## Integrantes

- Anthonny Cristhyan Silva Patrocinio
- Flávio Júnior Leall Varnier
- João Gabriel De Lima Moura
- Bárbara Serhena Miranda Pereira Cardoso Alves

## Framework

Vue 3 com TypeScript, criado com Vite. A API local usa o json-server.

## Como rodar

Requisitos: Node.js 24 ou superior (`node -v`) e Git (`git --version`).

Em uma pasta onde você guarda seus projetos, abra o terminal e rode:

```bash
git clone https://github.com/anthonnypatrocinio/Desenvolvimento-FrontEnd-5N-DejaVue
cd Desenvolvimento-FrontEnd-5N-DejaVue/DejaVue
npm install
```

O `git clone` baixa o repositório com todo o histórico e já deixa a branch `main` ligada ao GitHub. O projeto fica dentro da pasta `DejaVue`; é nela que se roda tudo.

Para atualizar o seu projeto depois, na pasta `DejaVue`:

```bash
git switch main
git pull origin main
npm install
```

Dentro da pasta `DejaVue`, abra dois terminais:

```bash
# Terminal 1: aplicação em http://localhost:5173
npm run dev

# Terminal 2: API local em http://localhost:3000
npx json-server db.json
```

## Dados

Na pasta `DejaVue`:

- `db.json`: dados da API local (o json-server grava nele).
- `db.seed.json`: cópia original. Para voltar aos dados iniciais, copie-o por cima do `db.json`.
- `src/tipos.ts`: tipos `Projeto` e `Tarefa` (contrato de dados da disciplina).

## Como trabalhar em equipe

- **Nunca** dê push direto na `main`. Ela só recebe código por pull request.
- Uma branch por issue, criada a partir da `main` atualizada: `git switch main`, `git pull origin main`, `git switch -c issue-N-nome`.
- Use `git add <arquivo>` arquivo por arquivo. **Não** use `git add .`.
- Antes de commitar: `git status`, `npm run build` e confira que o `db.json` não foi alterado pelos testes.
- Envie a branch (`git push -u origin issue-N-nome`) e abra o pull request: `gh pr create --base main --head issue-N-nome --title "..." --body "Closes #N"`.
- Mescle com "Create a merge commit".
