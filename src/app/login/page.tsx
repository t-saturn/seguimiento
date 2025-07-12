"use client";

import LoginContainer from "./login-container";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toogle";
import Link from "next/link";

function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-transparent text-foreground transition-colors duration-300 ease-in-out overflow-hidden">

      {/* Lado izquierdo: Branding institucional */}
      <div className="relative hidden lg:flex flex-col justify-between bg-transparent p-10 text-primary dark:text-primary overflow-hidden">

        {/* Imagen de fondo decorativa */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/inicio_fondo_sgd.jpg"
            alt="Decoración izquierda"
            fill
            className="object-cover blur-md brightness-75 transition-all duration-500"
            priority
          />
          <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-sm" />
        </div>

        {/* Encabezado institucional */}
        <div className="flex items-center justify-between animate-fade-in-down">
          <Link href="/" className="flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/logo.png"
              alt="Logo Municipalidad de Kimbiri"
              width={52}
              height={52}
              className="rounded-full shadow-lg"
            />
            <div>
              <h1 className="text-xl font-extrabold uppercase tracking-wide">
                Municipalidad Distrital
              </h1>
              <p className="text-sm text-foreground/90">Kimbiri · Gestión Documentaria</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mensaje institucional */}
        <div className="space-y-6 mt-20 animate-fade-in">
          <h2 className="text-3xl font-bold leading-snug drop-shadow-sm">
            “Sistema integral para el seguimiento eficiente de documentos.”
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Plataforma moderna diseñada para facilitar el control y la trazabilidad de trámites administrativos.
          </p>
        </div>

        {/* Pie de sección */}
        <div className="text-sm text-foreground/70 mt-16 animate-fade-in-up">
          © {new Date().getFullYear()} Municipalidad de Kimbiri · Todos los derechos reservados
        </div>
      </div>

      {/* Lado derecho: Contenedor del formulario */}
      <div className="relative flex flex-col justify-center px-6 sm:px-12 bg-white dark:bg-neutral-900 transition-all duration-500 animate-fade-in overflow-hidden">

        {/* Ola vertical decorativa al borde izquierdo de esta columna */}
        <div className="absolute top-0 left-0 h-full w-10 z-10 hidden lg:block">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100,0 C80,50 80,50 100,100 L0,100 L0,0 Z"
              fill="#ffffff"
              className="dark:fill-neutral-900"
            />
          </svg>
        </div>

        {/* Contenido del login */}
        <LoginContainer />
      </div>
    </div>
  );
}

export default Page;
