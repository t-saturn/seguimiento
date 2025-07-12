"use client";

import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import TackingPublic from "@/components/views/tacking-public";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/layout/footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 gap-4">

            {/* Logo a la izquierda en escritorio, al centro en móvil */}
            <div className="flex justify-center md:justify-start items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/images/logo.png"
                  alt="Logo Municipalidad de Kimbiri"
                  width={48}
                  height={48}
                  className="rounded-full object-contain"
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
                Plataforma oficial de gestión de documentos
              </p>
            </div>

            {/* Solo el botón de cambio de tema a la derecha */}
            <div className="flex justify-center md:justify-end items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>


      <Suspense fallback={<div className="text-center py-10">Cargando...</div>}>
        <TackingPublic />
      </Suspense>

      <Footer></Footer>

    </div>
  );
}
