import { query } from '@/lib/db';
import { Personal } from '@/models/personal.model';

export const getPersonalesByDependencias = async (oficina:string): Promise<Personal[]> => {
    if (!oficina) {
    throw new Error('El parámetro oficina es obligatorio.');
  }
  try {
        //const params = [`%${oficina}%`];

    const result = await query<Personal>(`
      SELECT
        concat((
          SELECT string_agg(upper(substring(word, 1, 1)), '')
          FROM unnest(string_to_array(cemp_denom, ' ')) AS word),
          upper(substring(cemp_apepat, 1, 1)),
          upper(substring(cemp_apemat, 1, 1)),' - ',cemp_denom, ' ', cemp_apepat, ' ', cemp_apemat) AS personal, 
          cemp_codemp as codigo
      FROM idosgd.rhtm_per_empleados rpe
      WHERE rpe.co_dependencia = $1
      AND rpe.cemp_indbaj = '1'
      ORDER BY rpe.cemp_denom;
    `,[oficina]);
    
    return result;
  } catch (error) {
    console.error('Error al obtener los personales por dependencias:', error);
    throw new Error('Error al obtener los personales por dependencias.');
  }
};