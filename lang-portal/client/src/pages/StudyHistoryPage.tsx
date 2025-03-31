import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson } from "@/lib/api";

// Define the StudySession type locally
interface StudySession {
  id: number;
  groupName: string;
  startTime: string;
  endTime?: string;
  score?: number;
  correctCount: number;
  incorrectCount: number;
}

export function StudyHistoryPage() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["/api/study_sessions"],
    queryFn: () => fetchJson<StudySession[]>("/study_sessions"),
    refetchOnMount: true,
    staleTime: 0
  });

  console.log("Study sessions:", sessions);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold">Study History</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You haven't completed any study sessions yet. Start studying to see your progress here!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Study History</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col md:flex-row md:justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1 mb-2 md:mb-0">
                  <p className="font-semibold text-lg">
                    {session.groupName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {
                      session.endTime 
                        ? formatDuration(new Date(session.endTime).getTime() - new Date(session.startTime).getTime())
                        : "In progress"
                    }
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xl font-bold">
                    {session.score !== undefined && session.score !== null ? `${session.score}%` : "In progress"}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">
                      {session.correctCount} correct
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-xs font-medium">
                      {session.incorrectCount} incorrect
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {session.correctCount + session.incorrectCount} words reviewed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to format duration
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  
  if (minutes === 0) {
    return `${seconds} sec`;
  }
  
  return `${minutes} min ${seconds} sec`;
} 