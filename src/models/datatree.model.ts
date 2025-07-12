export interface DataTree{
    expediente:string;
    documentos: DataResumen[];
}

export const initialDataTree = {
    expediente:"",
    documentos: [],
}

export interface DataResumen {
    nu_emi: string,
    co_dep_emi: string,
    oficina_remitente: string,
    empleado_remitente: string,
    fecha_emision: string,
    fecha_creacion:string;
    estado_emisor: string,
    co_dep_des: string,
    oficina_destino: string,
    empleado_destinatario: string,
    fecha_recepcion: string,
    descripcion_archivado: string;
    estado_destino: string,
    nu_doc_emi: string,
    tipo_documento: string,
    asunto:string;
    usuario_interesado: string;
}

export const initialDataResumen = {
    nu_emi: "",
    co_dep_emi: "",
    oficina_remitente: "",
    empleado_remitente: "",
    fecha_emision: "",
    fecha_creacion: "",
    estado_emisor: "",
    co_dep_des: "",
    oficina_destino: "",
    empleado_destinatario: "",
    fecha_recepcion: "",
    descripcion_archivado: "",
    estado_destino: "",
    nu_doc_emi: "",
    tipo_documento: "",
    asunto:"",
    usuario_interesado: "",
}