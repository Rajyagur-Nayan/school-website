"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Data Types ---
interface InventoryItem {
  id: number;
  item_name: string;
  category: string;
  description: string;
  total_quantity: number;
  available_quantity: number;
}

export function ViewInventoryList() {
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
        // Dynamically create a unique list of categories from the fetched items
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

  const getStatus = (
    available: number,
    total: number
  ): { text: string; variant: "default" | "secondary" | "destructive" } => {
    if (available <= 0) {
      return { text: "Out of Stock", variant: "destructive" };
    }
    if (available < total * 0.2) {
      // Example: Low stock if less than 20% remains
      return { text: "Low Stock", variant: "secondary" };
    }
    return { text: "In Stock", variant: "default" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Inventory</CardTitle>
        <CardDescription>
          Search and filter through all school assets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <Input
            placeholder="Search by item name..."
            className="flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Available / Total</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading inventory...
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const status = getStatus(
                    item.available_quantity,
                    item.total_quantity
                  );
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.item_name}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{`${item.available_quantity} / ${item.total_quantity}`}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
