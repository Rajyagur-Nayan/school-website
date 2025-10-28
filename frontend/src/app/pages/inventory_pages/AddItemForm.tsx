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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreVertical, Edit, Trash2, Loader2 } from "lucide-react"; // Added Loader2

// --- Data Types ---
interface InventoryItem {
  id: number;
  item_name: string;
  category: string;
  description: string;
  total_quantity: number;
  available_quantity: number;
}

// --- Edit Dialog Component ---
const EditItemDialog = ({
  item,
  onUpdate,
}: {
  item: InventoryItem;
  onUpdate: () => void;
}) => {
  const [itemName, setItemName] = useState(item.item_name);
  const [category, setCategory] = useState(item.category);
  const [totalQuantity, setTotalQuantity] = useState(
    String(item.total_quantity)
  );
  const [description, setDescription] = useState(item.description);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State for the save button

  const handleUpdate = async () => {
    setIsSaving(true);
    const params = new URLSearchParams();
    params.append("item_name", itemName);
    params.append("category", category);
    params.append("total_quantity", totalQuantity);
    params.append("description", description);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory_item/${item.id}`,
        params,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      toast.success("Item updated successfully!");
      onUpdate();
      setOpen(false);
    } catch (error) {
      console.log(error);

      toast.error("Failed to update item.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item: {item.item_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Item Name</Label>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <Label>Total Quantity</Label>
            <Input
              type="number"
              value={totalQuantity}
              onChange={(e) => setTotalQuantity(e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpdate} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function AddItemForm() {
  // State for form inputs
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [description, setDescription] = useState("");

  // State for the list of items
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for the add button
  const [isDeleting, setIsDeleting] = useState(false); // State for the delete action

  // --- CRUD Functions ---
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory_item`,
        {
          withCredentials: true,
        }
      );
      setInventory(response.data || []);
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!itemName || !category || !totalQuantity) {
      toast.error("Please fill out Item Name, Category, and Quantity.");
      return;
    }
    setIsSubmitting(true);

    const params = new URLSearchParams();
    params.append("item_name", itemName);
    params.append("category", category);
    params.append("total_quantity", totalQuantity);
    params.append("description", description);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory_item`,
        params,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          withCredentials: true,
        }
      );
      toast.success("Item added successfully!");
      setItemName("");
      setCategory("");
      setTotalQuantity("");
      setDescription("");
      fetchInventory();
    } catch (error) {
      console.log(error);

      toast.error("Failed to add item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/inventory_item/${itemId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Item deleted successfully.");
      fetchInventory();
    } catch (error) {
      console.log(error);

      toast.error("Failed to delete item.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Item to Inventory</CardTitle>
          <CardDescription>
            Enter the details of the new item below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., Dell Laptop"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., IT Assets"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total Quantity</Label>
              <Input
                type="number"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(e.target.value)}
                placeholder="e.g., 25"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Model, serial number, etc..."
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Existing Inventory</CardTitle>
          <CardDescription>
            A list of all items in the inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Qty</TableHead>
                  <TableHead>Available Qty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : inventory.length > 0 ? (
                  inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.item_name}
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.total_quantity}</TableCell>
                      <TableCell>{item.available_quantity}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <EditItemDialog
                                item={item}
                                onUpdate={fetchInventory}
                              />
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete &quot;
                                {item.item_name}&quot;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                disabled={isDeleting}
                              >
                                {isDeleting && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
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
    </div>
  );
}
