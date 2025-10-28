"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react"; // Import the loader icon

// --- Data Types ---
interface Item {
  id: number;
  item_name: string;
}
interface Faculty {
  id: number;
  f_name: string;
  l_name: string;
}
interface IssuedItem {
  id: number;
  item_name: string;
  f_name: string;
  l_name: string;
  quantity_issued: number;
}
interface HistoryItem {
  id: number;
  item_name: string;
  f_name: string;
  l_name: string;
  return_quantity: number | null;
  created_at: string;
  updated_at: string;
}

export function IssueReturnItem() {
  // State for dropdowns
  const [items, setItems] = useState<Item[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [issuedItems, setIssuedItems] = useState<IssuedItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // State for forms
  const [issueItemId, setIssueItemId] = useState("");
  const [issueFacultyId, setIssueFacultyId] = useState("");
  const [issueQuantity, setIssueQuantity] = useState("");
  const [returnItemId, setReturnItemId] = useState("");
  const [returnQuantity, setReturnQuantity] = useState("");

  // State for loading indicators
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // --- Data Fetching ---
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, facultyRes, issuedRes, historyRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/assign_item/items`, {
          withCredentials: true,
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/assign_item/faculty`, {
          withCredentials: true,
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/assign_item/issued`, {
          withCredentials: true,
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/assign_item/history`, {
          withCredentials: true,
        }),
      ]);
      setItems(itemsRes.data || []);
      setFaculty(facultyRes.data || []);
      setIssuedItems(issuedRes.data || []);
      setHistory(historyRes.data || []);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load initial data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // --- API Handlers ---
  const handleIssueItem = async () => {
    if (!issueItemId || !issueFacultyId || !issueQuantity) {
      toast.error("Please fill all fields to issue an item.");
      return;
    }
    setIsIssuing(true);
    const params = new URLSearchParams();
    params.append("item_id", issueItemId);
    params.append("faculty_id", issueFacultyId);
    params.append("quantity_issued", issueQuantity);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/assign_item/issue`,
        params,
        {
          withCredentials: true,
        }
      );
      toast.success("Item issued successfully!");
      setIssueItemId("");
      setIssueFacultyId("");
      setIssueQuantity("");
      fetchInitialData(); // Refresh all data
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to issue item.");
    } finally {
      setIsIssuing(false);
    }
  };

  const handleReturnItem = async () => {
    if (!returnItemId || !returnQuantity) {
      toast.error("Please select an item and enter the return quantity.");
      return;
    }
    setIsReturning(true);
    const params = new URLSearchParams();
    params.append("return_quantity", returnQuantity);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/assign_item/return/${returnItemId}`,
        params,
        { withCredentials: true }
      );
      toast.success("Item returned successfully!");
      setReturnItemId("");
      setReturnQuantity("");
      fetchInitialData(); // Refresh all data
    } catch (error) {
      console.log(error);

      toast.error("Failed to return item.");
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <Tabs defaultValue="issue" className="max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="issue">Issue Item</TabsTrigger>
        <TabsTrigger value="return">Return Item</TabsTrigger>
        <TabsTrigger value="history">Issue History</TabsTrigger>
      </TabsList>

      {/* Issue Item Tab */}
      <TabsContent value="issue">
        <Card>
          <CardHeader>
            <CardTitle>Issue an Item</CardTitle>
            <CardDescription>
              Record an item being issued to a staff member.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Item</Label>
              <Select onValueChange={setIssueItemId} value={issueItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Search for an item..." />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.item_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Issue To (Staff Member)</Label>
              <Select onValueChange={setIssueFacultyId} value={issueFacultyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Search for a staff member..." />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map((f) => (
                    <SelectItem
                      key={f.id}
                      value={String(f.id)}
                    >{`${f.f_name} ${f.l_name}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-qty">Quantity Issued</Label>
              <Input
                id="issue-qty"
                type="number"
                placeholder="1"
                value={issueQuantity}
                onChange={(e) => setIssueQuantity(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleIssueItem} disabled={isIssuing}>
                {isIssuing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isIssuing ? "Issuing..." : "Confirm Issue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Return Item Tab */}
      <TabsContent value="return">
        <Card>
          <CardHeader>
            <CardTitle>Return an Item</CardTitle>
            <CardDescription>
              Record an item being returned to the inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Item to Return</Label>
              <Select onValueChange={setReturnItemId} value={returnItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Search for an issued item..." />
                </SelectTrigger>
                <SelectContent>
                  {issuedItems.length > 0 ? (
                    issuedItems.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={String(item.id)}
                      >{`${item.item_name} (Issued to ${item.f_name} ${item.l_name})`}</SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      No items are currently issued.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-qty">Quantity Returned</Label>
              <Input
                id="return-qty"
                type="number"
                placeholder="1"
                value={returnQuantity}
                onChange={(e) => setReturnQuantity(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleReturnItem} disabled={isReturning}>
                {isReturning && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isReturning ? "Returning..." : "Confirm Return"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Issue History Tab */}
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Issue & Return History</CardTitle>
            <CardDescription>
              A log of all inventory transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-10">
                Loading history...
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length > 0 ? (
                    history.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell>{h.item_name}</TableCell>
                        <TableCell>{`${h.f_name} ${h.l_name}`}</TableCell>
                        <TableCell>{h.return_quantity || "N/A"}</TableCell>
                        <TableCell>
                          {h.return_quantity ? "Returned" : "Issued"}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(h.updated_at), "PPP")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        No history found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
