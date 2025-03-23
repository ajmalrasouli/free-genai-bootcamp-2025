import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowRight, CheckCircle2, Trophy } from "lucide-react";

interface LastStudySession {
  groupName: string;
  date: string;
  correct: number;
  total: number;
}

interface StudyProgress {
  totalWords: number;
  totalStudied: number;
  mastery: number;
}

interface QuickStats {
  successRate: number;
  totalSessions: number;
  activeGroups: number;
  streak: number;
}

export default function Dashboard() {
  const { data: lastSession, isLoading: isLoadingSession } = useQuery<LastStudySession>({
    queryKey: ["dashboard", "last_study_session"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/last_study_session");
      return response.json();
    }
  });

  const { data: progress, isLoading: isLoadingProgress } = useQuery<StudyProgress>({
    queryKey: ["dashboard", "study_progress"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/study_progress");
      return response.json();
    }
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<QuickStats>({
    queryKey: ["dashboard", "quick-stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/quick-stats");
      return response.json();
    }
  });

  const isLoading = isLoadingSession || isLoadingProgress || isLoadingStats;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link href="/study">
            <Button>
              Start Studying
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/study">
          <Button>
            Start Studying
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Last Study Session */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Last Study Session</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {lastSession ? (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{lastSession.groupName}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  <span>{lastSession.correct} correct</span>
                  <span className="mx-1">•</span>
                  <span>{lastSession.total - lastSession.correct} wrong</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(lastSession.date).toLocaleDateString()}
                </p>
                <Link href={`/study/${lastSession.groupName}`} className="text-sm text-blue-500 hover:underline">
                  View Group →
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground">No study sessions yet</p>
            )}
          </CardContent>
        </Card>

        {/* Study Progress */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Study Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Total Words Studied</span>
                  <span className="font-medium">
                    {progress?.totalStudied} / {progress?.totalWords}
                  </span>
                </div>
                <Progress value={(progress?.totalStudied || 0) / (progress?.totalWords || 1) * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mastery Progress</span>
                  <span className="font-medium">{progress?.mastery || 0}%</span>
                </div>
                <Progress value={progress?.mastery || 0} className="bg-blue-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-medium">{stats?.successRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Study Sessions</span>
                <span className="font-medium">{stats?.totalSessions || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Groups</span>
                <span className="font-medium">{stats?.activeGroups || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Study Streak</span>
                <span className="font-medium">{stats?.streak || 0} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}