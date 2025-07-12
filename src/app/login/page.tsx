"use client";

import LoginContainer from "./login-container";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ThemeToggle } from "@/components/theme/theme-toogle";

function Page() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const slideVariants: Variants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideRightVariants: Variants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background text-foreground transition-colors duration-500 ease-in-out overflow-hidden relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Lado izquierdo: Branding institucional */}
      <motion.div
        className="relative hidden lg:flex flex-col bg-gradient-to-br from-primary/20 via-accent/10 to-background p-12 text-primary dark:text-primary-foreground overflow-hidden"
        variants={slideVariants}
      >
        {/* Imagen de fondo decorativa */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/inicio_fondo_sgd.jpg"
            alt="Fondo Municipalidad de Kimbiri"
            fill
            className="object-cover brightness-90 transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent dark:from-black/70 dark:to-transparent backdrop-blur-md" />
        </div>

        {/* Encabezado institucional */}
        <motion.div variants={itemVariants} className="flex items-center justify-between z-10">
          <Link href="/" className="flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/logo.png"
              alt="Logo Municipalidad de Kimbiri"
              width={64}
              height={64}
              className="rounded-full shadow-xl border-4 border-primary/30 hover:border-primary/50 transition-all duration-300"
            />
            <div>
              <h1 className="text-3xl font-extrabold uppercase tracking-widest text-primary drop-shadow-md">
                Municipalidad Distrital
              </h1>
              <p className="text-base font-semibold text-foreground/90">Kimbiri · Gestión Documentaria</p>
            </div>
          </Link>
          <ThemeToggle />
        </motion.div>

        {/* Espaciador flexible */}
        <div className="flex-grow" />

        {/* Mensaje institucional en la parte inferior */}
        <motion.div variants={itemVariants} className="space-y-6 mt-16 z-10">
          <h2 className="text-3xl font-bold leading-tight drop-shadow-lg text-primary">
            Sistema integral para el seguimiento eficiente de documentos.
          </h2>
          <p className="text-base text-foreground dark:text-muted-foreground leading-relaxed max-w-lg">
            Plataforma innovadora que optimiza la gestión y trazabilidad de trámites administrativos, garantizando transparencia, seguridad y accesibilidad para todos los ciudadanos.
          </p>
        </motion.div>

        {/* Pie de sección */}
        <motion.div variants={itemVariants} className="text-sm text-muted-foreground dark:text-muted-foreground mt-10 z-10">
          © {new Date().getFullYear()} Municipalidad Distrital de Kimbiri · Todos los derechos reservados
        </motion.div>
      </motion.div>

      {/* Divisor animado entre las dos columnas */}
      <div className="absolute top-0 left-1/2 h-full w-1 bg-gradient-to-b from-primary/20 via-accent/40 to-primary/20 z-20 hidden lg:block transform -translate-x-1/2">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/60 to-transparent animate-pulse" />
      </div>

      {/* Lado derecho: Contenedor del formulario */}
      <motion.div
        className="relative flex flex-col justify-center px-6 sm:px-16 bg-background dark:bg-neutral-900 transition-all duration-500"
        variants={slideRightVariants}
      >
        {/* Efecto de transición suave en el borde */}
        <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-primary/10 to-transparent z-10 hidden lg:block" />

        {/* Partículas flotantes decorativas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-primary/15 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        </div>

        {/* Contenido del login */}
        <motion.div variants={itemVariants} className="relative z-10">
          <LoginContainer />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Page;