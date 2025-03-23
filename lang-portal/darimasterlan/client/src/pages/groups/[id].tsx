import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WordGroup, Word, StudySession } from "@shared/schema";

export default function GroupShow() {
  const { id } = useParams();

  const { data: group, isLoading } = useQuery<WordGroup>({
    queryKey: [`/api/groups/${id}`],
  });

  const { data: words } = useQuery<Word[]>({
    queryKey: [`/api/groups/${id}/words`],
  });

  const { data: sessions } = useQuery<StudySession[]>({
    queryKey: [`/api/groups/${id}/study_sessions`],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!group) return <div>Group not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{group.name}</h1>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Words in Group</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">Dari Word</TableHead>
                  <TableHead>Pronunciation</TableHead>
                  <TableHead>English Translation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {words?.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell className="text-right font-medium">
                      {word.dariWord}
                    </TableCell>
                    <TableCell>{word.pronunciation}</TableCell>
                    <TableCell>{word.englishTranslation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Reviews</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions?.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
