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

Requisito: Node.js 24 ou superior (confira com `node -v`).

Em uma pasta vazia, abra o terminal e rode:

```bash
git init
git remote add origin https://github.com/anthonnypatrocinio/Desenvolvimento-FrontEnd-5N-DejaVue
git pull origin main
cd DejaVue
npm install
```

> Se o Git criar a branch como `master`, rode `git branch -M main` depois do `git pull`. No primeiro envio, use `git push -u origin main`.

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
