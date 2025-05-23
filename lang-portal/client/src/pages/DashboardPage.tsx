import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson } from "@/lib/api";

// Define local interfaces based on actual API response
interface Word {
  id: number;
  dari: string;
  phonetic: string | null;
  english: string;
  notes: string | null;
  groupId?: number; // Include if needed
}

interface StudySession {
  id: number;
  groupId: number;
  groupName: string;
  startTime: string; // API returns string dates
  endTime: string | null;
  score: number | null;
  correctCount: number | null;
  incorrectCount: number | null;
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardData {
  lastStudySession: StudySession | null;
  progress: {
    totalWords: number;
    masteredWords: number;
    masteryProgress: number;
  };
  stats: {
    totalWords: number;
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
    queryFn: () => fetchJson<DashboardData>('/dashboard')
  });

  if (isLoading || !dashboard) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/study">Start Studying →</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Last Study Session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="i-lucide-history h-5 w-5" />
              Last Study Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.lastStudySession ? (
              <>
                <h3 className="font-semibold mb-2">{dashboard.lastStudySession.groupName}</h3>
                <p className="text-sm text-muted-foreground">
                  {dashboard.lastStudySession.correctCount} correct • {dashboard.lastStudySession.incorrectCount} wrong
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(dashboard.lastStudySession.startTime).toLocaleDateString()}
                </p>
                <Button variant="link" asChild className="mt-2 px-0">
                  <Link href={`/groups/${dashboard.lastStudySession.groupId}/words`}>
                    View Group →
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No study sessions yet</p>
            )}
          </CardContent>
        </Card>

        {/* Study Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="i-lucide-bar-chart h-5 w-5" />
              Study Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Total Words Studied</span>
                <span>{dashboard.progress.masteredWords} / {dashboard.progress.totalWords}</span>
              </div>
              <Progress value={dashboard.progress.masteryProgress} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Mastery Progress</span>
                <span>{dashboard.progress.masteryProgress}%</span>
              </div>
              <Progress value={dashboard.progress.masteryProgress} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="i-lucide-activity h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Success Rate</dt>
                <dd className="font-medium">{dashboard.stats.successRate}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Study Sessions</dt>
                <dd className="font-medium">{dashboard.stats.totalSessions}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Active Groups</dt>
                <dd className="font-medium">{dashboard.stats.activeGroups}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Study Streak</dt>
                <dd className="font-medium">{dashboard.stats.studyStreak} days</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Recently Added Words */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="i-lucide-list-plus h-5 w-5" />
              Recent Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.recentWords && dashboard.recentWords.length > 0 ? (
              <ul className="space-y-2">
                {dashboard.recentWords.map((word) => (
                  <li key={word.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium" dir="rtl">{word.dari}</span>
                    <span className="text-muted-foreground">{word.english}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent words found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 