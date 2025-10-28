"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation"; // Not used in this component
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage, // 1. Import AvatarImage
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";

// --- Data Types ---
interface Student {
  id: number;
  student_name: string;
  admission_number: string;
  standard?: string | number;
  division?: string;
  status: string;
  community: string;
  caste_category: string;
  student_photo_url?: string; // 2. Add photo URL field
}

export function ViewProfile() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // useRouter(); // This wasn't being assigned or used

  // --- NEW: State for Edit Dialog ---
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // 1. Fetch data
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        // Removed trailing slash for consistency
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add_student`
        );
        setAllStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast.error("Failed to load student data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // 2. Filter students
  useEffect(() => {
    if (Array.isArray(allStudents)) {
      const results = allStudents.filter((student) =>
        student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(results);
    }
  }, [searchTerm, allStudents]);

  // 3. --- MODIFIED: Handle Edit ---
  // Opens the dialog instead of navigating
  const handleEdit = (studentId: number) => {
    const studentToEdit = allStudents.find((s) => s.id === studentId);
    if (studentToEdit) {
      setEditingStudent(studentToEdit);
      setIsEditDialogOpen(true);
    }
  };
  // 4. Handle Delete (Unchanged)
  const handleDelete = async (studentId: number) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/add_student/${studentId}`
      );
      toast.success("Student deleted successfully.");
      setAllStudents((prevStudents) =>
        prevStudents.filter((s) => s.id !== studentId)
      );
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("Failed to delete student.");
    }
  };

  // 5. --- NEW: Handle Form Input Change ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // 6. --- NEW: Handle Form Submit for Update ---
  // 6. --- NEW: Handle Form Submit for Update ---
  const handleUpdateSubmit = async () => {
    if (!editingStudent) return;

    // --- FIX: Create a copy and remove fields that don't exist on the 'student' table ---
    // This prevents the "column does not exist" error from your previous problem
    const updatePayload = { ...editingStudent };
    delete updatePayload.standard;
    delete updatePayload.division;
    delete updatePayload.student_photo_url; // Don't send the URL back

    try {
      // Assuming your update endpoint is PATCH /add_student/:id
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/add_student/${editingStudent.id}`,
        updatePayload // <-- Send the cleaned payload
      );

      // --- FIX: Merge old state with the server response AND the local edit ---
      setAllStudents((prevStudents) =>
        prevStudents.map((s) => {
          if (s.id === editingStudent.id) {
            // 1. Start with the old student data (...s)
            // 2. Merge data from the server response (...response.data.student)
            // 3. Merge data from the edit form (...editingStudent)
            // This ensures all fields (old, server-updated, and locally-edited) are present.
            return { ...s, ...response.data.student, ...editingStudent };
          }
          return s;
        })
      );

      toast.success("Student updated successfully.");
      setIsEditDialogOpen(false); // Close the dialog
      setEditingStudent(null); // Clear editing state
    } catch (error) {
      console.error("Failed to update student:", error);
      toast.error("Failed to update student.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Students</CardTitle>
        <CardDescription>
          A list of all students currently enrolled.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <Input
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Admission ID</TableHead>
                <TableHead>Standard</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Caste Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center h-24">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student, i) => (
                  <TableRow key={student.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="flex items-center gap-3">
                      {/* 3. Add AvatarImage */}
                      <Avatar>
                        <AvatarImage
                          src={student.student_photo_url}
                          alt={student.student_name}
                        />
                        <AvatarFallback>
                          {student.student_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.student_name}</span>
                    </TableCell>
                    <TableCell>{student.admission_number}</TableCell>
                    <TableCell>{student.standard}</TableCell>
                    <TableCell>{student.division}</TableCell>
                    <TableCell>{student.community}</TableCell>
                    <TableCell>{student.caste_category}</TableCell>
                    <TableCell>{student.status}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEdit(student.id)}
                          >
                            Edit (Update)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- NEW: Edit Student Dialog --- */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Student Details</DialogTitle>
              <DialogDescription>
                Make changes to the student&apos;s profile. Click save when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            {editingStudent && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="student_name">Student Name</Label>
                  <Input
                    id="student_name"
                    name="student_name"
                    value={editingStudent.student_name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admission_number">Admission ID</Label>
                  <Input
                    id="admission_number"
                    name="admission_number"
                    value={editingStudent.admission_number}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="standard">Standard</Label>
                  {/* You might want to change this to a <Select> component */}
                  <Input
                    id="standard"
                    name="standard"
                    value={editingStudent.standard}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="division">Division</Label>
                  {/* You might want to change this to a <Select> component */}
                  <Input
                    id="division"
                    name="division"
                    value={editingStudent.division}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="community">Community</Label>
                  <Input
                    id="community"
                    name="community"
                    value={editingStudent.community}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="caste_category">Caste Category</Label>
                  <Input
                    id="caste_category"
                    name="caste_category"
                    value={editingStudent.caste_category}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor="status">Status</Label>
                  {/* You might want to change this to a <Select> component */}
                  <Input
                    id="status"
                    name="status"
                    value={editingStudent.status}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateSubmit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
