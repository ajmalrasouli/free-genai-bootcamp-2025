import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/dashboard/stats-card";
import { BookOpen, GraduationCap, Layers, History } from "lucide-react";
import { fetchJson } from "@/lib/api";

// Define Dashboard types locally
interface StudySession {
  id: number;
  groupName: string;
  startTime: string;
  endTime?: string;
  score?: number;
  correctCount: number;
  incorrectCount: number;
}

interface Word {
  id: number;
  dariWord: string;
  pronunciation: string;
  englishTranslation: string;
  exampleSentence: string;
}

interface Dashboard {
  lastStudySession?: StudySession;
  progress: {
    totalWords: number;
    masteredWords: number;
    masteryProgress: number;
  };
  stats: {
    totalWords: number;
    masteredWords: number;
    totalGroups: number;
    activeGroups: number;
    totalSessions: number;
    successRate: number;
    studyStreak: number;
  };
  recentSessions: StudySession[];
  recentWords: Word[];
}

export function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    queryFn: () => fetchJson<Dashboard>("/dashboard"),
    refetchOnMount: true,
    staleTime: 0
  });

  console.log("Dashboard data:", dashboard);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const lastSession = dashboard?.lastStudySession;
  const progress = dashboard?.progress || { totalWords: 0, masteredWords: 0, masteryProgress: 0 };
  const stats = dashboard?.stats || { 
    totalWords: 0, 
    masteredWords: 0,
    totalGroups: 0,
    activeGroups: 0,
    totalSessions: 0,
    successRate: 0,
    studyStreak: 0
  };
  const recentSessions = dashboard?.recentSessions || [];
  const recentWords = dashboard?.recentWords || [];

  // Calculate percentage for display
  const masteryProgressPercent = progress.masteryProgress;
  const masteredWordsPercent = (progress.masteredWords / progress.totalWords) * 100 || 0;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/study">
          <Button size="lg" className="h-12 text-lg">
            Start Studying
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Last Study Session */}
        <Card>
          <CardHeader>
            <CardTitle>Last Study Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {lastSession ? new Date(lastSession.startTime).toLocaleDateString() : "No sessions yet"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Words Reviewed</span>
                <span className="font-medium">
                  {lastSession ? lastSession.correctCount + lastSession.incorrectCount : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-medium">
                  {lastSession ? 
                    `${Math.round((lastSession.correctCount / (lastSession.correctCount + lastSession.incorrectCount)) * 100) || 0}%` 
                    : "0%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">
                    {masteryProgressPercent}%
                  </span>
                </div>
                <Progress value={masteryProgressPercent} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Words Mastered</span>
                  <span className="font-medium">
                    {progress.masteredWords}
                  </span>
                </div>
                <Progress value={masteredWordsPercent} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Words</span>
                <span className="font-medium">
                  {stats.totalWords}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Words Learned</span>
                <span className="font-medium">
                  {stats.masteredWords}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Study Streak</span>
                <span className="font-medium">
                  {stats.studyStreak} days
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Words"
          value={stats.totalWords}
          icon={BookOpen}
        />
        <StatsCard
          title="Word Groups"
          value={stats.totalGroups}
          icon={Layers}
        />
        <StatsCard
          title="Study Sessions"
          value={stats.totalSessions}
          icon={History}
        />
        <StatsCard
          title="Average Score"
          value={`${stats.successRate}%`}
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
              {recentSessions.length > 0 ? (
                recentSessions.map((session) => (
                  <div key={session.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {new Date(session.startTime).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.groupName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {session.score !== undefined ? `${session.score}%` : "In progress"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent sessions</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Words</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWords.length > 0 ? (
                recentWords.map((word) => (
                  <div key={word.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium" dir="rtl">{word.dariWord}</p>
                      <p className="text-sm text-muted-foreground">
                        {word.englishTranslation}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent words</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}