// components/exam/ViewResults.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// --- Data Types ---
interface Class {
  id: number;
  standard: string;
  division?: string;
}
interface Student {
  id: number;
  student_name: string;
  admission_number?: string; // if available from API
}
interface StudentResult {
  student_name: string;
  exam_name: string;
  subject_name: string;
  exam_date: string;
  total_marks: number;
  marks_obtained: number | null;
  result: string | null;
}
// Type for the raw student response (grouped)
interface GroupedStudentData {
  [key: string]: Student[];
}

// Optional: path to uploaded image from convo (available in environment)

export function ViewResults() {
  // State for dropdown data
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]); // Will hold the FLATTENED list

  // State for selections
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Search state for students
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>("");

  // State for results and loading/error
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoadingClasses(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add_slot/form-data`,
          { withCredentials: true }
        );
        setClasses(response.data.classes || []);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        toast.error("Could not load class list.");
        setError("Failed to load classes.");
      } finally {
        setIsLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  // 2. Fetch Students when a Class is selected
  useEffect(() => {
    setStudents([]);
    setSelectedStudentId("");
    setStudentResults([]);
    setStudentSearchTerm("");
    setError(null);

    if (selectedClassId) {
      const fetchStudents = async () => {
        setIsLoadingStudents(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/attendance/class/${selectedClassId}/students`,
            { withCredentials: true }
          );

          // Flatten grouped student data if the API returns grouped structure
          const groupedData: GroupedStudentData = response.data || {};
          const studentArrays = Object.values(groupedData);
          const flatStudentList = studentArrays.flat();

          // If response is already a flat array, fallback to that
          const resultList =
            Array.isArray(response.data) && response.data.length > 0
              ? response.data
              : flatStudentList;

          setStudents(resultList || []);
        } catch (err) {
          console.error("Failed to fetch students:", err);
          toast.error("Could not load student list for this class.");
          setError("Failed to load students.");
        } finally {
          setIsLoadingStudents(false);
        }
      };
      fetchStudents();
    }
  }, [selectedClassId]);

  // 3. Fetch Results when a Student is selected
  useEffect(() => {
    setStudentResults([]);
    setError(null);

    if (selectedStudentId) {
      const fetchResults = async () => {
        setIsLoadingResults(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/mark_entry/student/${selectedStudentId}`,
            { withCredentials: true }
          );
          setStudentResults(response.data || []);
        } catch (err: any) {
          if (err.response?.status === 404) {
            toast.error("No results found for this student.");
            setStudentResults([]);
          } else {
            console.error("Failed to fetch student results:", err);
            toast.error("Could not load results for this student.");
            setError("Failed to load results.");
          }
        } finally {
          setIsLoadingResults(false);
        }
      };
      fetchResults();
    }
  }, [selectedStudentId]);

  // --- Calculations based on fetched results ---
  const validResults = studentResults.filter((r) => r.marks_obtained !== null);
  const totalMarksObtained = validResults.reduce(
    (sum, item) => sum + (item.marks_obtained ?? 0),
    0
  );
  const totalPossibleMarks = validResults.reduce(
    (sum, item) => sum + item.total_marks,
    0
  );
  const percentage =
    totalPossibleMarks > 0
      ? ((totalMarksObtained / totalPossibleMarks) * 100).toFixed(2)
      : "0.00";

  // This will now work because 'students' is an array
  const selectedStudent = students.find(
    (s) => String(s.id) === selectedStudentId
  );
  const selectedClass = classes.find((c) => String(c.id) === selectedClassId);

  // --- Search filtering for students (memoized)
  const filteredStudents = useMemo(() => {
    const q = studentSearchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const name = s.student_name?.toLowerCase() || "";
      const adm = (s as any).admission_number
        ? String((s as any).admission_number).toLowerCase()
        : "";
      return name.includes(q) || adm.includes(q) || String(s.id) === q;
    });
  }, [students, studentSearchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>View Student Report Card</CardTitle>
        <CardDescription>
          Select a class and student to view their results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Dropdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Select Class</Label>
            <Select
              onValueChange={(v) => {
                setSelectedClassId(v);
              }}
              value={selectedClassId}
              disabled={isLoadingClasses}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingClasses ? "Loading Classes..." : "Select Class"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.standard} {c.division || ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* --- Student search + list --- */}
          <div>
            <Label>Select Student</Label>
            <Select
              onValueChange={setSelectedStudentId}
              value={selectedStudentId}
              disabled={
                !selectedClassId || isLoadingStudents || students.length === 0
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingStudents
                      ? "Loading Students..."
                      : !selectedClassId
                      ? "Select Class First"
                      : students.length === 0
                      ? "No Students Found"
                      : "Select Student"
                  }
                />
              </SelectTrigger>

              {/* ---------------------- SEARCHABLE DROPDOWN ---------------------- */}
              <SelectContent className="max-h-64">
                {/* Search bar inside dropdown */}
                <div className="p-2 sticky top-0 bg-background z-10 border-b">
                  <div className="relative">
                    <Input
                      placeholder="Search student..."
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      className="pr-8"
                    />
                    <Search className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Filtered student list */}
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.student_name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    No matching students
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading/Error/Results Section */}
        {isLoadingResults && (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Loading Results...</span>
          </div>
        )}

        {error && !isLoadingResults && (
          <p className="text-center text-red-500 py-6">{error}</p>
        )}

        {!isLoadingResults &&
          selectedStudentId &&
          studentResults.length === 0 &&
          !error && (
            <p className="text-center text-muted-foreground py-6">
              No results found for the selected student.
            </p>
          )}

        {!isLoadingResults && studentResults.length > 0 && selectedStudent && (
          <div className="border rounded-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
              <div>
                <h3 className="text-xl font-bold">
                  {selectedStudent.student_name}
                </h3>
                <p className="text-muted-foreground">
                  Class {selectedClass?.standard}{" "}
                  {selectedClass?.division || ""}
                </p>
                {studentResults.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Exam: {studentResults[0].exam_name}
                  </p>
                )}
              </div>
              <Badge
                variant={
                  parseFloat(percentage) >= 40 ? "default" : "destructive"
                }
                className="text-lg px-4 py-1"
              >
                {parseFloat(percentage) >= 40 ? "PASS" : "FAIL"}
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Marks Obtained</TableHead>
                  <TableHead className="text-right">Total Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentResults.map((r, index) => (
                  <TableRow key={`${r.subject_name}-${r.exam_name}-${index}`}>
                    <TableCell>{r.subject_name}</TableCell>
                    <TableCell className="text-right">
                      {r.marks_obtained ?? "Absent"}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.total_marks}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold" colSpan={2}>
                    {totalMarksObtained} / {totalPossibleMarks}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Percentage</TableCell>
                  <TableCell className="text-right font-bold" colSpan={2}>
                    {percentage}%
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
