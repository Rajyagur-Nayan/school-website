import Link from "next/link";
import { AppShell } from "../pages/Sidebar";

// app/student-management/layout.tsx
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link href="/student-management">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
              Student Management
            </h1>
          </Link>
          <p className="text-muted-foreground">
            Manage student admissions, profiles, and records.
          </p>
        </div>
        {/* Page content will be rendered here */}
        {children}
      </div>
    </AppShell>
  );
}
