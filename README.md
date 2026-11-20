# Prelo MCP

Servidor MCP público do [Prelo](https://prelo.art.br): deixa o Claude e outros agentes consultarem o catálogo de lançamentos literários brasileiros.

**Endpoint:** `https://prelo-mcp.vercel.app/mcp` (Streamable HTTP, sem autenticação). O site do Prelo está em [prelo.art.br](https://prelo.art.br), e o código dele no repositório [`prelo`](https://github.com/asiqueira1973/prelo).

## Principais funcionalidades

- Uma ferramenta, `buscar_livros`, que consulta o catálogo com filtros opcionais:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `ano_mes` | `string` (opcional) | Mês no formato `YYYY-MM`, ex.: `2026-05` |
| `editora` | `string` (opcional) | Nome da editora (busca parcial), ex.: `Todavia` |
| `autor`   | `string` (opcional) | Nome do autor (busca parcial), ex.: `Luiz Ruffato` |

- Devolve até 100 livros ordenados pela data de lançamento, com título, autor, editora, data e link.
- Servidor sem estado, compatível com funções serverless.

### Usar no Claude Desktop

Adicione ao `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prelo": {
      "url": "https://prelo-mcp.vercel.app/mcp"
    }
  }
}
```

## Stack técnica

- TypeScript, Node.js em Vercel Serverless Functions.
- SDK oficial do MCP (`@modelcontextprotocol/sdk`) com transporte Streamable HTTP.
- Supabase (PostgreSQL) como base do catálogo, a mesma do site do Prelo.
- Zod para o esquema dos parâmetros.

## Como foi construído

O Prelo MCP foi desenvolvido com Claude (Anthropic). O repositório não inclui spec, testes automatizados nem hooks; a verificação disponível é a checagem de tipos (`npm run typecheck`).

## Status

Publicado — no ar no endpoint acima, e indicado no `llms.txt` do site do Prelo como forma de acesso para agentes.

## Rodar localmente

```bash
cp .env.example .env    # preencha SUPABASE_URL e SUPABASE_ANON_KEY
npm install
npm run typecheck
```

O deploy é na Vercel (`vercel.json` roteia `/mcp` para [`api/mcp.ts`](api/mcp.ts)).

## Licença

O código está disponível apenas para leitura e estudo. Veja [LICENSE](LICENSE).

## Contribuições

Issues são bem-vindas; pull requests não são aceitos. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

---

Feito pela [Dab Lab](https://www.dablab.com.br/) — product studio de software e IA que constrói apps para pequenas empresas, startups e áreas dentro de grandes empresas, partindo de uma especificação (Spec-Driven Development) e com as disciplinas de engenharia de software robusta.
