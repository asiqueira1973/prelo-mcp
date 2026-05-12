import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const server = new McpServer({
    name: "prelo-mcp",
    version: "1.0.0",
  });

  server.tool(
    "buscar_livros",
    "Busca lançamentos literários brasileiros no catálogo Prelo com filtros opcionais por mês, editora ou autor.",
    {
      ano_mes: z
        .string()
        .optional()
        .describe("Mês de lançamento no formato YYYY-MM, ex: 2026-05"),
      editora: z
        .string()
        .optional()
        .describe("Nome da editora (busca parcial), ex: Todavia"),
      autor: z
        .string()
        .optional()
        .describe("Nome do autor (busca parcial), ex: Luiz Ruffato"),
    },
    async ({ ano_mes, editora, autor }) => {
      let query = supabase
        .from("livros_livros")
        .select(
          "titulo, autor, editora, data_lancamento, link_livro, link_capa"
        );

      if (ano_mes) {
        const [year, month] = ano_mes.split("-").map(Number);
        const pad = (n: number) => String(n).padStart(2, "0");
        const start = `${year}-${pad(month)}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const end = `${year}-${pad(month)}-${lastDay}`;
        query = query.gte("data_lancamento", start).lte("data_lancamento", end);
      }

      if (editora) query = query.ilike("editora", `%${editora}%`);
      if (autor) query = query.ilike("autor", `%${autor}%`);

      const { data, error } = await query
        .order("data_lancamento", { ascending: true })
        .limit(100);

      if (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Erro ao consultar o banco de dados: ${error.message}`,
            },
          ],
          isError: true,
        };
      }

      if (!data?.length) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Nenhum livro encontrado com os filtros informados.",
            },
          ],
        };
      }

      const linhas = data
        .map(
          (l) =>
            `📚 ${l.titulo}\n` +
            `   Autor: ${l.autor || "—"}\n` +
            `   Editora: ${l.editora || "—"}\n` +
            `   Lançamento: ${l.data_lancamento || "—"}\n` +
            `   Link: ${l.link_livro || "—"}`
        )
        .join("\n\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `${data.length} livro(s) encontrado(s):\n\n${linhas}`,
          },
        ],
      };
    }
  );

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — compatível com serverless
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
