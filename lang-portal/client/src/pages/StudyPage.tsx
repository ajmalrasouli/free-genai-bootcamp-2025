import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchJson } from "@/lib/api";
import type { GroupWithCount } from "@shared/schema";

export function StudyPage() {
  // Force refresh on mount
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["/api/groups"],
    queryFn: () => fetchJson<GroupWithCount[]>("/groups"),
    refetchOnMount: true,
    staleTime: 0
  });

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
                  <Link key={group.id} href={`/study/flashcards/${group.id}`}>
                    <Button variant="outline" className="w-full h-12 text-lg">
                      {group.name} ({group.wordCount} words)
                    </Button>
                  </Link>
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
                  <Link key={group.id} href={`/study/matching/${group.id}`}>
                    <Button variant="outline" className="w-full h-12 text-lg">
                      {group.name} ({group.wordCount} words)
                    </Button>
                  </Link>
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
                    {group.wordCount} words
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/study/flashcards/${group.id}`}>
                      <Button variant="outline" size="sm">
                        Flashcards
                      </Button>
                    </Link>
                    <Link href={`/study/matching/${group.id}`}>
                      <Button variant="outline" size="sm">
                        Matching
                      </Button>
                    </Link>
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