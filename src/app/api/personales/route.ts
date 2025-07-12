export const runtime = 'nodejs';
import { getPersonalesByDependencias } from '@/actions/getPersonalesDependencia-action';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filtroOficina = searchParams.get('oficina');

    if (!filtroOficina) {
        return NextResponse.json(
            { error: 'El parámetro "oficina" es obligatorio en la solicitud.' },
            { status: 400 }
        );
    }

    try {
        const dependencias = await getPersonalesByDependencias(filtroOficina);
        return NextResponse.json(dependencias);
    } catch (error) {
        console.error("Error API /api/personales:", error);
            return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });

    }
}
