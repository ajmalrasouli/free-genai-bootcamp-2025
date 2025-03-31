import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "./ui/card";

interface WordGroup {
  id: number;
  name: string;
}

export function WordGroups() {
  const { data: groups = [] } = useQuery<WordGroup[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetch("/api/groups");
      return response.json();
    }
  });

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Word Groups</h2>
        <div className="space-y-2">
          {groups.map((group) => (
            <div key={group.id} className="block p-3 rounded-lg hover:bg-gray-100">
              <Link href={`/vocabulary/${group.id}`}>
                {group.name}
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 