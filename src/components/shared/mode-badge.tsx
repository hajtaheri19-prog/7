"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Users } from "lucide-react";

export const ModeBadge = ({ mode }: { mode?: string }) => {
    if (!mode) return null;
    const badgeInfo = {
        'دو نفره': { icon: <Users className="w-3 h-3" />, class: 'bg-blue-500/20 text-blue-700 dark:text-blue-400' },
        'مقابل سیستم': { icon: <Bot className="w-3 h-3" />, class: 'bg-purple-500/20 text-purple-700 dark:text-purple-400' },
        'تک نفره': { icon: <User className="w-3 h-3" />, class: 'bg-green-500/20 text-green-700 dark:text-green-400' },
        'دو حالته': { icon: <Users className="w-3 h-3" />, class: 'bg-orange-500/20 text-orange-700 dark:text-orange-400' },
    };
    const info = badgeInfo[mode as keyof typeof badgeInfo];
    if (!info) return null;

    return (
        <Badge variant="secondary" className={cn("absolute top-2 left-2 border-none text-xs px-1.5 py-0.5 h-auto", info.class)}>
            {info.icon}
        </Badge>
    );
};
