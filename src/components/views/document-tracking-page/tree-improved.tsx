//"use client";

import { ExpedienteModal } from "@/components/ui/ExpedienteModal";
import {
  type DataResumen,
  type DataTree,
  initialDataResumen,
} from "@/models/datatree.model";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  AlertTriangle,
  Building,
  User2,
  Calendar,
  Package,
  FileCheck,
  Copy,
} from "lucide-react";
import { toBlob } from "html-to-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export interface DocumentTrackingProps {
  datosExpediente: DataTree;
}

export default function TreeImproved({
  datosExpediente,
}: DocumentTrackingProps) {
  const currentYear = new Date().getFullYear();
  const [cargando] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const { expediente, documentos } = datosExpediente;
  const [usuarioInicial, setUsuarioInicial] =
    useState<DataResumen>(initialDataResumen);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentos.length > 0) {
      const ultimoDocumento = documentos[documentos.length - 1];
      if (ultimoDocumento.usuario_interesado !== "") {
        setUsuarioInicial(ultimoDocumento);
      }
      if (cardRef.current) {
        cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [documentos]);

  const formatearFechaHora = (fechaISO?: string) => {
    if (!fechaISO) return "Sin fecha";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCopyImage = async () => {
    if (cardRef.current) {
      const blob = await toBlob(cardRef.current);
      if (!blob) return alert("No se pudo generar imagen.");

      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("Imagen copiada al portapapeles ✅");
      } catch (err) {
        console.error("Error copiando imagen:", err);
        toast.error("Tu navegador no soporta copiar imágenes.");
      }
    }
  };

  if (cargando) {
    return (
      <div className="w-full">
        <Card className="bg-card">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 bg-chart-1 rounded-full animate-pulse"></div>
              <p className="text-muted-foreground">Cargando seguimiento...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Card className="bg-card border-destructive">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              <p>Error en el seguimiento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (datosExpediente.documentos.length === 0) {
    return (
      <div className="w-full">
        <Card className="bg-card">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
              <Package className="w-16 h-16 text-chart-4" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">
                  Sin documentos para rastrear
                </h3>
                <p>
                  Ingrese los datos del documento para iniciar el seguimiento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log(datosExpediente);
  return (
    <div className="w-full space-y-6" ref={cardRef}>
      <ExpedienteModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        numeroExpediente={expediente}
      />

      {/* Encabezado de seguimiento del expediente */}
      <Card className="bg-chart-2 text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileCheck className="w-7 h-7" />
              <div>
                <h2 className="text-xl font-bold xl:text-2xl">Seguimiento de Documento</h2>
                <p className="text-md opacity-90 md:text-lg lg:text-lg">
                  {expediente !== "El documento aún no tiene expediente."
                    ? `Expediente: ${expediente}`
                    : "Documento en proceso de asignación"}
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex justify-center items-center gap-4">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30 xl:text-[16px]"
              >
                {documentos.length} {documentos.length === 1 ? "movimiento" : "movimientos"}
              </Badge>

              <button
                title="Copiar seguimiento como imagen"
                onClick={handleCopyImage}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/20 text-white backdrop-blur-sm border border-white/30 font-medium shadow-md hover:bg-white/30 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <Copy className="w-5 h-5" />
                <span className="text-sm hidden sm:inline"></span>
              </button>



              {/* Botón para descargar PDF del seguimiento (deshabilitado por ahora) */}
              {/**
          <button
            title="Descargar seguimiento en PDF"
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FileCheck className="w-7 h-7" />
          </button>
          */}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Línea de tiempo del seguimiento del documento */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

        <div className="space-y-6">
          {/* Documento inicial proveniente del ciudadano */}
          {usuarioInicial.usuario_interesado !== null &&
            expediente.startsWith(`${currentYear.toString()}-`) && (
              <div className="relative">
                <Card className="ml-16 bg-chart-3/5 border-chart-3 mr-0 md:mr-4">
                  <CardHeader className="pb-1">
                    <div className="flex flex-col sm:flex-row items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User2 className="w-5 h-5 text-chart-3" />
                        <span className="font-semibold text-chart-3 xl:text-lg">
                          DOCUMENTO INICIAL - CIUDADANO
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-chart-3 text-chart-3 xl:text-[16px]"
                      >
                        Origen
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <User2 className="w-4 h-4 text-chart-3" />
                          <span className="font-medium xl:text-[16px]">Solicitante:</span>
                          <span>{usuarioInicial.usuario_interesado}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <FileText className="w-4 h-4 text-chart-3" />
                          <span className="font-medium xl:text-[16px]">Documento:</span>
                          <span className="text-sm xl:text-[16px]">
                            {usuarioInicial.nu_doc_emi
                              ? `${usuarioInicial.tipo_documento} N° ${usuarioInicial.nu_doc_emi}`
                              : usuarioInicial.tipo_documento}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-chart-3" />
                          <span className="font-medium xl:text-[16px]">Fecha Presentación:</span>
                          <span>
                            {usuarioInicial.fecha_creacion
                              ? formatearFechaHora(usuarioInicial.fecha_creacion)
                              : formatearFechaHora(usuarioInicial.fecha_emision)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Building className="w-4 h-4 text-chart-3" />
                          <span className="font-medium xl:text-[16px]">Destino:</span>
                          <span>{usuarioInicial.oficina_remitente}</span>
                        </div>
                      </div>
                    </div>
                    {usuarioInicial.asunto && (
                      <div className="bg-card p-3 rounded-lg border">
                        <p className="text-sm xl:text-[16px]">
                          <span className="font-medium">Asunto:</span> {usuarioInicial.asunto}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="absolute left-6 top-6 w-4 h-4 bg-chart-5 rounded-full border-4 border-background shadow-lg"></div>
              </div>
            )}

          {/* Lista de movimientos del documento */}

        </div>
      </div>
    </div>

  );
}
