# Prelo MCP Server

MCP server público para o [Prelo](https://prelo.com.br) — agregador de lançamentos literários brasileiros.

## Ferramenta disponível

### `buscar_livros`

Consulta o catálogo de lançamentos com filtros opcionais.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `ano_mes` | `string` (opcional) | Mês no formato `YYYY-MM`, ex: `2026-05` |
| `editora` | `string` (opcional) | Nome da editora (busca parcial), ex: `Todavia` |
| `autor`   | `string` (opcional) | Nome do autor (busca parcial), ex: `Luiz Ruffato` |

## Uso no Claude Desktop

Adicione ao seu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prelo": {
      "url": "https://prelo-mcp.vercel.app/mcp"
    }
  }
}
```

## Stack

- **Runtime:** Node.js (Vercel Serverless Functions)
- **MCP SDK:** `@modelcontextprotocol/sdk`
- **Banco de dados:** Supabase (PostgreSQL)

## Desenvolvimento local

```bash
cp .env.example .env
# preencha o .env com suas credenciais

npm install
npm run build
```

## Deploy

```bash
vercel --prod
```
