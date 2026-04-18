import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'text-foreground',
        // Risk levels — mapped to EUComply domain types
        minimal:
          'border-risk-minimal/30 bg-risk-minimal/10 text-risk-minimal',
        low:
          'border-risk-low/30 bg-risk-low/10 text-risk-low',
        medium:
          'border-risk-medium/30 bg-risk-medium/10 text-risk-medium',
        high:
          'border-risk-high/30 bg-risk-high/10 text-risk-high',
        critical:
          'border-risk-critical/30 bg-risk-critical/10 text-risk-critical',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
