"use client";

import { cn } from "@/lib/utils";

export const OthelloIcon = ({ className }: { className?: string }) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-8 w-8", className)}>
        <circle cx="16" cy="16" r="14" fill="currentColor" className="text-emerald-500" />
        <path d="M16 2C23.732 2 30 8.26801 30 16C30 18.2523 29.3995 20.3753 28.3751 22.2474C25.7533 16.5971 20.597 8.24354 16 2Z" fill="white" />
        <path d="M16 30C8.26801 30 2 23.732 2 16C2 13.7477 2.60051 11.6247 3.62489 9.75259C6.24669 15.4029 11.403 23.7565 16 30Z" fill="black" />
    </svg>
);
