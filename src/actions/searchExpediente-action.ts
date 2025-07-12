"use server";
import { query } from "@/lib/db";
import { DataResumen } from "@/models/datatree.model";

interface PropExpediente {
  exp: string;
}

export async function obtenerResumenPorExpediente({ exp }: PropExpediente) {
  try {
    const result = await query<DataResumen>(
      `SELECT 
    rem.nu_emi,
    rem.co_dep_emi,
    dep_emi.de_dependencia AS oficina_remitente,
    CONCAT(
    split_part(emp_emi.cemp_denom, ' ', 1), ' ',
    CASE 
        WHEN array_length(string_to_array(emp_emi.cemp_denom, ' '), 1) > 1 
        THEN LEFT(split_part(emp_emi.cemp_denom, ' ', 2), 1) || '. '
        ELSE ''
    END,
    emp_emi.cemp_apepat, ' ',
    LEFT(emp_emi.cemp_apemat, 1), '.'
) AS empleado_remitente,
    rem.fe_emi AS fecha_emision,
    rem.fe_use_cre as fecha_creacion,
    rem.de_ori_emi as usuario_interesado,
    est_emi.de_est AS estado_emisor,
    des.co_dep_des,
    dep_des.de_dependencia AS oficina_destino,
    CONCAT(
    split_part(emp_des.cemp_denom, ' ', 1), ' ',
    CASE 
        WHEN array_length(string_to_array(emp_des.cemp_denom, ' '), 1) > 1 
        THEN LEFT(split_part(emp_des.cemp_denom, ' ', 2), 1) || '. '
        ELSE ''
    END,
    emp_des.cemp_apepat, ' ',
    LEFT(emp_des.cemp_apemat, 1), rem.de_ori_des
) AS empleado_destinatario,
    des.fe_rec_doc AS fecha_recepcion,
    des.de_ane AS descripcion_archivado,
    est_dest.de_est AS estado_destino,
    rem.nu_doc_emi,
    doc.cdoc_desdoc AS tipo_documento,
    rem.de_asu as asunto
FROM 
    idosgd.tdtv_remitos rem
INNER JOIN 
    idosgd.tdtx_remitos_resumen trr ON trr.nu_emi = rem.nu_emi
LEFT JOIN 
    idosgd.tdtv_destinos des ON rem.nu_emi = des.nu_emi
LEFT JOIN 
    idosgd.rhtm_per_empleados emp_emi ON rem.co_emp_emi = emp_emi.cemp_codemp
LEFT JOIN 
    idosgd.rhtm_dependencia dep_emi ON rem.co_dep_emi = dep_emi.co_dependencia
LEFT JOIN 
    idosgd.si_mae_tipo_doc doc ON rem.co_tip_doc_adm = doc.cdoc_tipdoc
LEFT JOIN 
    idosgd.tdtr_estados est_emi ON est_emi.co_est = rem.es_doc_emi AND est_emi.de_tab = 'TDTV_REMITOS'
LEFT JOIN 
    idosgd.rhtm_per_empleados emp_des ON des.co_emp_des = emp_des.cemp_codemp
LEFT JOIN 
    idosgd.rhtm_dependencia dep_des ON des.co_dep_des = dep_des.co_dependencia
LEFT JOIN 
    idosgd.tdtr_estados est_dest ON est_dest.co_est = des.es_doc_rec AND est_dest.de_tab = 'TDTV_DESTINOS'
WHERE 
    trr.nu_expediente = $1
    AND rem.es_doc_emi != '9'
ORDER BY 
    rem.nu_emi DESC;
    `,
      [exp]
    );

    return { expediente: exp, documentos: result };
  } catch (error) {
    console.error("Error en el servicio de obtener expedientes:", error);
    throw new Error("Error en la base de datos");
  }
}
