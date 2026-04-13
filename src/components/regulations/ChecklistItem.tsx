import { Badge } from '@/components/ui';
import { StatusToggle, type ChecklistStatus } from './StatusToggle';

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

interface ChecklistItemProps {
  item: ChecklistItemData;
  companyId: string;
  currentStatus: ChecklistStatus;
  onStatusChange?: (itemId: string, newStatus: ChecklistStatus) => void;
}

const effortLabels: Record<string, { label: string; emoji: string }> = {
  minimal: { label: 'Quick win', emoji: '⚡' },
  moderate: { label: 'Moderate effort', emoji: '🔧' },
  significant: { label: 'Major effort', emoji: '🏗' },
};

export function ChecklistItem({ item, companyId, currentStatus, onStatusChange }: ChecklistItemProps) {
  const effort = effortLabels[item.effort_level] ?? { label: 'Moderate effort', emoji: '🔧' };

  return (
    <div className="border-b border-[var(--color-border)] px-6 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-[var(--color-muted-foreground)]">
              {item.code}
            </span>
            <Badge variant={item.priority}>{item.priority}</Badge>
            <span className="text-xs text-[var(--color-muted-foreground)]">
              {effort.emoji} {effort.label}
            </span>
          </div>
          <p className="text-sm font-medium text-[var(--color-foreground)]">{item.title}</p>
          {item.description && (
            <p className="text-sm text-[var(--color-muted-foreground)]">{item.description}</p>
          )}
          {item.guidance && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-medium text-[var(--color-accent)] hover:underline">
                View guidance
              </summary>
              <p className="mt-1 rounded-md bg-[var(--color-muted)] p-3 text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                {item.guidance}
              </p>
            </details>
          )}
        </div>
        <div className="flex-shrink-0">
          <StatusToggle
            companyId={companyId}
            checklistItemId={item.id}
            currentStatus={currentStatus}
            onStatusChange={(newStatus) => onStatusChange?.(item.id, newStatus)}
          />
        </div>
      </div>
    </div>
  );
}
