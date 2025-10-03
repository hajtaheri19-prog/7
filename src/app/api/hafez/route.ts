import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

type HafezFortune = {
  id: number;
  poem: string;
  continuation: string;
  meaning: string;
  interpretation: string;
};

function normalizeText(input: string): string {
  return input
    .replace(/\r\n|\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

async function readRandomGhazal(): Promise<HafezFortune | null> {
  const dir = path.join(process.cwd(), 'hafez-fal.ir', 'content', 'ghazal');
  let files: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    files = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md')).map((e) => e.name);
  } catch {
    return null;
  }
  if (!files.length) return null;

  const pickIndex = Math.floor(Math.random() * files.length);
  const filename = files[pickIndex];
  const fullPath = path.join(dir, filename);
  const raw = await fs.readFile(fullPath, 'utf8');

  // Remove frontmatter if present
  let content = raw;
  if (content.startsWith('---')) {
    const end = content.indexOf('\n---', 3);
    if (end !== -1) content = content.slice(end + 4);
  }
  content = normalizeText(content);

  // Extract first two non-empty lines as poem and continuation
  const lines = content.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const poem = lines[0] || '';
  const continuation = lines[1] || '';

  const fortune: HafezFortune = {
    id: pickIndex + 1,
    poem,
    continuation,
    meaning: '',
    interpretation: content,
  };
  return fortune;
}

export async function GET() {
  try {
    const fortune = await readRandomGhazal();
    if (!fortune) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json(fortune, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}


