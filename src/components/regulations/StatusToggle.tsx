'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/browser';

export type ChecklistStatus = 'not_started' | 'in_progress' | 'completed' | 'not_applicable';

const statusConfig: Record<ChecklistStatus, { label: string; emoji: string; classes: string }> = {
  not_started: {
    label: 'Pending',
    emoji: '○',
    classes: 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)]',
  },
  in_progress: {
    label: 'In Progress',
    emoji: '◐',
    classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  completed: {
    label: 'Completed',
    emoji: '●',
    classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  not_applicable: {
    label: 'N/A',
    emoji: '—',
    classes: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
  },
};

const statusOrder: ChecklistStatus[] = ['not_started', 'in_progress', 'completed', 'not_applicable'];

interface StatusToggleProps {
  companyId: string;
  checklistItemId: string;
  currentStatus: ChecklistStatus;
  onStatusChange?: (newStatus: ChecklistStatus) => void;
}

export function StatusToggle({
  companyId,
  checklistItemId,
  currentStatus,
  onStatusChange,
}: StatusToggleProps) {
  const [status, setStatus] = useState<ChecklistStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const config = statusConfig[status];

  const handleSelect = (newStatus: ChecklistStatus) => {
    setIsOpen(false);
    if (newStatus === status) return;

    const previousStatus = status;
    setStatus(newStatus);
    onStatusChange?.(newStatus);

    startTransition(async () => {
      const supabase = createClient();

      const { error } = await supabase
        .from('company_checklist')
        .upsert(
          {
            company_id: companyId,
            checklist_item_id: checklistItemId,
            status: newStatus,
            completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
          },
          { onConflict: 'company_id,checklist_item_id' }
        );

      if (error) {
        console.error('Failed to update checklist status:', error);
        setStatus(previousStatus);
        onStatusChange?.(previousStatus);
      }
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-opacity ${config.classes} ${isPending ? 'opacity-50' : 'hover:opacity-80'}`}
      >
        <span>{config.emoji}</span>
        <span>{config.label}</span>
        {isPending && <span className="animate-pulse">...</span>}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg">
            {statusOrder.map((s) => {
              const sc = statusConfig[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[var(--color-muted)] ${s === status ? 'font-semibold' : ''}`}
                >
                  <span>{sc.emoji}</span>
                  <span>{sc.label}</span>
                  {s === status && <span className="ml-auto">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
