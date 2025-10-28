// components/staff/ViewStaffList.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Define a type for the staff data from your API
interface Staff {
  id: number;
  f_name: string;
  l_name: string;
  email: string;
  role: string;
  // Add other fields like 'subject' or 'avatar' if your API provides them
  // For this example, we'll assume they might not exist and handle that
  subject?: string;
  avatar?: string;
}

export function ViewStaffList() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GET: Fetch staff data from the API on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/faculty_register`,
          { withCredentials: true }
        );
        setStaffList(response.data);
      } catch (err) {
        console.error("Failed to fetch staff list:", err);
        setError("Could not load staff data. Please try again later.");
        toast.error("Failed to fetch staff list.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Filter the staff list based on the search term
  const filteredStaff = staffList.filter((staff) => {
    const fullName = `${staff.f_name} ${staff.l_name}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>All Staff Members</CardTitle>
            <CardDescription>
              A list of all staff currently in the system.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subject</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading staff data...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={staff.avatar}
                        alt={`${staff.f_name} ${staff.l_name}`}
                      />
                      <AvatarFallback>
                        {staff.f_name[0] || ""}
                        {staff.l_name[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {staff.f_name} {staff.l_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {staff.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{staff.subject || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No staff members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
