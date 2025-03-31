import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/dashboard/stats-card";
import { BookOpen, GraduationCap, Layers, History } from "lucide-react";
import type { Dashboard as DashboardType } from "@shared/schema";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useQuery<DashboardType>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Words"
          value={dashboard.stats.totalWords}
          icon={BookOpen}
        />
        <StatsCard
          title="Word Groups"
          value={dashboard.stats.totalGroups}
          icon={Layers}
        />
        <StatsCard
          title="Study Sessions"
          value={dashboard.stats.totalSessions}
          icon={History}
        />
        <StatsCard
          title="Average Score"
          value={`${dashboard.stats.averageScore}%`}
          icon={GraduationCap}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.recentSessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {new Date(session.startTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.score !== undefined ? `${session.score}%` : "In progress"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Words</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.recentWords.map((word) => (
                <div key={word.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{word.dariWord}</p>
                    <p className="text-sm text-muted-foreground">
                      {word.englishTranslation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}