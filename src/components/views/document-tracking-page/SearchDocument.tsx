import { SearchSelect } from "@/components/ui/SearchSelect";
import { BusquedaDni, BusquedaOficina } from "@/models/busqueda.model";
import {
  Option,
  transformarDependencias,
  transformarDocumentos,
  transformarPersonales,
} from "@/utils/formatValueSelect.utility";
import { validateNumDoc, validateNumMesaPartes } from "@/utils/validation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  validarAllPropVacias,
  validarAnyPropVacias,
} from "@/utils/validationData";
import { DataTree, initialDataTree } from "@/models/datatree.model";
import { obtenerResumenPorExpediente } from "@/actions/searchExpediente-action";
import TreeImproved from "./tree-improved";
import { toast } from "sonner";
import { tabOptions } from "@/models/tabOption.model";
import { TabContent } from "@/components/ui/TabContent";

interface SearchProps {
  datosExpediente: DataTree;
  onDatosExpediente: (data: DataTree) => void;
}

interface TipoDocumento {
  cdoc_desdoc: string;
  cdoc_tipdoc: string;
}

export default function SearchDocument({
  datosExpediente,
  onDatosExpediente,
}: SearchProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear];

  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
  const [, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [documentos, setDocumento] = useState<Option[]>([]);
  const [dependencias, setDependencias] = useState<Option[]>([]);
  const [personales, setPersonales] = useState<Option[]>([]);

  const [expediente, setExpediente] = useState<string>("");
  const [numMesaPartes, setNumMesaPartes] = useState<string>("");
  const [anio, setAnio] = useState(currentYear.toString());

  const [tipoBusqueda, setTipoBusqueda] = useState<
    "mesa-partes" | "expediente"
  >("mesa-partes");

  const [busquedaOficina, setBusquedaOficina] = useState<BusquedaOficina>({
    dependencia: "",
    personal: "",
    tipoDoc: "",
    numDoc: "",
  });

  const [busquedaDni, setBusquedaDni] = useState<BusquedaDni>({
    numDni: "",
    tipoDoc: "",
    numDoc: "",
  });

  const [open, setOpen] = useState("searchExpediente");

  const handleTabOpen = (tabCategory: string) => {
    setOpen(tabCategory);
    onDatosExpediente(initialDataTree);
    setExpediente("");
    setBusquedaOficina({
      dependencia: "",
      personal: "",
      tipoDoc: "",
      numDoc: "",
    });
    setBusquedaDni({
      numDni: "",
      tipoDoc: "",
      numDoc: "",
    });
  };

  useEffect(() => {
    const obtenerTiposDocumento = async () => {
      setCargando(true);
      try {
        const res = await fetch("/api/documentos");
        const data = await res.json();
        setTiposDocumento(data);

        setDocumento(transformarDocumentos(data));
      } catch (error) {
        console.error("Error al obtener los tipos de documento:", error);
      } finally {
        setCargando(false);
      }
    };

    const obtenerDependencias = async () => {
      setCargando(true);
      try {
        const res = await fetch("/api/dependencias");
        const data = await res.json();

        setDependencias(transformarDependencias(data));
      } catch (error) {
        console.error("Error al obtener las dependencias:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerTiposDocumento();
    obtenerDependencias();
  }, []);

  const findPersonalByOficina = async (codOfic: string) => {
    setCargando(true);
    try {
      if (!codOfic.trim()) return; // evita peticiones vacías

      const personales = await fetch(`/api/personales?oficina=${codOfic}`);
      const data = await personales.json();
      setPersonales(transformarPersonales(data));
    } catch (error) {
      console.error("Error al obtener los personales:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleSelectChange = (value: string | number) => {
    findPersonalByOficina(value.toString());
    setBusquedaOficina({ ...busquedaOficina, dependencia: value.toString() });
  };

  const handleSelectChangePersonal = (value: string | number) => {
    setBusquedaOficina({ ...busquedaOficina, personal: value.toString() });
  };
  const handleSelectChangeDocumento = (value: string | number) => {
    setBusquedaOficina({ ...busquedaOficina, tipoDoc: value.toString() });
  };

  const handleNumDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const rawValue = value.replace(/\D/g, "").slice(0, 6);
    setBusquedaOficina({ ...busquedaOficina, [name]: rawValue });
  };

  {
    /**Para ingresar datos en los inputs. */
  }
  const handleExpedienteChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const rawValue = value.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 25);
    setExpediente(rawValue);
  };

  const handleTipoSeleccionado = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    setBusquedaDni({ ...busquedaDni, tipoDoc: value });
  };

  {
    /**Validar por numeros dni- numdoc */
  }
  const handleSearchDniChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const rawValue = value.replace(/\D/g, "").slice(0, 8);

    setBusquedaDni({ ...busquedaDni, [name]: rawValue });
  };

  {
    /**Para realizar la peticiones */
  }
  const handleSearchExpediente = async () => {
    setCargando(true);
    try {
      if (tipoBusqueda === "mesa-partes" && numMesaPartes !== "") {
        const numMP = `${anio}-${validateNumMesaPartes(numMesaPartes)}`;

        const response = await obtenerResumenPorExpediente({ exp: numMP });

        onDatosExpediente(response);
      } else if (expediente) {
        const response = await obtenerResumenPorExpediente({ exp: expediente });

        onDatosExpediente(response);
      } else {
        toast.error(
          "Ingrese los datos correspondientes en los campos de búsqueda."
        );
        onDatosExpediente(initialDataTree);
      }
      setExpediente("");
      setNumMesaPartes("");
    } catch (error: unknown) {
      let errorMessage = "Ocurrió un error al obtener los datos.";
      if (error instanceof Error) {
        if (
          error.message.includes("Documento no encontrado") ||
          error.message.includes("No se encontraron datos")
        ) {
          errorMessage = "Documento no encontrado.";
        } else if (error.message.includes("Parámetros inválidos")) {
          errorMessage = "Los parámetros proporcionados son inválidos.";
        } else if (error.message.includes("Error interno del servidor")) {
          errorMessage =
            "Error interno del servidor. Por favor, intenta de nuevo más tarde.";
        }
      }
      setError(errorMessage);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchExpediente();
    }
  };

  const handleSearchOficina = async () => {
    setCargando(true);

    if (validarAnyPropVacias(busquedaOficina)) {
      toast.error("Hay uno o varios campos vacíos en la búsqueda por Oficina.");
      return;
    }

    try {
      if (!validarAllPropVacias(busquedaOficina)) {
        const filtros = {
          ...busquedaOficina,
          numDoc: validateNumDoc(busquedaOficina.numDoc),
        };

        const queryParams = new URLSearchParams(
          filtros as Record<string, string>
        );

        const res = await fetch(
          `/api/seguimiento/oficina?${queryParams.toString()}`
        );

        if (!res.ok) {
          const error = await res.json();
          console.error("Error:", error);
          return;
        }
        const data = await res.json();
        onDatosExpediente(data);
      } else {
        onDatosExpediente(initialDataTree);
        toast.error("No se encontraron datos de la búsqueda del documento.");
        return;
      }
    } catch (error: unknown) {
      let errorMessage = "Ocurrió un error al obtener los datos.";
      if (error instanceof Error) {
        if (
          error.message.includes("Documento no encontrado") ||
          error.message.includes("No se encontraron datos")
        ) {
          errorMessage = "Documento no encontrado.";
        } else if (error.message.includes("Parámetros inválidos")) {
          errorMessage = "Los parámetros proporcionados son inválidos.";
        } else if (error.message.includes("Error interno del servidor")) {
          errorMessage =
            "Error interno del servidor. Por favor, intenta de nuevo más tarde.";
        }
      }
      setError(errorMessage);
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 7);
    setNumMesaPartes(rawValue);
  };

  const handleSearchDni = async () => {
    setCargando(true);

    if (validarAnyPropVacias(busquedaDni)) {
      toast.error("Hay uno o varios campos vacíos en la búsqueda por DNI.");
      return;
    }

    try {
      if (!validarAnyPropVacias(busquedaDni)) {
        const filtros = {
          ...busquedaDni,
          numDoc: validateNumDoc(busquedaDni.numDoc),
        };

        const queryParams = new URLSearchParams(
          filtros as Record<string, string>
        );

        const res = await fetch(
          `/api/seguimiento/dni?${queryParams.toString()}`
        );

        if (!res.ok) {
          const error = await res.json();
          console.error("Error:", error);
          return;
        }
        const data = await res.json();
        onDatosExpediente(data);
      } else {
        onDatosExpediente(initialDataTree);
        toast.error("No se encontro datos de la búsqueda por dni.");
        return;
      }
    } catch (error: unknown) {
      let errorMessage = "Ocurrió un error al obtener los datos.";
      if (error instanceof Error) {
        if (
          error.message.includes("Documento no encontrado") ||
          error.message.includes("No se encontraron datos")
        ) {
          errorMessage = "Documento no encontrado.";
        } else if (error.message.includes("Parámetros inválidos")) {
          errorMessage = "Los parámetros proporcionados son inválidos.";
        } else if (error.message.includes("Error interno del servidor")) {
          errorMessage =
            "Error interno del servidor. Por favor, intenta de nuevo más tarde.";
        }
      }
      setError(errorMessage);
      onDatosExpediente(initialDataTree);
    } finally {
      setCargando(false);
    }
  };

  const handleAnioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnio(e.target.value);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center justify-start gap-6 px-4 sm:px-6 md:px-8 pt-12 pb-24">

        <section className="w-full max-w-6xl rounded-2xl border border-muted/40 bg-white/80 dark:bg-gray-900/50 shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out px-6 py-10">

          <div className="w-full">

            <div className="flex flex-wrap justify-center gap-6">

              <div className="w-full px-2 sm:px-4">

                <div className="w-full space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center w-full mt-6">
                    {tabOptions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleTabOpen(item.value)}
                        className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold shadow-md transition 
                            ${open === item.value
                            ? "bg-primary text-white hover:scale-105"
                            : "bg-muted text-foreground hover:bg-muted/80 hover:scale-105"
                          }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>


                  <TabContent
                    details={
                      <>
                        <div className="flex justify-center flex-wrap gap-3 mb-6">
                          <button
                            onClick={() => setTipoBusqueda("mesa-partes")}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow transition-transform ${tipoBusqueda === "mesa-partes"
                                ? "bg-primary text-white hover:scale-105"
                                : "bg-muted text-foreground hover:bg-muted/80 hover:scale-105"
                              }`}
                          >
                            <Search className="w-5 h-5" />
                            Mesa de Partes
                          </button>

                          <button
                            onClick={() => setTipoBusqueda("expediente")}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow transition-transform ${tipoBusqueda === "expediente"
                                ? "bg-primary text-white hover:scale-105"
                                : "bg-muted text-foreground hover:bg-muted/80 hover:scale-105"
                              }`}
                          >
                            <Search className="w-5 h-5" />
                            Expediente
                          </button>
                        </div>

                        <div className="w-full flex flex-col md:flex-row items-center gap-4">
                          {tipoBusqueda === "expediente" ? (
                            <div className="flex items-center w-full bg-background rounded-xl shadow-md border border-muted overflow-hidden">
                              <div className="px-4 py-3">
                                <Search className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <input
                                type="text"
                                value={expediente}
                                onChange={handleExpedienteChange}
                                placeholder="Ej. 2025-001234 o GGOTIC2025000012345"
                                onKeyDown={handleKeyDown}
                                className="w-full py-3 px-4 text-base sm:text-lg bg-background text-foreground placeholder:text-muted-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center w-full bg-background rounded-xl shadow-md border border-muted overflow-hidden">
                              <div className="px-4 py-3">
                                <Search className="w-5 h-5 text-muted-foreground" />
                              </div>

                              <select
                                value={anio}
                                onChange={handleAnioChange}
                                className="appearance-none py-3 pl-3 pr-8 text-base sm:text-lg bg-background text-foreground border-none focus:outline-none"
                              >
                                {yearOptions.map((a) => (
                                  <option key={a} value={a}>
                                    {a}
                                  </option>
                                ))}
                              </select>

                              <div className="px-1 text-base sm:text-lg text-muted-foreground font-semibold">-</div>

                              <input
                                type="text"
                                value={numMesaPartes}
                                onChange={handleInputChange}
                                placeholder="0001234"
                                maxLength={7}
                                onKeyDown={handleKeyDown}
                                className="w-full py-3 px-4 text-base sm:text-lg bg-background text-foreground placeholder:text-muted-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                          )}

                          <button
                            onClick={handleSearchExpediente}
                            className="bg-primary text-white py-4 px-8 rounded-xl font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition"
                          >
                            Buscar
                          </button>
                        </div>

                        {error && (
                          <p className="text-destructive mt-4 text-center font-medium text-sm">
                            {error}
                          </p>
                        )}

                      </>
                    }
                    tabCategory="searchExpediente"
                    open={open}
                  />

                  {/*Dependencias */}
                  <TabContent
                    details={
                      <div className="w-full px-2 sm:px-4 md:px-6">
                        <div className="space-y-6">
                          <h1 className="text-xl xl:text-2xl font-semibold text-center text-foreground dark:text-white">
                            Datos del remitente
                          </h1>

                          <div className="flex flex-col gap-6 items-center">
                            {/* Dependencia */}
                            <div className="w-full max-w-[550px] flex flex-col gap-2">
                              <label className="font-medium text-sm text-muted-foreground">
                                Dependencia
                              </label>
                              <SearchSelect
                                options={dependencias}
                                onChange={handleSelectChange}
                                validationRegex={/[^a-zA-Z0-9\s]/g}
                                className="w-full"
                              />
                            </div>

                            {/* Personal */}
                            <div className="w-full max-w-[550px] flex flex-col gap-2">
                              <label className="font-medium text-sm text-muted-foreground">
                                Personal
                              </label>
                              <SearchSelect
                                options={personales}
                                onChange={handleSelectChangePersonal}
                                validationRegex={/[^a-zA-Z\s]/g}
                                className="w-full"
                              />
                            </div>

                            {/* Tipo de documento */}
                            <div className="w-full max-w-[550px] flex flex-col gap-2">
                              <label className="font-medium text-sm text-muted-foreground">
                                Tipo de Documento
                              </label>
                              <SearchSelect
                                options={documentos}
                                onChange={handleSelectChangeDocumento}
                                validationRegex={/[^a-zA-Z\s]/g}
                                className="w-full"
                              />
                            </div>

                            {/* Número de documento */}
                            <div className="w-full max-w-[550px] flex flex-col gap-2">
                              <label className="font-medium text-sm text-muted-foreground">
                                N° de Documento
                              </label>
                              <input
                                type="text"
                                name="numDoc"
                                value={busquedaOficina.numDoc}
                                maxLength={12}
                                onChange={handleNumDocumento}
                                placeholder="Ej: 000123"
                                className="w-full py-3 px-4 text-base rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-muted-foreground"
                              />
                            </div>
                          </div>

                          {/* Botón */}
                          <div className="flex justify-center mt-4">
                            <button
                              onClick={handleSearchOficina}
                              className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                              Buscar
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                    tabCategory="searchOffice"
                    open={open}
                  />


                  {/*Busqueda por dni */}
                  <TabContent
                    details={
                      <div className="w-full px-2 sm:px-4 md:px-6">
                        <div className="space-y-6">
                          <h1 className="text-xl xl:text-2xl font-semibold text-center text-foreground dark:text-white">
                            Datos del remitente
                          </h1>

                          <div className="flex flex-col gap-6 items-center">
                            {/* DNI */}
                            <div className="w-full max-w-[550px] flex flex-col gap-2">
                              <label className="font-medium text-sm text-muted-foreground">
                                DNI
                              </label>
                              <input
                                name="numDni"
                                type="text"
                                value={busquedaDni.numDni}
                                onChange={handleSearchDniChange}
                                placeholder="Ingrese DNI"
                                maxLength={8}
                                className="w-full py-3 px-4 text-base rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-muted-foreground"
                              />
                            </div>

                            {/* Tipo de documento */}
                            <div className="w-full max-w-[550px] flex flex-col gap-2">
                              <label className="font-medium text-sm text-muted-foreground">
                                Tipo de documento
                              </label>
                              <select
                                value={busquedaDni.tipoDoc}
                                onChange={handleTipoSeleccionado}
                                className="w-full py-3 px-4 text-base rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-muted-foreground"
                              >
                                <option value="" disabled>
                                  Seleccionar opción
                                </option>
                                {tiposDocumento.map((tipo) => (
                                  <option key={tipo.cdoc_tipdoc} value={tipo.cdoc_tipdoc}>
                                    {tipo.cdoc_desdoc}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* N° de documento */}
                            <div className="w-full max-w-[550px] flex flex-col gap-2">
                              <label className="font-medium text-sm text-muted-foreground">
                                Número de documento
                              </label>
                              <input
                                name="numDoc"
                                type="text"
                                value={busquedaDni.numDoc}
                                onChange={handleSearchDniChange}
                                maxLength={6}
                                placeholder="Ej: 000123"
                                className="w-full py-3 px-4 text-base rounded-xl bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-muted-foreground"
                              />
                            </div>
                          </div>

                          <div className="flex justify-center mt-6">
                            <button
                              onClick={handleSearchDni}
                              className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                              Buscar
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                    tabCategory="searchDni"
                    open={open}
                  />

                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full px-4 sm:px-6 md:px-8 mt-16 flex justify-center">
          <div className="w-full max-w-6xl rounded-2xl border border-muted/40 bg-white/60 dark:bg-gray-900/50 shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out p-6 sm:p-10">
            <TreeImproved datosExpediente={datosExpediente} />
          </div>
        </div>

      </div>
    </>
  );
}
