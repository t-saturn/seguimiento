"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import TrackingModal from "@/components/modals/TrackingModal";
import { TrackingStep } from "@/types/tracking";
import SearchDocument from "./SearchDocument";
import { DataTree, initialDataTree } from "@/models/datatree.model";
import Footer from "@/components/layout/footer";

export default function DocumentTrackingPage({
  session,
}: {
  session: Session;
}) {
  const [datosExpediente, setDatosExpediente] =
    useState<DataTree>(initialDataTree);
  const [error] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<TrackingStep | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();

  // Validación de la sesión
  useEffect(() => {
    if (!session?.expires) return;

    const expiresDate = new Date(session.expires).getTime();
    const checkExpiration = () => {
      const now = Date.now();
      if (now >= expiresDate) {
        setIsExpired(true);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Redirigir si la sesión ha caducado
  if (isExpired) {
    signOut({ callbackUrl: "/login", redirect: false }).then(() => {
      router.push("/login");
    });
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-center px-4">
        <div className="max-w-md space-y-4">
          <p className="text-lg font-semibold text-destructive dark:text-red-400">
            Tu sesión ha expirado
          </p>
          <p className="text-muted-foreground text-sm">
            Estamos redirigiéndote automáticamente por seguridad...
          </p>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>

    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background relative isolate">

      {/* Fondo decorativo: puntos animados */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const top = `${Math.floor((i * 17) % 100)}%`;
          const left = `${Math.floor((i * 37) % 100)}%`;
          const size = 2 + (i % 4);
          return (
            <div
              key={i}
              className="absolute rounded-full bg-green-400/10 dark:bg-green-300/10 animate-ping"
              style={{
                top,
                left,
                width: `${size * 4}px`,
                height: `${size * 4}px`,
                animationDuration: `${6 + (i % 3)}s`,
                animationDelay: `${(i % 5) * 0.4}s`,
              }}
            />
          );
        })}
      </div>

      {/* Burbujas glassmorphism */}
      <div className="absolute -top-32 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] animate-float -z-10" />
      <div className="absolute bottom-0 right-20 w-[28rem] h-[28rem] bg-accent/10 rounded-full blur-[130px] animate-float -z-10" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-foreground/5 rounded-full blur-[120px] animate-float -z-10" style={{ animationDelay: "2.8s" }} />

      {/* Contenido principal */}
      <main className="flex-grow w-full px-6 sm:px-10 lg:px-24 pt-[7rem] pb-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary drop-shadow-sm">
            Seguimiento Inteligente de Documentos
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Accede al estado actual de tus trámites de forma clara, moderna y segura.
          </p>
        </div>

        {/* Buscador */}
        <SearchDocument
          datosExpediente={datosExpediente}
          onDatosExpediente={setDatosExpediente}
        />

        {error && (
          <div className="max-w-2xl mx-auto mt-8 bg-destructive/10 border border-destructive rounded-2xl p-5 shadow-md text-center">
            <p className="text-destructive text-base font-semibold tracking-wide">
              {error}
            </p>
          </div>
        )}
      </main>

      {/* Modal seguimiento */}
      {selectedStep && (
        <TrackingModal
          step={selectedStep}
          onClose={() => setSelectedStep(null)}
        />
      )}

      {/* Footer */}
      <footer className="z-10">
        <Footer />
      </footer>
    </div>
  );

}
