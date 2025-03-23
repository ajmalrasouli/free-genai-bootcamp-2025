import React from "react";
import { useRoute } from "wouter";
import { VocabularyList } from "@/components/VocabularyList";

export function VocabularyPage() {
  const [, params] = useRoute("/vocabulary/:groupId?");
  const groupId = params?.groupId ? parseInt(params.groupId) : undefined;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {groupId ? "Group Vocabulary" : "All Words"}
      </h1>
      <VocabularyList groupId={groupId} />
    </div>
  );
} 