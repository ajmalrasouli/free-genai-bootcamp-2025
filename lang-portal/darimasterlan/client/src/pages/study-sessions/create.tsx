import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WordGroup } from "@shared/schema";

const createStudySessionSchema = z.object({
  groupId: z.string()
});

type FormValues = z.infer<typeof createStudySessionSchema>;

export default function CreateStudySession() {
  const [isCreating, setIsCreating] = useState(false);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: groups } = useQuery<WordGroup[]>({
    queryKey: ["/api/groups"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(createStudySessionSchema),
  });

  async function onSubmit(data: FormValues) {
    setIsCreating(true);
    try {
      const response = await apiRequest("POST", "/api/study_sessions", {
        groupId: parseInt(data.groupId)
      });
      const session = await response.json();

      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ["/api/study_sessions"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });

      setLocation(`/study-sessions/${session.id}`);

      toast({
        title: "Success",
        description: "Study session created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create study session",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Start New Study Session</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Word Group</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Word Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group to study" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups?.map((group) => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Start Session"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}