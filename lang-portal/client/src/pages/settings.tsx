import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetHistory = async () => {
    setIsResetting(true);
    try {
      await apiRequest("POST", "/api/reset_history");
      toast({
        title: "Success",
        description: "Study history has been reset",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset study history",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleFullReset = async () => {
    setIsResetting(true);
    try {
      await apiRequest("POST", "/api/full_reset");
      toast({
        title: "Success",
        description: "System has been fully reset",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform full reset",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Reset Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" disabled={isResetting}>
                {isResetting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Reset Study History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Study History</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all study sessions and review records. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetHistory}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isResetting}>
                {isResetting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Full Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Full System Reset</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete ALL data including words, groups, and study
                  history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleFullReset}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
