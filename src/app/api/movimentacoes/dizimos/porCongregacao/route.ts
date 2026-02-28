// src/app/api/movimentacoes/dizimos/porCongregacao/route.ts
import { NextResponse } from "next/server";
import { url } from "@/components/variavel";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const tipo = searchParams.get("tipo");
  const mes = searchParams.get("mes");
  const ano = searchParams.get("ano");

  // Monta a URL para o backend
  const apiUrl = `${url}/movimentacoes?tipo=${tipo}&mes=${mes}&ano=${ano}`;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const res = await fetch(apiUrl,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Erro no backend" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Falha ao buscar dados" }, { status: 500 });
  }
}
