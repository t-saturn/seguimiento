import { query } from '@/lib/db';
import { Documento } from '@/models/documentos.model';

export const getAllTiposDocumentos = async (): Promise<Documento[]> => {
  try {
    const result = await query<Documento>(`
      SELECT cdoc_desdoc, cdoc_tipdoc 
      FROM idosgd.si_mae_tipo_doc
      ORDER BY cdoc_desdoc ASC
  
    `);
    
    return result;
  } catch (error) {
    console.error('Error al obtener las dependencias:', error);
    throw new Error('Error al obtener las dependencias');
  }
};