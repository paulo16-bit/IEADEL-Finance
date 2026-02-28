"use client"; 
import Link from "next/link";
import Image from "next/image";

import { useState } from "react";
import { useEffect } from "react";

export default function NavBarUser() {
    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/";
    }

    const [nome, setNome] = useState("");
    
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            const nomeCompleto = user.nome.split(" ");
            const primeirosNomes = nomeCompleto.slice(0, 2).join(" ")
            setNome(primeirosNomes);
        }
    }, []);

    return (
        <div className="flex w-full py-1 shadow-md">
            <div className="flex flex-row justify-between items-center m-4 w-full">
            <Link className="disable" href="">
            <Image 
                src="/logo.png"
                alt="Logo"
                width={35}
                height={35}
                >
            </Image>
            </Link>
            <h1 className="text-center font-semibold text-sm md:text-xl">Bem-vindo, {nome ? nome : "Visitante"}</h1>
            <button title="Sair" className="cursor-pointer" onClick={handleLogout}>
            <Image
                src="/logout.png"
                alt="Sair"
                width={40}
                height={40}
            />
            </button>   
            </div>
        </div>
    )
}