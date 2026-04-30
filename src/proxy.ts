import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface TokenPayload {
  sub: string;
  perfil: string;
  idCongregacao: number;
  exp: number;
}

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Se não houver token, redireciona para a home (login)
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const { payload } = await jwtVerify(token, secret);
    const tokenPayload = payload as unknown as TokenPayload;

    // Proteção de rotas por perfil
    if (pathname.startsWith("/homesuperadmin") && tokenPayload.perfil !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/homeadmin") && tokenPayload.perfil !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/homeuser") && tokenPayload.perfil !== "USER" && tokenPayload.perfil !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token inválido ou expirado:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/homeadmin/:path*",
    "/homeuser/:path*",
    "/homesuperadmin/:path*",
    "/dizimos/:path*",
    "/ofertas/:path*",
    "/despesas/:path*",
    "/relatorio/:path*",
    "/perfil/:path*",
  ],
};
