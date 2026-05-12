import { clsx } from "clsx";

interface RiskBadgeProps {
  level: "SAFE" | "MEDIUM" | "HIGH";
  size?: "sm" | "md" | "lg";
}

export default function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const config = {
    SAFE: {
      label: "SAFE",
      classes: "bg-safe/10 text-safe border-safe/30",
      dot: "bg-safe",
    },
    MEDIUM: {
      label: "MEDIUM RISK",
      classes: "bg-medium/10 text-medium border-medium/30",
      dot: "bg-medium",
    },
    HIGH: {
      label: "HIGH RISK",
      classes: "bg-danger/10 text-danger border-danger/30",
      dot: "bg-danger",
    },
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  const { label, classes, dot } = config[level];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wider uppercase",
        classes,
        sizeClasses[size]
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", dot)} />
      {label}
    </span>
  );
}
