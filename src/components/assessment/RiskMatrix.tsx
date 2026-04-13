/**
 * RiskMatrix — 5×5 likelihood × impact grid.
 *
 * Each cell is colour-coded by risk zone and shows item count.
 * Axes:
 *   X = Likelihood (1=Rare → 5=Almost Certain), derived from compliance status + confidence
 *   Y = Impact     (1=Negligible → 5=Catastrophic), derived from checklist item priority
 */

interface MatrixItem {
  code: string;
  title: string;
  likelihood: number; // 1–5
  impact: number;     // 1–5
  status: string;
  priority: string;
}

interface RiskMatrixProps {
  items: MatrixItem[];
}

// ─── Zone colour mapping (standard risk matrix) ──────────────────────────────

type ZoneKey = `${number},${number}`;

const ZONE_COLORS: Record<ZoneKey, string> = {
  // Critical — red
  '5,5': 'bg-red-600',   '5,4': 'bg-red-600',   '4,5': 'bg-red-600',
  '5,3': 'bg-orange-500','4,4': 'bg-orange-500','3,5': 'bg-orange-500',
  // High — orange
  '5,2': 'bg-orange-400','4,3': 'bg-orange-400','3,4': 'bg-orange-400','2,5': 'bg-orange-400',
  // Medium — yellow
  '5,1': 'bg-yellow-400','4,2': 'bg-yellow-400','3,3': 'bg-yellow-400','2,4': 'bg-yellow-400','1,5': 'bg-yellow-400',
  '4,1': 'bg-yellow-300','3,2': 'bg-yellow-300','2,3': 'bg-yellow-300','1,4': 'bg-yellow-300',
  // Low — green
  '3,1': 'bg-green-300', '2,2': 'bg-green-300', '1,3': 'bg-green-300',
  '2,1': 'bg-green-200', '1,2': 'bg-green-200',
  '1,1': 'bg-green-100',
};

const TEXT_COLORS: Record<ZoneKey, string> = {
  '5,5': 'text-white', '5,4': 'text-white', '4,5': 'text-white',
  '5,3': 'text-white', '4,4': 'text-white', '3,5': 'text-white',
  '5,2': 'text-white', '4,3': 'text-white', '3,4': 'text-white', '2,5': 'text-white',
  '5,1': 'text-gray-800', '4,2': 'text-gray-800', '3,3': 'text-gray-800', '2,4': 'text-gray-800', '1,5': 'text-gray-800',
  '4,1': 'text-gray-800', '3,2': 'text-gray-800', '2,3': 'text-gray-800', '1,4': 'text-gray-800',
  '3,1': 'text-gray-800', '2,2': 'text-gray-800', '1,3': 'text-gray-800',
  '2,1': 'text-gray-700', '1,2': 'text-gray-700',
  '1,1': 'text-gray-500',
};

function getCellClasses(likelihood: number, impact: number): { bg: string; text: string } {
  const key: ZoneKey = `${likelihood},${impact}`;
  return {
    bg: ZONE_COLORS[key] ?? 'bg-gray-100',
    text: TEXT_COLORS[key] ?? 'text-gray-600',
  };
}

const LIKELIHOOD_LABELS = ['', 'Rare', 'Unlikely', 'Possible', 'Likely', 'Almost\nCertain'];
const IMPACT_LABELS = ['', 'Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'];

export function RiskMatrix({ items }: RiskMatrixProps) {
  // Build cell → items map
  const cellMap = new Map<string, MatrixItem[]>();
  for (const item of items) {
    const key = `${item.likelihood},${item.impact}`;
    const existing = cellMap.get(key) ?? [];
    existing.push(item);
    cellMap.set(key, existing);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Y-axis label */}
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center justify-center" style={{ writingMode: 'vertical-rl' }}>
              <span className="rotate-180 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Impact →
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {/* Grid rows: impact 5 (top) → 1 (bottom) */}
              {[5, 4, 3, 2, 1].map((impact) => (
                <div key={impact} className="flex items-center gap-1">
                  {/* Row label */}
                  <div className="w-20 text-right text-xs text-[var(--color-muted-foreground)]">
                    <span className="font-semibold">{impact}</span>{' '}
                    <span className="hidden sm:inline">{IMPACT_LABELS[impact]}</span>
                  </div>

                  {/* Cells for likelihood 1→5 */}
                  {[1, 2, 3, 4, 5].map((likelihood) => {
                    const cellItems = cellMap.get(`${likelihood},${impact}`) ?? [];
                    const { bg, text } = getCellClasses(likelihood, impact);
                    return (
                      <div
                        key={likelihood}
                        className={`flex h-14 w-14 flex-col items-center justify-center rounded text-center ${bg} ${text} transition-opacity`}
                        title={cellItems.map((i) => `[${i.code}] ${i.title}`).join('\n')}
                      >
                        {cellItems.length > 0 ? (
                          <>
                            <span className="text-lg font-bold leading-none">{cellItems.length}</span>
                            <span className="mt-0.5 text-xs opacity-80">
                              {cellItems.length === 1 ? 'item' : 'items'}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs opacity-30">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* X-axis labels */}
              <div className="flex items-start gap-1 pl-[84px]">
                {[1, 2, 3, 4, 5].map((l) => (
                  <div key={l} className="flex w-14 flex-col items-center text-center">
                    <span className="text-xs font-semibold text-[var(--color-muted-foreground)]">{l}</span>
                    <span className="mt-0.5 hidden text-[10px] leading-tight text-[var(--color-muted-foreground)] sm:block">
                      {LIKELIHOOD_LABELS[l]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-axis label */}
          <div className="mt-2 pl-[100px] text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Likelihood →
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-green-300" />
          Low risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-yellow-400" />
          Medium risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-orange-500" />
          High risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-red-600" />
          Critical risk
        </span>
      </div>

      {/* Item tooltip-style list for small screens */}
      {items.length > 0 && (
        <details className="rounded-md border border-[var(--color-border)] text-xs">
          <summary className="cursor-pointer px-3 py-2 font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
            View item placement details ({items.length} items plotted)
          </summary>
          <div className="divide-y divide-[var(--color-border)]">
            {items.map((item) => {
              const { bg, text } = getCellClasses(item.likelihood, item.impact);
              return (
                <div key={item.code} className="flex items-center gap-3 px-3 py-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold ${bg} ${text}`}>
                    L{item.likelihood}×I{item.impact}
                  </span>
                  <span className="font-medium">[{item.code}]</span>
                  <span className="text-[var(--color-muted-foreground)]">{item.title}</span>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
