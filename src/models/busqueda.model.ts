export interface BusquedaOficina {
    dependencia: string;
    personal: string;
    tipoDoc: string;
    numDoc: string;
}

/*export type BusquedaDni = Omit<BusquedaOficina, "codDependencia" | "codPersonal"> & {
    numDni: string;
}*/
export interface BusquedaDni{
    numDni:string;
    tipoDoc:string;
    numDoc:string;
}
