"use client";

import React from 'react';
import Header from '@/components/layout/header';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home } from 'lucide-react';

const unslug = (s: string) => s.replace(/-/g, ' ');

export default function CategorySlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const name = unslug(slug || '');
  const [q, setQ] = React.useState('');

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-6">
          <div className="glass-effect rounded-3xl p-6 md:p-8 flex items-center justify-between">
            <nav className="text-sm text-muted-foreground flex items-center gap-2">
              <Link href="/" className="hover:text-foreground inline-flex items-center gap-1">
                <Home className="w-4 h-4" /> خانه
              </Link>
              <span>/</span>
              <span className="text-foreground">{name}</span>
            </nav>
            <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 text-sm hover:underline">
              بازگشت
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="glass-effect rounded-2xl p-4 md:p-5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`جستجو در ${name}...`}
              className="w-full bg-background/60 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Placeholder: link back to categories on home for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/" className="block">
              <Card className="glass-effect card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">بازگشت به دسته‌بندی‌ها</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


