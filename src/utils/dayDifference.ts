export function calcularDiferenciaEnDias(
  fechaInicioStr: string,
  fechaRecepcionStr?: string
): number {
  
  const fechaInicio = new Date(fechaInicioStr);
  const fechaRecepcion = fechaRecepcionStr
    ? new Date(fechaRecepcionStr)
    : new Date();

  // Normalizar ambas fechas a las 00:00:00

  fechaInicio.setHours(0, 0, 0, 0);
  fechaRecepcion.setHours(0, 0, 0, 0);

  const diferenciaEnMs = fechaRecepcion.getTime() - fechaInicio.getTime();
  
  const dias = Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24));

  return dias;
}
