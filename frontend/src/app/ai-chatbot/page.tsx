import { ChatAssistant } from "../pages/chtbot/ChatAssistant";
import { AppShell } from "../pages/Sidebar";

export default function AiAssistantPage() {
  return (
    <AppShell>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
            AI School Assistant
          </h1>
          <p className="text-muted-foreground">
            Ask me anything about school subjects, general knowledge, or more.
          </p>
        </div>
        <ChatAssistant />
      </div>
    </AppShell>
  );
}
