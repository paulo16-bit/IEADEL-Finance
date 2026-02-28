import { NextResponse } from "next/server";
import { url } from "@/components/variavel";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) return NextResponse.json([]);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Proxy para a nova rota auth/search
    // A API externa filtra a congregação automaticamente via SecurityContext (JWT)
    const res = await fetch(`${url}/auth/search?nome=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar usuários na API externa" },
        { status: res.status }
      );
    }

    const data = await res.json();
    
    // Mapeamos para garantir que o front receba { id_usuario, nome }
    const result = data.map((u: any) => ({
      id_usuario: u.id || u.id_usuario,
      nome: u.nome
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro no proxy de busca de usuários:", error);
    return NextResponse.json(
      { error: "Erro ao conectar com API externa" },
      { status: 500 }
    );
  }
}
