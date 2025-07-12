"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants, Transition } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Shield,
  FileText,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toogle";

export default function HomePage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      } as Transition,
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } as Transition,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
      >
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/images/logo.png"
                alt="Logo Municipalidad de Kimbiri"
                width={48}
                height={48}
                className="rounded-full object-contain transition-transform group-hover:scale-105"
              />
              <div>
                <h1 className="text-lg font-bold text-primary uppercase tracking-wide">
                  Kimbiri
                </h1>
                <p className="text-xs text-muted-foreground font-extrabold">
                  Gestión Documentaria
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#services"
              className="text-sm text-foreground hover:text-primary transition-colors font-semibold"
            >
              Servicios
            </Link>
            <Link
              href="#features"
              className="text-sm text-foreground hover:text-primary transition-colors font-semibold"
            >
              Beneficios
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        id="hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative py-4 sm:py-8 bg-gradient-to-b from-primary/10 to-background overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-80 h-80 bg-primary/15 rounded-full blur-2xl animate-float" />
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1.2s" }}
          />
        </div>
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl font-extrabold text-foreground mb-6"
          >
            <span className="text-primary">Rastrea</span> Tus Documentos
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-md sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Consulta el estado de tus trámites en tiempo real con una plataforma segura y eficiente.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button
              asChild
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-transform hover:scale-105"
            >
              <Link href="/consulta">
                <Search className="w-5 h-5" />
                Iniciar Seguimiento
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        id="services"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-4 bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="text-center mb-10 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
              Servicios Disponibles
            </h2>
            <p className="text-md text-muted-foreground">
              Accede a nuestras soluciones para ciudadanos y personal autorizado.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Card className="bg-card border border-border/20 rounded-lg shadow-md">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-center text-lg font-semibold">
                    Consulta Ciudadana
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    Seguimiento fácil para tus trámites.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Trámites generales
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Solicitudes y reclamos
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Registros de ingreso
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Button
                      asChild
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link href="/consulta">
                        <Search className="w-4 h-4" />
                        Consultar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <Card className="bg-card border border-border/20 rounded-lg shadow-md">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-center text-lg font-semibold">
                    Sistema Interno
                  </CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    Acceso para personal autorizado.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Documentos reservados
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Gestión interna
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Flujo institucional
                    </li>
                  </ul>
                  <div className="mt-4 text-center">
                    <Button
                      asChild
                      variant="outline"
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Link href="/seguimiento">
                        <Shield className="w-4 h-4" />
                        Ingresar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 bg-gradient-to-t from-primary/5 to-background"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div
            className="absolute bottom-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="container mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="text-center mb-10 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
              Por Qué Elegirnos
            </h2>
            <p className="text-md text-muted-foreground">
              Beneficios diseñados para mejorar tu experiencia.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <Clock className="h-6 w-6 text-primary" />,
                title: "Consulta Inmediata",
                description: "Accede al estado de tus documentos al instante.",
              },
              {
                icon: <Shield className="h-6 w-6 text-primary" />,
                title: "Máxima Seguridad",
                description: "Tus datos están protegidos en todo momento.",
              },
              {
                icon: <Users className="h-6 w-6 text-primary" />,
                title: "Interfaz Intuitiva",
                description: "Fácil de usar para todos los usuarios.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="p-5 bg-card/90 border border-border/20 rounded-lg shadow-md text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-md font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-muted/10 backdrop-blur-md border-t border-border py-10"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <Image
                  src="/images/logo.png"
                  alt="Municipalidad de Kimbiri"
                  width={40}
                  height={40}
                  className="rounded-full object-contain"
                />
                <div>
                  <h4 className="text-md font-semibold text-primary">
                    Municipalidad de Kimbiri
                  </h4>
                  <p className="text-xs text-muted-foreground">Gestión Digital</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma para trámites rápidos y transparentes.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center sm:text-left">
              <h5 className="text-sm font-semibold text-foreground mb-3">
                Enlaces Útiles
              </h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {[
                  { href: "https://std.munikimbiri.gob.pe", text: "STD Kimbiri" },
                  {
                    href: "https://std.munikimbiri.gob.pe/verifica/inicio.do",
                    text: "Verificación de Documentos",
                  },
                  {
                    href: "https://std.munikimbiri.gob.pe/mpv/login.jsf",
                    text: "MPV – Interoperabilidad",
                  },
                  {
                    href: "https://mesadepartes.munikimbiri.gob.pe",
                    text: "Mesa de Partes Ciudadano",
                  },
                  {
                    href: "https://seguimiento.munikimbiri.gob.pe",
                    text: "Seguimiento de Documentos",
                  },
                  {
                    href: "https://config.munikimbiri.gob.pe",
                    text: "Configuración del Sistema",
                  },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center sm:text-left">
              <h5 className="text-sm font-semibold text-foreground mb-3">
                Contacto
              </h5>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>Dirección: Jr. Callao N° 122 – Kimbiri – Cusco</li>
                <li>Teléfono: (066) 303-195</li>
                <li>Email: mesadepartes@munikimbiri.gob.pe</li>
              </ul>
            </motion.div>
          </div>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            © {new Date().getFullYear()} Municipalidad Distrital de Kimbiri. Todos los derechos reservados.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}