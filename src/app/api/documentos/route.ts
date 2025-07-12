import { getAllTiposDocumentos } from '@/actions/getTipoDocumento-action';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const tiposDocunentos = await getAllTiposDocumentos();
        return NextResponse.json(tiposDocunentos);
    } catch (error) {
        console.error("Error API /api/dependencias:", error);
        return NextResponse.json({ error: 'Error al obtener dependencias' }, { status: 500 });
    }
}
