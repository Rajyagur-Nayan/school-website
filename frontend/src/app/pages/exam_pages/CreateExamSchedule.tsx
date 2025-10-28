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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, Trash2, Loader2 } from "lucide-react";

// --- Data Types ---
interface Class {
  id: number;
  standard: string;
  division: string;
}
interface Subject {
  id: number;
  subject_name: string;
}
interface ScheduleEntry {
  id: number;
  subject_id: number | null;
  subject_name: string | null;
  exam_date: string | null;
  start_time: string | null;
  total_marks: number | null;
}
interface ScheduleData {
  [examName: string]: ScheduleEntry[];
}
interface EditScheduleEntry extends ScheduleEntry {
  exam_name: string | null;
}

export function CreateExamSchedule() {
  // State for dropdowns and form inputs
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | "">("");
  const [examName, setExamName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  // State for modals
  const [editingEntry, setEditingEntry] = useState<EditScheduleEntry | null>(
    null
  );
  const [deletingEntry, setDeletingEntry] = useState<ScheduleEntry | null>(
    null
  );

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add_slot/form-data`,
          { withCredentials: true }
        );
        setClasses(response.data.classes || []);
        setSubjects(response.data.subjects || []);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch classes and subjects.");
      }
    };
    fetchFormData();
  }, []);

  const fetchSchedule = async (classId: string) => {
    if (!classId) {
      setScheduleData({});
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/exam/class/${classId}`,
        { withCredentials: true }
      );
      setScheduleData(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setScheduleData({});
      } else {
        toast.error("Failed to fetch exam schedule.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule(selectedClassId);
  }, [selectedClassId]);

  const handleAddToSchedule = async () => {
    if (
      !examName ||
      !selectedClassId ||
      !subjectId ||
      !examDate ||
      !startTime ||
      !totalMarks
    ) {
      toast.error("Please fill all fields to add an exam.");
      return;
    }

    setIsAddingEntry(true);
    const params = new URLSearchParams();
    params.append("exam_name", examName);
    params.append("class_id", selectedClassId);
    params.append("subject_id", subjectId);
    params.append("exam_date", examDate);
    params.append("start_time", startTime);
    params.append("total_marks", totalMarks);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/exam`, params, {
        withCredentials: true,
      });
      toast.success("Exam added to schedule successfully!");
      fetchSchedule(selectedClassId);
      setSubjectId("");
      setExamDate("");
      setStartTime("");
      setTotalMarks("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add exam to schedule.");
    } finally {
      setIsAddingEntry(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingEntry) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/exam/${deletingEntry.id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Exam schedule entry deleted.");
      fetchSchedule(selectedClassId);
      setDeletingEntry(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete entry.");
    }
  };

  const handleUpdate = async (examId: number, updatedData: any) => {
    const params = new URLSearchParams();
    for (const key in updatedData) {
      if (updatedData[key] !== null && updatedData[key] !== undefined) {
        params.append(key, updatedData[key]);
      }
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/exam/${examId}`,
        params,
        {
          withCredentials: true,
        }
      );
      toast.success("Schedule updated!");
      fetchSchedule(selectedClassId);
      setEditingEntry(null);
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Failed to update schedule.");
      return false;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create & View Exam Schedule</CardTitle>
          <CardDescription>
            Select a class to view its schedule or add new exams.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exam Name</Label>
              <Input
                placeholder="e.g., PET, Mid-Term"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Select Class</Label>
              <Select
                onValueChange={setSelectedClassId}
                value={selectedClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.standard}-{c.division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClassId && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Exam Entry</CardTitle>
            <CardDescription>
              Add a subject to an exam for the selected class.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select onValueChange={setSubjectId} value={subjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.subject_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full"
                  onClick={handleAddToSchedule}
                  disabled={isAddingEntry}
                >
                  {isAddingEntry && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isAddingEntry ? "Adding..." : "Add to Schedule"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedClassId && (
        <Card>
          <CardHeader>
            <CardTitle>
              Full Schedule for Class{" "}
              {classes.find((c) => String(c.id) === selectedClassId)?.standard}
            </CardTitle>
            <CardDescription>
              Showing all exams found for this class.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-4">
                Loading schedule...
              </p>
            ) : Object.keys(scheduleData).length > 0 ? (
              <div className="space-y-6">
                {Object.keys(scheduleData).map((examKey) => (
                  <div key={examKey}>
                    <h3 className="text-xl font-semibold capitalize mb-2 border-b pb-1">
                      {examKey}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Marks</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduleData[examKey].map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.subject_name || "N/A"}</TableCell>
                            <TableCell>
                              {/* ✅ FIX: Added try-catch to prevent crash on invalid date */}
                              {(() => {
                                if (!item.exam_date) return "N/A";
                                try {
                                  return format(
                                    parseISO(item.exam_date),
                                    "dd-MMM-yyyy"
                                  );
                                } catch (e) {
                                  console.log(e);

                                  return item.exam_date; // Fallback to raw string
                                }
                              })()}
                            </TableCell>
                            <TableCell>
                              {/* ✅ FIX: Kept robust time formatting */}
                              {(() => {
                                if (!item.start_time) return "N/A";
                                try {
                                  const timeStr =
                                    item.start_time.length === 5
                                      ? `${item.start_time}:00`
                                      : item.start_time;
                                  return format(
                                    parseISO(`1970-01-01T${timeStr}`),
                                    "p"
                                  );
                                } catch (e) {
                                  console.log(e);

                                  return item.start_time;
                                }
                              })()}
                            </TableCell>
                            <TableCell>{item.total_marks ?? "N/A"}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setEditingEntry({
                                    ...item,
                                    exam_name: examKey,
                                  })
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingEntry(item)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No exam schedule found for this class.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingEntry}
        onOpenChange={(open) => !open && setEditingEntry(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <EditExamDialog
              entry={editingEntry}
              onUpdate={handleUpdate}
              subjects={subjects}
              onClose={() => setEditingEntry(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deletingEntry}
        onOpenChange={(open) => !open && setDeletingEntry(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the schedule for{" "}
              <span className="font-semibold">
                {deletingEntry?.subject_name || "this entry"}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingEntry(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// --- Edit Dialog Component (Complete and Fixed) ---
function EditExamDialog({
  entry,
  onUpdate,
  subjects,
  onClose,
}: {
  entry: EditScheduleEntry;
  onUpdate: (id: number, data: any) => Promise<boolean>;
  subjects: Subject[];
  onClose: () => void;
}) {
  const [examData, setExamData] = useState(() => {
    // ✅ FIX: Safe initialization to prevent crash on invalid date
    let formattedDate = "";
    try {
      if (entry.exam_date) {
        formattedDate = format(parseISO(entry.exam_date), "yyyy-MM-dd");
      }
    } catch (e) {
      console.log(e);

      console.error("Invalid date value for editing:", entry.exam_date);
    }

    return {
      exam_name: entry.exam_name || "",
      subject_id: entry.subject_id?.toString() || "",
      exam_date: formattedDate,
      start_time: entry.start_time ? entry.start_time.substring(0, 5) : "",
      total_marks: entry.total_marks?.toString() || "",
    };
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    setIsSaving(true);
    // ✅ FIX: Kept the logic to handle empty string for total_marks
    const dataToUpdate = {
      ...examData,
      total_marks: examData.total_marks === "" ? null : examData.total_marks,
    };

    const success = await onUpdate(entry.id, dataToUpdate);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Exam Name</Label>
        <Input
          name="exam_name"
          value={examData.exam_name}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label>Subject</Label>
        <Select
          name="subject_id"
          onValueChange={(value) => handleSelectChange("subject_id", value)}
          value={examData.subject_id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.subject_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Date</Label>
        <Input
          type="date"
          name="exam_date"
          value={examData.exam_date}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label>Start Time</Label>
        <Input
          type="time"
          name="start_time"
          value={examData.start_time}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label>Total Marks</Label>
        <Input
          type="number"
          name="total_marks"
          value={examData.total_marks}
          onChange={handleChange}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </div>
  );
}
