import { Badge } from "@/components/ui/badge";

interface WelcomeHeaderProps {
  name: string;
  role: string;
}

// A reusable header to greet the logged-in user.
export function WelcomeHeader({ name, role }: WelcomeHeaderProps) {
  return (
    <div className="border-b pb-4 mb-8">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {name}!</h1>
        <Badge variant="destructive" className="capitalize">
          {role}
        </Badge>
      </div>
      <p className="text-muted-foreground">
        Select a module below to get started.
      </p>
    </div>
  );
}
