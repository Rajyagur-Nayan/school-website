"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Search, Users } from "lucide-react";
import { gsap } from "gsap"; // --- 1. Import GSAP ---
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// --- Data Types ---
interface Student {
  id: number;
  student_name: string;
  admission_number: string;
  standard: string | number;
  division: string;
  status: string;
  community: string;
  caste_category: string;
  avatar_url?: string;
}

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

const getStatusVariant = (
  status: string
): "default" | "destructive" | "secondary" => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "active") return "default";
  if (lowerStatus === "inactive" || lowerStatus === "left")
    return "destructive";
  return "secondary";
};

/**
 * A component to display a searchable, animated list of students.
 */
export function ViewStudentList() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch data on page load
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add`
        );
        const data = Array.isArray(response.data) ? response.data : [];
        setAllStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast.error("Failed to load student data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // 2. Filter students when search term changes
  useEffect(() => {
    if (Array.isArray(allStudents)) {
      const results = allStudents.filter((student) =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(results);
    }
  }, [searchTerm, allStudents]);

  // --- 3. GSAP Animation Effect ---
  // Reruns whenever the filtered items change
  useEffect(() => {
    if (!isLoading && filteredStudents.length > 0) {
      gsap.fromTo(
        ".student-list-item", // Target class for list items
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.05, // Stagger animation for each item
        }
      );
    }
  }, [filteredStudents, isLoading]);

  /**
   * Renders the skeleton loading list
   */
  const renderSkeletonList = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-md border p-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="hidden md:block space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="hidden lg:block space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      ))}
    </div>
  );

  /**
   * Renders the empty state message
   */
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-20 text-center text-muted-foreground">
      <Users className="h-12 w-12" />
      <p className="mt-4 text-xl font-medium">No Students Found</p>
      <p className="mt-2 text-sm">
        {searchTerm
          ? "Try adjusting your search term."
          : "No students have been added yet."}
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Students</CardTitle>
        <CardDescription>
          A searchable list of all students currently enrolled.
        </CardDescription>
        <div className="relative pt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderSkeletonList()
        ) : filteredStudents.length > 0 ? (
          // --- 4. New List Layout ---
          <div className="space-y-3">
            {/* List Header */}
            <div className="hidden md:grid grid-cols-10 gap-4 px-4 py-2 text-xs font-medium uppercase text-muted-foreground">
              <div className="col-span-3">Student</div>
              <div className="col-span-2">Class</div>
              <div className="col-span-2">Community</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-right">Status</div>
            </div>
            {/* List Body */}
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                // --- 5. GSAP target class and initial state ---
                className="student-list-item grid grid-cols-5 md:grid-cols-10 items-center gap-4 rounded-md border p-4 transition-all hover:bg-muted/50 opacity-0"
              >
                {/* Col 1: Student (Mobile: all, MD: span-3) */}
                <div className="col-span-4 md:col-span-3 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={student.avatar_url} />
                    <AvatarFallback>
                      {getInitials(student.student_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.student_name}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {student.admission_number}
                    </p>
                  </div>
                </div>

                {/* Col 2: Class (Hidden on mobile) */}
                <div className="hidden md:block col-span-2">
                  <p className="text-sm">
                    {student.standard} - {student.division}
                  </p>
                </div>

                {/* Col 3: Community (Hidden on mobile) */}
                <div className="hidden md:block col-span-2">
                  <p className="text-sm">{student.community}</p>
                </div>

                {/* Col 4: Category (Hidden on mobile) */}
                <div className="hidden lg:block col-span-2">
                  <p className="text-sm">{student.caste_category}</p>
                </div>

                {/* Col 5: Status (Mobile: span-1, MD: span-1) */}
                <div className="col-span-1 flex justify-end">
                  <Badge variant={getStatusVariant(student.status)}>
                    {student.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </CardContent>
    </Card>
  );
}
