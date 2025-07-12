"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import AvatarUser from "@/components/cards/avatar-user";
import { Session } from "next-auth";
import Link from "next/link";

interface HeaderProps {
  session: Session;
}

export default function Header({ session }: HeaderProps) {
  return (
   <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-md">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 gap-4">
      
      {/* Logo a la izquierda en escritorio, centrado en móvil */}
      <div className="flex justify-center md:justify-start items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/logo.png"
            alt="Municipalidad de Kimbiri"
            width={48}
            height={48}
            className="object-contain"
          />
          <div className="leading-tight">
            <h1 className="text-lg md:text-xl font-extrabold text-primary uppercase tracking-wider">
              Kimbiri
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Gestión Documentaria
            </p>
          </div>
        </Link>
      </div>

      {/* Título institucional centrado en escritorio */}
      <div className="hidden md:flex flex-col items-center text-center">
        <h2 className="text-base md:text-lg text-foreground font-semibold tracking-wider uppercase">
          Municipalidad Distrital de Kimbiri
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Plataforma oficial de seguimiento documentario
        </p>
      </div>

      {/* Controles a la derecha (modo oscuro y sesión) */}
      <div className="flex justify-center md:justify-end items-center gap-4">
        <ThemeToggle />
        <AvatarUser session={session} />
      </div>
    </div>
  </div>
</header>


    
  );
}
