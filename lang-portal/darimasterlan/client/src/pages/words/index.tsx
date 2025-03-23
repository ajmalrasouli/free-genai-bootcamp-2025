import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Word } from "@shared/schema";

export default function WordsIndex() {
  const { data: words, isLoading } = useQuery<Word[]>({
    queryKey: ["/api/words"],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Words</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vocabulary List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Dari Word</TableHead>
                <TableHead>Pronunciation</TableHead>
                <TableHead>English Translation</TableHead>
                <TableHead className="text-right">Correct</TableHead>
                <TableHead className="text-right">Wrong</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                words?.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell className="text-right font-medium">
                      <Link href={`/words/${word.id}`} className="hover:underline">
                        {word.dariWord}
                      </Link>
                    </TableCell>
                    <TableCell>{word.pronunciation}</TableCell>
                    <TableCell>{word.englishTranslation}</TableCell>
                    <TableCell className="text-right text-green-600">0</TableCell>
                    <TableCell className="text-right text-red-600">0</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
