import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VocabularyList } from "@/components/VocabularyList";
import type { GroupWithCount } from "@shared/schema";

export function VocabularyPage() {
  const [, params] = useRoute("/vocabulary/:groupId?");
  const groupId = params?.groupId ? parseInt(params.groupId) : undefined;

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery<GroupWithCount[]>({
    queryKey: ["/api/groups"],
  });

  if (isLoadingGroups) {
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vocabulary</h1>
        <Button>Add Word</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {group.wordCount} words
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <VocabularyList groupId={groupId} />
    </div>
  );
} 