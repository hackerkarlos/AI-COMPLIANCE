'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps extends HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
}

function Sidebar({ className, collapsed = false, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-card transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex h-14 items-center border-b border-border px-4', className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto p-4', className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-t border-border p-4', className)}
      {...props}
    />
  );
}

interface SidebarNavItemProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: ReactNode;
}

function SidebarNavItem({
  className,
  active = false,
  icon,
  children,
  ...props
}: SidebarNavItemProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-muted text-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
}

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarNavItem };
