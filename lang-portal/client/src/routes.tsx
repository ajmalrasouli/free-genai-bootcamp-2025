import { Route, Switch } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";

import Dashboard from "@/pages/dashboard";
import { VocabularyPage } from "@/pages/VocabularyPage";
import { GroupsPage } from "@/pages/GroupsPage";
import { StudyPage } from "@/pages/StudyPage";
import { StudySessionPage } from "@/pages/StudySessionPage";
import { StudyHistoryPage } from "@/pages/StudyHistoryPage";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { MatchingGamePage } from "@/pages/activities/MatchingGamePage";

export function AppRoutes() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 bg-gray-50">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/vocabulary" component={VocabularyPage} />
          <Route path="/vocabulary/:groupId" component={VocabularyPage} />
          <Route path="/groups" component={GroupsPage} />
          <Route path="/study" component={StudyPage} />
          <Route path="/study/:groupId" component={StudySessionPage} />
          <Route path="/sessions" component={StudyHistoryPage} />
          <Route path="/settings" component={Settings} />
          <Route path="/activities/matching/:groupId" component={MatchingGamePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
} 