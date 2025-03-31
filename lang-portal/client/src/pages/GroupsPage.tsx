import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { fetchJson } from "@/lib/api";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Define the WordGroup type with wordCount property
interface WordGroup {
  id: number;
  name: string;
  description: string;
  wordCount: number;
}

export function GroupsPage() {
  console.log("Rendering GroupsPage");
  
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["/api/groups"],
    queryFn: () => fetchJson<WordGroup[]>("/groups"),
    refetchOnMount: true,
    staleTime: 0
  });

  console.log("Groups data:", groups);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <h1 className="text-3xl font-bold">Word Groups</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Word Groups</h1>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No word groups available. Create your first group to start learning.
            </p>
            <Button asChild>
              <Link href="/groups/new">Create Group</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {group.wordCount === 1 
                    ? "1 word" 
                    : `${group.wordCount} words`}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/groups/${group.id}/words`}>View Words</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/study/${group.id}`}>Study</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 