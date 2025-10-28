// app/inventory-management/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackagePlus, Warehouse, ArrowRightLeft } from "lucide-react";

export default function InventoryHomePage() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Add New Item</CardTitle>
          <PackagePlus className="w-6 h-6 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Add new assets or supplies to the inventory.
          </p>
          <Button onClick={() => router.push("/inventory-management/add-item")}>
            Go to Form
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">View Inventory</CardTitle>
          <Warehouse className="w-6 h-6 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Browse and search the complete inventory list.
          </p>
          <Button
            onClick={() => router.push("/inventory-management/view-inventory")}
          >
            View List
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            Issue / Return Item
          </CardTitle>
          <ArrowRightLeft className="w-6 h-6 text-orange-500" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Manage the lending and returning of items.
          </p>
          <Button
            onClick={() => router.push("/inventory-management/issue-return")}
          >
            Go to Desk
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
