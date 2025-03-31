import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Word } from "@shared/schema";

export function VocabularyList({ groupId }: { groupId?: number }) {
  const { data: words = [] } = useQuery<Word[]>({
    queryKey: ["words", groupId],
    queryFn: async () => {
      const url = groupId 
        ? `/api/groups/${groupId}/words`
        : "/api/words";
      const response = await fetch(url);
      return response.json();
    }
  });

  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dari Word</TableHead>
              <TableHead>Pronunciation</TableHead>
              <TableHead>English Translation</TableHead>
              <TableHead>Example Sentence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {words.map((word) => (
              <TableRow key={word.id}>
                <TableCell className="font-bold text-lg">{word.dariWord}</TableCell>
                <TableCell>{word.pronunciation}</TableCell>
                <TableCell>{word.englishTranslation}</TableCell>
                <TableCell dir="rtl" className="text-right">{word.exampleSentence}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 