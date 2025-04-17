import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson, postJson } from "@/lib/api";
import { toast } from "sonner";

interface GroupWithCount {
  id: number;
  name: string;
  description: string | null;
  wordCount?: number;
}

interface Session {
  id: number;
  groupId: number;
  groupName: string;
  startTime: string;
}

export function StudyPage() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["/api/groups"],
    queryFn: () => fetchJson<GroupWithCount[]>("/groups"),
    refetchOnMount: true,
    staleTime: 0
  });

  const startSession = async (groupId: number, groupName: string, activityType: 'flashcards' | 'matching') => {
    try {
      console.log(`Starting ${activityType} session for group ${groupId} (${groupName})`);
      const newSession = await postJson<Session>("/study_sessions", {
        groupId,
        groupName,
      });
      console.log("New session created:", newSession);
      toast.success(`Started ${activityType} session for ${groupName}`);
      setLocation(`/study/${activityType}/${groupId}?sessionId=${newSession.id}`);
    } catch (error) {
      console.error("Error starting session:", error);
      toast.error("Failed to start study session. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("Groups loaded:", groups);

  if (groups.length === 0) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold">Study Activities</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No word groups available. Please create some groups first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Study Activities</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Flashcards */}
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Practice vocabulary with interactive flashcards. Test your knowledge and track your progress.
              </p>
              <div className="grid gap-4">
                {groups.map((group) => (
                  <Button 
                    key={`${group.id}-flashcards`}
                    variant="outline" 
                    className="w-full h-12 text-lg"
                    onClick={() => startSession(group.id, group.name, 'flashcards')}
                  >
                    {group.name} ({group.wordCount || 0} words)
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matching Game */}
        <Card>
          <CardHeader>
            <CardTitle>Matching Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Match Dari words with their English translations in this fun memory game.
              </p>
              <div className="grid gap-4">
                {groups.map((group) => (
                   <Button 
                    key={`${group.id}-matching`}
                    variant="outline" 
                    className="w-full h-12 text-lg"
                    onClick={() => startSession(group.id, group.name, 'matching')}
                  >
                    {group.name} ({group.wordCount || 0} words)
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Word Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Word Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {group.wordCount || 0} words
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startSession(group.id, group.name, 'flashcards')}
                    >
                        Flashcards
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startSession(group.id, group.name, 'matching')}
                    >
                        Matching
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 