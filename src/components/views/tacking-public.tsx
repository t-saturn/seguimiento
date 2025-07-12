"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Shield, CheckCircle, Send, RefreshCw, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { validateNumMesaPartes } from "@/utils/validation";
import { DataTree, initialDataTree } from "@/models/datatree.model";
import { obtenerResumenPorExpediente } from "@/actions/searchExpediente-action";
import TreeImproved from "./document-tracking-page/tree-improved";

export default function TackingPublic() {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear];
  const [anio, setAnio] = useState(currentYear.toString());
  const [datosExpediente, setDatosExpediente] = useState<DataTree>(initialDataTree);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expediente, setExpediente] = useState<string>("");
  const [numMesaPartes, setNumMesaPartes] = useState<string>("");
  const [tipoBusqueda, setTipoBusqueda] = useState<"mesa-partes" | "expediente">("mesa-partes");

  // CAPTCHA states
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaSize, setCaptchaSize] = useState<"compact" | "normal">("normal");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [siteKeyError, setSiteKeyError] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const verificationTimeRef = useRef<number | null>(null);

  const searchParams = useSearchParams();

  // Handle URL query parameter for expediente
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setExpediente(code);
      setTipoBusqueda("expediente");
    }
  }, [searchParams]);

  // Adjust CAPTCHA size based on screen width
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth < 640;
      const newSize = isMobile ? "compact" : "normal";
      setCaptchaSize((prevSize) => {
        if (prevSize !== newSize) {
          setCaptchaKey((prev) => prev + 1);
          return newSize;
        }
        return prevSize;
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Check for hCAPTCHA site key and show CAPTCHA
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
        setSiteKeyError(true);
        toast.error("Error: No se encontró la clave del sitio hCAPTCHA. Contacte al administrador.");
      } else {
        setShowCaptcha(true);
      }
    }
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Input handlers
  const handleExpedienteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 25);
    setExpediente(rawValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 7);
    setNumMesaPartes(rawValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchExpediente();
    }
  };

  const handleAnioChange = (value: string) => {
    setAnio(value);
  };

  // CAPTCHA timeout logic
  const startTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    verificationTimeRef.current = Date.now();
    setTimeLeft(120); // 2 minutes in seconds
    setIsExpired(false);

    countdownRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - verificationTimeRef.current!) / 1000);
      const remaining = Math.max(0, 120 - elapsed);
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(countdownRef.current!);
      }
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      setIsExpired(true);
      setCaptchaToken(null);
      toast.warning("La verificación ha expirado. Por favor, complete nuevamente el CAPTCHA.", {
        duration: 5000,
      });
    }, 120000); // 2 minutes
  };

  const reactivateCaptcha = () => {
    setIsExpired(false);
    setTimeLeft(0);
    setCaptchaKey((prev) => prev + 1);
    setCaptchaToken(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const handleVerify = (token: string) => {
    setCaptchaToken(token);
    startTimeout();
    toast.success("Verificado con éxito. Tienes 2 minutos para enviar el expediente.");
  };

  const handleError = (error: string) => {
    toast.error("Error en hCAPTCHA: " + error);
    setCaptchaToken(null);
    setIsExpired(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, " 0")}`;
  };

  // Search handler
  const handleSearchExpediente = async () => {
    if (!captchaToken || isExpired) {
      setError("Debe completar la verificación de seguridad.");
      toast.error("Complete la verificación de seguridad para continuar.");
      return;
    }

    setCargando(true);
    setError(null);

    try {
      let response: DataTree;
      if (tipoBusqueda === "mesa-partes" && numMesaPartes !== "") {
        const numMP = `${anio}-${validateNumMesaPartes(numMesaPartes)}`;
        response = await obtenerResumenPorExpediente({ exp: numMP });
      } else if (expediente) {
        response = await obtenerResumenPorExpediente({ exp: expediente });
      } else {
        toast.error("Debe ingresar un número válido.");
        setError("Debe ingresar un número válido.");
        setDatosExpediente(initialDataTree);
        setCargando(false);
        return;
      }

      setDatosExpediente(response);
      setExpediente("");
      setNumMesaPartes("");
      setCaptchaKey((prev) => prev + 1); // Reset CAPTCHA
      setCaptchaToken(null);
    } catch (error: unknown) {
      let errorMessage = "Ocurrió un error al obtener los datos.";
      if (error instanceof Error) {
        if (error.message.includes("Documento no encontrado") || error.message.includes("No se encontraron datos")) {
          errorMessage = "Documento no encontrado.";
        } else if (error.message.includes("Parámetros inválidos")) {
          errorMessage = "Los parámetros proporcionados son inválidos.";
        } else if (error.message.includes("Error interno del servidor")) {
          errorMessage = "Error interno del servidor. Por favor, intenta de nuevo más tarde.";
        }
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCargando(false);
    }
  };

  const isTokenValid = captchaToken && !isExpired;

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={`punto-${i}`}
            className="absolute rounded-full bg-primary/10 animate-ping"
            style={{
              top: `${Math.floor((i * 17) % 100)}%`,
              left: `${Math.floor((i * 37) % 100)}%`,
              width: `${(2 + (i % 4)) * 4}px`,
              height: `${(2 + (i % 4)) * 4}px`,
              animationDuration: `${6 + (i % 3)}s`,
              animationDelay: `${(i % 5) * 0.4}s`,
            }}
          />
        ))}
        <div className="absolute -top-32 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] animate-float" />
        <div
          className="absolute bottom-0 right-20 w-[28rem] h-[28rem] bg-accent/10 rounded-full blur-[130px] animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-foreground/5 rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "2.8s" }}
        />
      </div>

      <div className="container mx-auto p-6 space-y-12">
        {/* Header Section */}
        <section className="text-center flex flex-col items-center justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Seguimiento de Trámite Documentario
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Ingrese el número de expediente para consultar el estado actual de su trámite.
          </p>
          <Button
            onClick={() => {
              const target = document.getElementById("seccion-interactiva");
              if (target) {
                const yOffset = -150;
                const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
              }
            }}
            className="mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-transform hover:scale-105"
          >
            Ir a Buscar
          </Button>
        </section>

        {/* Interactive Section */}
        <section id="seccion-interactiva" className="space-y-12">
          <div className="text-center">
            <p className="text-base text-muted-foreground">Seleccione un método de búsqueda</p>
            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={() => setTipoBusqueda("mesa-partes")}
                variant={tipoBusqueda === "mesa-partes" ? "default" : "outline"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105"
              >
                <Search className="w-5 h-5" />
                Mesa de Partes
              </Button>
              <Button
                onClick={() => setTipoBusqueda("expediente")}
                variant={tipoBusqueda === "expediente" ? "default" : "outline"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-transform hover:scale-105"
              >
                <Search className="w-5 h-5" />
                Expediente
              </Button>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center max-w-4xl mx-auto">
            {tipoBusqueda === "expediente" ? (
              <Card className="flex flex-row items-center w-full bg-background rounded-xl shadow-md border border-border px-3">
                <Search className="w-5 h-5 text-muted-foreground ml-2" />
                <Input
                  type="text"
                  value={expediente}
                  onChange={handleExpedienteChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ej: 2025-001234 o GGOTIC2025000012345"
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </Card>
            ) : (
              <Card className="flex flex-row items-center w-full rounded-xl shadow-md border border-border px-3">
                <Search className="w-5 h-5 text-muted-foreground ml-2" />
                <Select value={anio} onValueChange={handleAnioChange}>
                  <SelectTrigger className="w-[100px] border-none focus:ring-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((a) => (
                      <SelectItem key={a} value={a.toString()}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="px-1 text-foreground font-semibold">-</span>
                <Input
                  type="text"
                  value={numMesaPartes}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="0001234"
                  maxLength={7}
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </Card>
            )}
          </div>

          {/* CAPTCHA Section */}
          <div className="max-w-lg mx-auto space-y-6">
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                    <h3 className="text-lg font-semibold text-card-foreground">
                      Verificación de Seguridad
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Confirme que no es un robot
                    </p>
                  </div>

                  {siteKeyError ? (
                    <p className="text-center text-sm text-destructive">
                      Error: La clave del sitio hCAPTCHA no está configurada correctamente.
                    </p>
                  ) : showCaptcha ? (
                    !isExpired ? (
                      <div className="flex items-center justify-center border-2 border-border rounded-xl bg-background shadow-inner p-4">
                        <HCaptcha
                          key={captchaKey}
                          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                          onVerify={handleVerify}
                          onError={handleError}
                          theme="light"
                          size={captchaSize}
                          id="hcaptcha-widget"
                        />
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="inline-flex items-center px-4 py-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                          <Clock className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                          <p className="text-orange-700 dark:text- orange-300 text-sm font-medium">
                            La verificación ha expirado
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={reactivateCaptcha}
                          variant="outline"
                          className="w-full"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reactivar Verificación
                        </Button>
                      </div>
                    )
                  ) : (
                    <p className="text-center text-sm text-destructive">
                      No se pudo cargar el widget hCAPTCHA.
                    </p>
                  )}

                  {captchaToken && !isExpired && (
                    <div className="text-center animate-in slide-in-from-bottom duration-500 space-y-2 space-x-2">
                      <div className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                          Verificación completada con éxito
                        </p>
                      </div>
                      {timeLeft > 0 && (
                        <div className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <Clock className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                          <p className="text-blue-700 dark:text-blue-300 text-xs font-medium">
                            Tiempo restante: {formatTime(timeLeft)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSearchExpediente}
              disabled={!isTokenValid || cargando}
              className={`w-full h-16 text-lg font-bold shadow-2xl transition-all transform hover:scale-105 ${isTokenValid && !cargando
                ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed hover:scale-100"
                }`}
            >
              <Send className="h-6 w-6 mr-3" />
              {cargando ? "Buscando..." : "Buscar Expediente"}
            </Button>

            {!isTokenValid && (
              <p className="text-center text-sm text-muted-foreground animate-pulse">
                {isExpired
                  ? "Reactive la verificación de seguridad para continuar"
                  : "Complete la verificación de seguridad para continuar"}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && datosExpediente.documentos.length === 0 && (
            <Card className="mx-auto max-w-xl border border-destructive bg-destructive/10 text-destructive dark:bg-destructive/20 dark:border-destructive/50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
                <div className="text-left">
                  <p className="text-base font-semibold">{error}</p>
                  <p className="text-sm opacity-80">
                    Por favor, verifique los datos ingresados o intente nuevamente.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Document Tree */}
          <div className="pt-6 border-t border-border">
            <TreeImproved datosExpediente={datosExpediente} />
          </div>
        </section>
      </div>
    </div>
  );
}