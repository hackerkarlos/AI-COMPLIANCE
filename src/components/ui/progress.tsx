import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  /** Show percentage label beside the track */
  showLabel?: boolean;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showLabel = false, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const track = (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
          showLabel && 'flex-1',
          !showLabel && className
        )}
        {...props}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background:
              'linear-gradient(90deg, var(--color-accent) 0%, color-mix(in oklch, var(--color-accent) 75%, hsl(160 70% 55%)) 100%)',
          }}
        />
      </div>
    );

    if (!showLabel) return track;

    return (
      <div className={cn('flex items-center gap-3', className)}>
        {track}
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
