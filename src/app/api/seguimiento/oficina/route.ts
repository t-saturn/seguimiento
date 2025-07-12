
import { obtenerResumenPorOficina } from '@/actions/searchOficina-action';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const dependencia = searchParams.get('dependencia');
    const personal = searchParams.get('personal');
    const tipoDoc = searchParams.get('tipoDoc');
    const numDoc = searchParams.get('numDoc');

    // ✅ Validar que todos los parámetros estén presentes
    if (!dependencia || !personal || !tipoDoc || !numDoc) {
        return NextResponse.json(
            { error: 'Todos los parámetros son obligatorios: dependencia, oficina, tipodoc, numdoc' },
            { status: 400 }
        );
    }
    try {
        const result = await obtenerResumenPorOficina(
            dependencia,
            personal,
            tipoDoc,
            numDoc,
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error en /api/seguimiento/oficina:", error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
