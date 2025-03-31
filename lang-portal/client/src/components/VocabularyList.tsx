import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Word } from "@shared/schema";

interface VocabularyListProps {
  words: Word[];
}

export function VocabularyList({ words }: VocabularyListProps) {
  return (
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
            <TableCell className="font-medium" dir="rtl">
              {word.dariWord}
            </TableCell>
            <TableCell>{word.pronunciation}</TableCell>
            <TableCell>{word.englishTranslation}</TableCell>
            <TableCell>{word.exampleSentence}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 