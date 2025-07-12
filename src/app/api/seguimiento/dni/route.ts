
import { obtenerResumenPorDni } from '@/actions/searchDni-action';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const numDni = searchParams.get('numDni');
    const tipoDoc = searchParams.get('tipoDoc');
    const numDoc = searchParams.get('numDoc');

    // ✅ Validar que todos los parámetros estén presentes
    if (!numDni || !tipoDoc || !numDoc) {
        return NextResponse.json(
            { error: 'Todos los parámetros son obligatorios: dni, tipo Documento, numero Documento' },
            { status: 400 }
        );
    }

    try {
        const dependencias = await obtenerResumenPorDni(
            numDni,
            tipoDoc,
            numDoc
        );

        return NextResponse.json(dependencias);
    } catch (error) {
        console.error("Error en /api/seguimiento/dni:", error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
