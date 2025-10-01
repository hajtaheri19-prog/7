import React from 'react';

export interface ToolItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  component?: React.ComponentType;
  mode?: string;
  isWip?: boolean;
  isExternal?: boolean;
  href?: string;
}

export interface ToolCategory {
  title: string;
  slug: string;
  icon: React.ReactNode;
  tools: ToolItem[];
}

export const toolCategories: ToolCategory[] = [];


