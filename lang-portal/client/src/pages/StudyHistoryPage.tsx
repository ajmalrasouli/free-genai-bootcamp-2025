import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudySession } from "@shared/schema";

export function StudyHistoryPage() {
  const { data: sessions = [], isLoading } = useQuery<StudySession[]>({
    queryKey: ["/api/study_sessions"],
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Study History</h1>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Link key={session.id} href={`/study-sessions/${session.id}`}>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle>Study Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Started at: {new Date(session.startTime).toLocaleString()}
                  </p>
                  {session.endTime && (
                    <p className="text-sm text-muted-foreground">
                      Completed at: {new Date(session.endTime).toLocaleString()}
                    </p>
                  )}
                  {session.score !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      Score: {session.score}%
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 