import { query } from '@/lib/db';
import { Dependencia } from '@/models/dependencias';

export const getAllDependencias = async (): Promise<Dependencia[]> => {
  try {
    const result = await query<Dependencia>(`
      SELECT 
        rd.co_dependencia AS codigo, 
        CONCAT(rd.de_corta_depen, '-', rd.titulo_dep) AS dependencia 
      FROM idosgd.rhtm_dependencia rd 
      WHERE in_baja = '0' 
      ORDER BY rd.titulo_dep ASC;
    `);
    
    return result;
  } catch (error) {
    console.error('Error al obtener las dependencias:', error);
    throw new Error('Error al obtener las dependencias');
  }
};