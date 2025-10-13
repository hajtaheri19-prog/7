import { NextRequest, NextResponse } from 'next/server';
import { readGhazalById, readRandomGhazal as readRandomFromLib } from '@/lib/hafez-reader';

type HafezFortune = {
  id: number;
  poem: string;
  continuation: string;
  meaning: string;
  interpretation: string;
};
async function readRandomGhazal(specificId?: number): Promise<HafezFortune | null> {
  const data = specificId ? await readGhazalById(specificId) : await readRandomFromLib();
  if (!data) return null;
  return {
    id: data.id,
    poem: data.poemFirst,
    continuation: data.poemLast,
    meaning: '',
    interpretation: data.interpretation,
  };
}

export async function GET(req: NextRequest) {
  try {
    const idParam = req.nextUrl.searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : undefined;
    let fortune = await readRandomGhazal(id && Number.isFinite(id) ? id : undefined);
    // Retry a few times in case of non-matching files
    let attempts = 0;
    while (!fortune && attempts < 5 && !id) {
      fortune = await readRandomGhazal();
      attempts++;
    }
    if (!fortune) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json(fortune, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}


