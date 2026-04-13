'use client';

import { useState, useTransition } from 'react';
import { Badge } from '@/components/ui';
import type { ChecklistStatus } from './StatusToggle';

interface ChecklistItemData {
  id: string;
  code: string;
  title: string;
  description: string | null;
  guidance: string | null;
  category: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort_level: 'minimal' | 'moderate' | 'significant';
  display_order: number;
}

interface ProgressEntry {
  status: ChecklistStatus;
  notes: string | null;
  evidence_url: string | null;
}

interface ChecklistItemProps {
  item: ChecklistItemData;
  companyId: string;
  progress: ProgressEntry;
  onUpdate?: () => void;
}

const effortLabels: Record<string, { label: string; emoji: string }> = {
  minimal: { label: 'Quick win', emoji: '⚡' },
  moderate: { label: 'Moderate effort', emoji: '🔧' },
  significant: { label: 'Major effort', emoji: '🏗' },
};

const statusConfig: Record<
  ChecklistStatus,
  { label: string; emoji: string; classes: string }
> = {
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

export function ChecklistItemExpanded({
  item,
  companyId,
  progress,
  onUpdate,
}: ChecklistItemProps) {
  const [status, setStatus] = useState<ChecklistStatus>(progress.status);
  const [notes, setNotes] = useState(progress.notes ?? '');
  const [evidenceUrl, setEvidenceUrl] = useState(progress.evidence_url ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);

  const effort = effortLabels[item.effort_level] ?? { label: 'Moderate effort', emoji: '🔧' };
  const currentConfig = statusConfig[status];

  const statusOrder: ChecklistStatus[] = [
    'not_started',
    'in_progress',
    'completed',
    'not_applicable',
  ];

  const handleSave = () => {
    startTransition(async () => {
      try {
        const resp = await fetch('/api/checklist-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checklistItemId: item.id,
            status,
            notes: notes.trim() || null,
            evidenceUrl: evidenceUrl.trim() || null,
          }),
        });
        if (!resp.ok) {
          throw new Error('Failed to save');
        }
        onUpdate?.();

        // Close dropdown and editing panel
        setIsDropdownOpen(false);
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update checklist item:', err);
      }
    });
  };

  const handleStatusChange = (newStatus: ChecklistStatus) => {
    setStatus(newStatus);
    setIsDropdownOpen(false);
    // Auto-save status change
    startTransition(async () => {
      try {
        await fetch('/api/checklist-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checklistItemId: item.id,
            status: newStatus,
            notes: notes.trim() || null,
            evidenceUrl: evidenceUrl.trim() || null,
          }),
        });
        onUpdate?.();
      } catch (err) {
        console.error('Failed to update checklist item:', err);
      }
    });
  };

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <div className="px-6 py-4">
        {/* Header Row */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]"
            aria-label={isExpanded ? 'Collapse item' : 'Expand item'}
          >
            {isExpanded ? '▾' : '▸'}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="font-mono text-xs text-[var(--color-muted-foreground)]">
                {item.code}
              </span>
              <Badge variant={item.priority}>{item.priority}</Badge>
              <span className="text-xs text-[var(--color-muted-foreground)]">
                {effort.emoji} {effort.label}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--color-foreground)]">
              {item.title}
            </p>
            {item.description && (
              <p className="mt-0.5 text-sm text-[var(--color-muted-foreground)]">
                {item.description}
              </p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isPending}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-opacity ${currentConfig.classes} ${isPending ? 'opacity-50' : 'hover:opacity-80'}`}
            >
              <span>{currentConfig.emoji}</span>
              <span>{currentConfig.label}</span>
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] shadow-lg">
                  {statusOrder.map((s) => {
                    const sc = statusConfig[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleStatusChange(s)}
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
        </div>

        {/* Guidance — always show in the expanded view */}
        {item.guidance && (
          <div className="ml-6 mt-3 rounded-md bg-[var(--color-muted)] p-3 text-xs text-[var(--color-muted-foreground)] leading-relaxed">
            <span className="font-medium text-[var(--color-foreground)]">Guidance: </span>
            {item.guidance}
          </div>
        )}

        {/* Notes + Evidence URL section — collapsible */}
        {isExpanded && (
          <div className="ml-6 mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
            <div>
              <label
                htmlFor={`notes-${item.id}`}
                className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]"
              >
                Notes
              </label>
              <textarea
                id={`notes-${item.id}`}
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this checklist item..."
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div>
              <label
                htmlFor={`evidence-${item.id}`}
                className="mb-1 block text-xs font-medium text-[var(--color-muted-foreground)]"
              >
                Evidence URL
              </label>
              <input
                id={`evidence-${item.id}`}
                type="url"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://... (link to documentation, screenshot, etc.)"
                className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setNotes(progress.notes ?? '');
                  setEvidenceUrl(progress.evidence_url ?? '');
                  setStatus(progress.status);
                  setIsEditing(false);
                  setIsExpanded(false);
                }}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="rounded-md bg-[var(--color-accent)] px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ChecklistItemGroupProps {
  category: string;
  items: ChecklistItemData[];
  companyId: string;
  progressMap: Record<string, ProgressEntry>;
  regulationId: string;
}

const defaultProgress: ProgressEntry = {
  status: 'not_started',
  notes: null,
  evidence_url: null,
};

export function ChecklistItemGroup({
  category,
  items,
  companyId,
  progressMap,
  regulationId,
}: ChecklistItemGroupProps) {
  // No-op updater — the server data will refresh when navigating back to the page
  // For immediate feedback, the client state handles it
  const [, setTick] = useState(0);
  const triggerUpdate = () => setTick((t) => t + 1);

  // Compute category completion
  let catTotal = 0;
  let catDone = 0;
  for (const item of items) {
    const s = progressMap[item.id]?.status ?? 'not_started';
    if (s === 'not_applicable') continue;
    catTotal++;
    if (s === 'completed') catDone++;
  }
  const catPct = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-muted)] px-6 py-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold">{category}</h3>
          <span className="rounded-full bg-[var(--color-background)] px-2 py-0.5 text-xs text-[var(--color-muted-foreground)]">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
          <span>
            {catDone}/{catTotal} completed
          </span>
          <div className="h-2 w-20 overflow-hidden rounded-full bg-[var(--color-muted)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
              style={{ width: `${catPct}%` }}
            />
          </div>
          <span className="font-medium">{catPct}%</span>
        </div>
      </div>

      {/* Items */}
      {items.map((item) => (
        <ChecklistItemExpanded
          key={item.id}
          item={item}
          companyId={companyId}
          progress={progressMap[item.id] ?? defaultProgress}
          onUpdate={triggerUpdate}
        />
      ))}
    </div>
  );
}
