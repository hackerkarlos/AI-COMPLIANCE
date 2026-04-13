// Risk Level Indicator Component

interface RiskIndicatorProps {
  level: 'minimal' | 'low' | 'medium' | 'high';
  score?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const riskConfig = {
  minimal: {
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Minimal Risk'
  },
  low: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    label: 'Low Risk'
  },
  medium: {
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    label: 'Medium Risk'
  },
  high: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'High Risk'
  }
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export function RiskIndicator({ 
  level, 
  score, 
  showLabel = true, 
  size = 'md' 
}: RiskIndicatorProps) {
  const config = riskConfig[level];
  const sizeClasses = sizeConfig[size];

  return (
    <div className={`inline-flex items-center rounded-full border ${config.bg} ${config.border} ${sizeClasses}`}>
      <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} mr-2`} />
      {showLabel && (
        <span className={`font-medium ${config.color}`}>
          {config.label}
          {score !== undefined && ` (${score} points)`}
        </span>
      )}
    </div>
  );
}

interface ComplianceScoreProps {
  percentage: number;
  size?: number;
}

export function ComplianceScore({ percentage, size = 80 }: ComplianceScoreProps) {
  const circumference = 2 * Math.PI * ((size - 8) / 2);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (percent >= 90) return '#10b981'; // green
    if (percent >= 70) return '#f59e0b'; // yellow
    if (percent >= 50) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          stroke="var(--color-muted)"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          stroke={getColor(percentage)}
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-[var(--color-foreground)]">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}