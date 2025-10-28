// components/inventory/ViewInventoryList.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { gsap } from "gsap"; // --- 1. Import GSAP
import {
  Package, // --- 2. Import Icons
  Search,
  ArchiveX,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // --- 3. Import Skeleton

// --- Data Types ---
interface InventoryItem {
  id: number;
  item_name: string;
  category: string;
  description: string;
  total_quantity: number;
  available_quantity: number;
}

// --- 4. Array of distinct background colors (Tailwind classes) ---
const cardBackgrounds = [
  "bg-blue-50/70 dark:bg-blue-900/40",
  "bg-green-50/70 dark:bg-green-900/40",
  "bg-purple-50/70 dark:bg-purple-900/40",
  "bg-orange-50/70 dark:bg-orange-900/40",
  "bg-red-50/70 dark:bg-red-900/40",
  "bg-teal-50/70 dark:bg-teal-900/40",
];

export default function ViewInventoryList() {
  const [allItems, setAllItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/inventory_item`,
          {
            withCredentials: true,
          }
        );
        const items: InventoryItem[] = response.data || [];
        setAllItems(items);
        const uniqueCategories = [
          ...new Set(items.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch inventory.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // --- Filtering Logic ---
  useEffect(() => {
    let results = allItems;
    if (searchTerm) {
      results = results.filter((item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      results = results.filter((item) => item.category === selectedCategory);
    }
    setFilteredItems(results);
  }, [searchTerm, selectedCategory, allItems]);

  // --- 5. GSAP Animation Effect ---
  // Reruns whenever the filtered items change
  useEffect(() => {
    if (!isLoading && filteredItems.length > 0) {
      gsap.fromTo(
        ".gsap-inventory-card",
        {
          opacity: 0,
          y: 30,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.05, // A faster stagger for a responsive feel
        }
      );
    }
  }, [filteredItems, isLoading]); // Trigger on filteredItems to re-animate on filter

  // --- 6. Updated Status Function (with color) ---
  const getStatus = (
    available: number,
    total: number
  ): {
    text: string;
    variant: "default" | "secondary" | "destructive";
    colorClass: string;
  } => {
    if (available <= 0) {
      return {
        text: "Out of Stock",
        variant: "destructive",
        colorClass: "bg-red-500", // Red
      };
    }
    if (available < total * 0.2) {
      return {
        text: "Low Stock",
        variant: "secondary",
        colorClass: "bg-yellow-500", // Yellow
      };
    }
    return {
      text: "In Stock",
      variant: "default",
      colorClass: "bg-green-500", // Green
    };
  };

  /**
   * --- 7. Renders Skeleton Cards ---
   */
  const renderSkeletonGrid = () => (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <Card
          key={index}
          className={`flex flex-col ${
            cardBackgrounds[index % cardBackgrounds.length]
          } border-none shadow-md`}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-3/5 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end space-y-3">
            <Skeleton className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-2 w-full bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  /**
   * --- 8. Renders Empty State ---
   */
  const renderEmptyState = () => (
    <div className="mt-6 flex flex-col items-center justify-center rounded-md border border-dashed py-20 text-center text-muted-foreground">
      <ArchiveX className="h-12 w-12" />
      <p className="mt-4 text-xl font-medium">No Items Found</p>
      <p className="mt-2 text-sm">
        Try adjusting your search or filter settings.
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Inventory</CardTitle>
        <CardDescription>
          Search and filter through all school assets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* --- 9. Improved Filter Bar --- */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by item name..."
              className="pl-10" // Add padding for icon
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* --- 10. Main Content Area (Grid) --- */}
        <div className="mt-6">
          {isLoading ? (
            renderSkeletonGrid()
          ) : filteredItems.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item, index) => {
                const status = getStatus(
                  item.available_quantity,
                  item.total_quantity
                );
                const percentage =
                  item.total_quantity > 0
                    ? (item.available_quantity / item.total_quantity) * 100
                    : 0;
                const bgColorClass =
                  cardBackgrounds[index % cardBackgrounds.length];

                return (
                  <Card
                    key={item.id}
                    className={`gsap-inventory-card flex flex-col opacity-0 ${bgColorClass} border-none shadow-md transition-all hover:shadow-xl`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg font-bold">
                          {item.item_name}
                        </CardTitle>
                        <Badge variant="outline" className="flex-shrink-0">
                          {item.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end space-y-3">
                      {/* Quantity Text */}
                      <div>
                        <span className="text-4xl font-bold">
                          {item.available_quantity}
                        </span>
                        <span className="text-lg text-muted-foreground">
                          {" "}
                          / {item.total_quantity}
                        </span>
                      </div>
                      {/* Custom Progress Bar */}
                      <div className="w-full h-2 bg-gray-900/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${status.colorClass}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {/* Status Badge */}
                      <Badge variant={status.variant} className="w-fit">
                        {status.text}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
