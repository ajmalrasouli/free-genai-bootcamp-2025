import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { WordGroup } from "@shared/schema";

interface GroupWithCount extends WordGroup {
  word_count: number;
}

export function StudyPage() {
  const { data: groups = [] } = useQuery<GroupWithCount[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetch("/api/groups");
      return response.json();
    }
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Study Activities</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
            <p className="text-sm opacity-90 mb-4">
              Study words with interactive flashcards
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Matching Game</h2>
            <p className="text-sm opacity-90 mb-4">
              Match Dari words with their English translations
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Select a Word Group</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="space-y-2">
            <Card className="hover:bg-gray-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-500">
                  {group.word_count} {group.word_count === 1 ? 'word' : 'words'}
                </p>
                <div className="mt-4 space-x-2">
                  <Button asChild>
                    <Link href={`/study/${group.id}`}>
                      Flashcards
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/activities/matching/${group.id}`}>
                      Matching Game
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 