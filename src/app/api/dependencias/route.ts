import { getAllDependencias } from '@/actions/getDependencia-action';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dependencias = await getAllDependencias();
    return NextResponse.json(dependencias);
  } catch (error) {
    console.error("Error API /api/dependencias:", error);
    return NextResponse.json({ error: 'Error al obtener dependencias' }, { status: 500 });
  }
}
