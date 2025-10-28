// app/timetable-management/layout.tsx
"use client";

import { AppShell } from "@/app/pages/Sidebar";
import Link from "next/link";

export default function TimetableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 ">
        {/* Page Title */}
        <div className="mb-6">
          <Link href="/timetable-management/view">
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 hover:text-blue-500">
              Timetable Management
            </h1>
          </Link>
        </div>

        {/* Card container for page content */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          {/* The content of each page (like the cards below) will be rendered here */}
          {children}
        </div>
      </div>
    </AppShell>
  );
}
