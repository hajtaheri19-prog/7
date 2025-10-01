"use client";

import { cn } from "@/lib/utils";

export const SnakeIcon = ({ className }: { className?: string }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-8 w-8 text-lime-400", className)}>
        <path d="M7.5 7.5c0-2 2-3 4.5-3s4.5 1 4.5 3-2 3-4.5 3-4.5-1-4.5-3z" />
        <path d="M4 10.5c0-2 2-3 4.5-3s4.5 1 4.5 3-2 3-4.5 3-4.5-1-4.5-3z" />
        <path d="M10.5 14c0-2 2-3 4.5-3s4.5 1 4.5 3-2 3-4.5 3-4.5-1-4.5-3z" />
    </svg>
);
