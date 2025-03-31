import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="stats-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="stats-label">{title}</p>
          <p className="stats-value group-hover:scale-105 transition-transform">
            {value}
          </p>
        </div>
        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center space-x-2 mt-2">
          <span className={cn(
            "text-sm font-medium",
            trend.value >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-sm text-gray-500">{trend.label}</span>
        </div>
      )}
    </Card>
  );
} 