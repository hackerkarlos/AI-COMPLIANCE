'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Badge, Progress } from '@/components/ui';
import { ChecklistItem } from './ChecklistItem';
import type { ChecklistStatus } from './StatusToggle';

interface RegulationData {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  enforcement_date: string | null;
}

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

interface RegulationCardProps {
  regulation: RegulationData;
  items: ChecklistItemData[];
  statusMap: Record<string, ChecklistStatus>;
  companyId: string;
}

type SortOption = 'default' | 'priority' | 'effort' | 'status';
type FilterStatus = 'all' | ChecklistStatus;
type FilterPriority = 'all' | 'critical' | 'high' | 'medium' | 'low';
type FilterEffort = 'all' | 'minimal' | 'moderate' | 'significant';

const priorityRank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const effortRank: Record<string, number> = { significant: 0, moderate: 1, minimal: 2 };
const statusRank: Record<string, number> = { not_started: 0, in_progress: 1, completed: 2, not_applicable: 3 };

export function RegulationCard({ regulation, items, statusMap, companyId }: RegulationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localStatusMap, setLocalStatusMap] = useState(statusMap);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [filterEffort, setFilterEffort] = useState<FilterEffort>('all');

  const handleStatusChange = useCallback((itemId: string, newStatus: ChecklistStatus) => {
    setLocalStatusMap((prev) => ({ ...prev, [itemId]: newStatus }));
  }, []);

  // Compute compliance percentage
  const { completed, total, percentage } = useMemo(() => {
    let c = 0;
    let t = 0;
    for (const item of items) {
      const s = localStatusMap[item.id] ?? 'not_started';
      if (s === 'not_applicable') continue;
      t++;
      if (s === 'completed') c++;
    }
    return { completed: c, total: t, percentage: t > 0 ? Math.round((c / t) * 100) : 0 };
  }, [items, localStatusMap]);

  // Filter & sort
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filterStatus !== 'all') {
      result = result.filter((item) => (localStatusMap[item.id] ?? 'not_started') === filterStatus);
    }
    if (filterPriority !== 'all') {
      result = result.filter((item) => item.priority === filterPriority);
    }
    if (filterEffort !== 'all') {
      result = result.filter((item) => item.effort_level === filterEffort);
    }

    switch (sortBy) {
      case 'priority':
        result.sort((a, b) => (priorityRank[a.priority] ?? 2) - (priorityRank[b.priority] ?? 2));
        break;
      case 'effort':
        result.sort((a, b) => (effortRank[a.effort_level] ?? 1) - (effortRank[b.effort_level] ?? 1));
        break;
      case 'status':
        result.sort((a, b) => {
          const sa = localStatusMap[a.id] ?? 'not_started';
          const sb = localStatusMap[b.id] ?? 'not_started';
          return (statusRank[sa] ?? 0) - (statusRank[sb] ?? 0);
        });
        break;
      default:
        result.sort((a, b) => a.display_order - b.display_order);
    }

    return result;
  }, [items, localStatusMap, sortBy, filterStatus, filterPriority, filterEffort]);

  const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterEffort !== 'all';

  return (
    <Card>
      <Link href={`/regulations/${regulation.slug}`} className="block">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{regulation.short_name}</CardTitle>
                <Badge variant={regulation.risk_level}>{regulation.risk_level}</Badge>
                <span className="text-xs text-[var(--color-accent)] font-medium">View detail →</span>
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)]">{regulation.name}</p>
              {regulation.enforcement_date && (
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  Enforcement: {new Date(regulation.enforcement_date).toLocaleDateString('en-DK', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-lg font-bold">{percentage}%</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {completed}/{total} items
                </p>
              </div>
              <span className="text-[var(--color-muted-foreground)] text-lg transition-transform duration-200"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Progress value={percentage} />
          </div>
        </CardHeader>
      </Link>

      {isExpanded && (
        <CardContent className="pt-0">
          {/* Filter/Sort Bar */}
          <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-4">
            <div className="flex items-center gap-1">
              <label className="text-xs text-[var(--color-muted-foreground)]">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-xs"
              >
                <option value="default">Default</option>
                <option value="priority">Priority</option>
                <option value="effort">Effort</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <label className="text-xs text-[var(--color-muted-foreground)]">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-xs"
              >
                <option value="all">All</option>
                <option value="not_started">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="not_applicable">N/A</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <label className="text-xs text-[var(--color-muted-foreground)]">Priority:</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-xs"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <label className="text-xs text-[var(--color-muted-foreground)]">Effort:</label>
              <select
                value={filterEffort}
                onChange={(e) => setFilterEffort(e.target.value as FilterEffort)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1 text-xs"
              >
                <option value="all">All</option>
                <option value="minimal">Quick wins</option>
                <option value="moderate">Moderate</option>
                <option value="significant">Major</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterPriority('all');
                  setFilterEffort('all');
                }}
                className="text-xs text-[var(--color-accent)] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Checklist Items */}
          {filteredItems.length === 0 ? (
            <p className="py-4 text-center text-sm text-[var(--color-muted-foreground)]">
              No items match the current filters.
            </p>
          ) : (
            <div className="rounded-lg border border-[var(--color-border)]">
              {filteredItems.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  companyId={companyId}
                  currentStatus={localStatusMap[item.id] ?? 'not_started'}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

          <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
            Showing {filteredItems.length} of {items.length} items
          </p>
        </CardContent>
      )}
    </Card>
  );
}
