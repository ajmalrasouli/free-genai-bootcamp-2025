import { Route, Switch } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";

import { DashboardPage } from "./pages/dashboard";
import { VocabularyPage } from "./pages/VocabularyPage";
import { GroupsPage } from "./pages/GroupsPage";
import { StudyPage } from "./pages/StudyPage";
import { StudySessionPage } from "./pages/StudySessionPage";
import { StudyHistoryPage } from "./pages/StudyHistoryPage";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { MatchingGamePage } from "./pages/activities/MatchingGamePage";
import { FlashcardsPage } from "./pages/activities/FlashcardsPage";

export function AppRoutes() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/vocabulary" component={VocabularyPage} />
          <Route path="/groups" component={GroupsPage} />
          <Route path="/groups/:groupId/words" component={VocabularyPage} />
          <Route path="/study" component={StudyPage} />
          <Route path="/study/:groupId" component={StudyPage} />
          <Route path="/study/flashcards/:groupId" component={FlashcardsPage} />
          <Route path="/study/matching/:groupId" component={MatchingGamePage} />
          <Route path="/history" component={StudyHistoryPage} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
} 