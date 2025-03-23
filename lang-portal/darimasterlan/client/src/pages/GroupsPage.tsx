import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import type { WordGroup } from "@shared/schema";

interface GroupWithCount extends WordGroup {
  word_count: number;
}

export function GroupsPage() {
  const { data: groups = [] } = useQuery<GroupWithCount[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetch("/api/groups");
      return response.json();
    }
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Word Groups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Link key={group.id} href={`/vocabulary/${group.id}`}>
            <Card className="hover:bg-gray-50 cursor-pointer">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold">{group.name}</h2>
                <p className="text-sm text-gray-500 mt-2">
                  {group.word_count} {group.word_count === 1 ? 'word' : 'words'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 