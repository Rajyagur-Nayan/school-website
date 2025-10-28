import Link from "next/link";
import { AppShell } from "../pages/Sidebar";

// app/inventory-management/layout.tsx
export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <Link
            href="/inventory-management"
            className="text-sm text-primary hover:underline"
          >
            <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
              Inventory Management
            </h1>
          </Link>
          <p className="text-muted-foreground">
            Track and manage all school assets and supplies.
          </p>
        </div>
        {/* Page content will be rendered here */}
        {children}
      </div>
    </AppShell>
  );
}
