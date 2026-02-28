import { NextResponse } from "next/server";

export async function POST() {
  // Cria a resposta
  const res = NextResponse.json({ message: "Logout realizado com sucesso" });

  // Remove o cookie "token"
  res.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: -1, // expira imediatamente
  });

  return res;
}
