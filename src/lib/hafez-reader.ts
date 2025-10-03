import path from 'path';
import { promises as fs } from 'fs';

export type GhazalData = {
  id: number;
  poemFirst: string;
  poemLast: string;
  verses: string[];
  interpretation: string;
};

function normalizeText(input: string): string {
  return input
    .replace(/\r\n|\r/g, '\n')
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

function extractMesraFromFrontmatter(frontmatter: string): string[] {
  const lines = frontmatter.split('\n');
  const idx = lines.findIndex((l) => /^mesra\s*:\s*$/i.test(l.trim()));
  if (idx === -1) return [];
  const verses: string[] = [];
  for (let i = idx + 1; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^\s*-\s*(.+)$/);
    if (m) verses.push(m[1].trim());
    else if (line.trim() === '') continue; else break;
  }
  return verses;
}

async function readMdFile(fullPath: string): Promise<GhazalData | null> {
  const raw = await fs.readFile(fullPath, 'utf8');

  let verses: string[] = [];
  let interpretation = '';
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3);
    if (end !== -1) {
      const fm = raw.slice(3, end).trim();
      verses = extractMesraFromFrontmatter(fm);
      interpretation = normalizeText(raw.slice(end + 4));
    }
  }
  if (verses.length === 0) return null; // strictly require mesra list

  const poemFirst = verses[0] || '';
  const poemLast = verses.length > 1 ? verses[verses.length - 1] : verses[0] || '';

  const idMatch = path.basename(fullPath).match(/(\d{3})/);
  const id = idMatch ? Number(idMatch[1]) : 0;

  return { id, poemFirst, poemLast, verses, interpretation };
}

function getDefaultDir(): string {
  // Resolve based on project root
  return path.join(process.cwd(), 'src', 'app', 'api', 'hafez', 'ghazal');
}

export async function listGhazalFiles(baseDir?: string): Promise<string[]> {
  const dir = baseDir || getDefaultDir();
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /^(\d{3})\.md$/i.test(e.name))
    .map((e) => e.name)
    .sort();
}

export async function readGhazalById(id: number, baseDir?: string): Promise<GhazalData | null> {
  if (!Number.isFinite(id) || id < 1) return null;
  const filename = String(id).padStart(3, '0') + '.md';
  const dir = baseDir || getDefaultDir();
  const fullPath = path.join(dir, filename);
  try {
    return await readMdFile(fullPath);
  } catch {
    return null;
  }
}

export async function readRandomGhazal(baseDir?: string): Promise<GhazalData | null> {
  const dir = baseDir || getDefaultDir();
  const files = await listGhazalFiles(dir);
  if (!files.length) return null;
  // attempt up to 5 tries to find a file with mesra
  for (let i = 0; i < Math.min(5, files.length); i++) {
    const pick = files[Math.floor(Math.random() * files.length)];
    const data = await readMdFile(path.join(dir, pick));
    if (data) return data;
  }
  // fallback: sequential search
  for (const f of files) {
    const data = await readMdFile(path.join(dir, f));
    if (data) return data;
  }
  return null;
}


