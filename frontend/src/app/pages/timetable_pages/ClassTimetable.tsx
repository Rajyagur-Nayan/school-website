"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// --- Data Types ---
interface Class {
  id: number;
  standard: string;
  division: string;
}
interface Faculty {
  id: number;
  f_name: string;
  l_name: string;
}
interface TimetableEntry {
  day: string;
  period_number: number;
  subject_name: string;
  f_name: string;
  l_name: string;
}
interface FacultyScheduleEntry {
  day: string;
  period_number: number;
  subject_name: string;
  standard: string;
  division: string;
}
interface TimetableCellData {
  content: React.ReactNode;
  color?: string;
}
interface FormattedTimetable {
  [day: string]: { [period: number]: TimetableCellData };
}

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// --- NEW: Define a Palette of Colors ---
const colorPalette = [
  "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200",
  "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
];
// --- END NEW ---

// --- Reusable Components (TimetableDisplay remains the same) ---
const TimetableDisplay = ({
  timetable,
  periods,
}: {
  timetable: FormattedTimetable;
  periods: number[];
}) => {
  if (periods.length === 0) return null;

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table className="min-w-full table-fixed">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-gray-100 dark:bg-gray-800">
            <TableHead className="font-semibold w-[100px] text-center border-r dark:border-gray-700 px-2 py-3">
              <span className="sr-only">Period / Day</span>
            </TableHead>
            {WEEK_DAYS.map((day) => (
              <TableHead
                key={day}
                className="text-center font-semibold text-gray-700 dark:text-gray-300
                           border-x last:border-r-0 first:border-l-0 dark:border-gray-700 px-2 py-3"
              >
                {day.substring(0, 3)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {periods.map((period) => (
            <TableRow
              key={period}
              className="border-b last:border-b-0 dark:border-gray-700"
            >
              <TableCell
                className="font-semibold text-center align-middle
                           bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           border-r dark:border-gray-700"
              >
                {`P${period}`}
              </TableCell>
              {WEEK_DAYS.map((day) => {
                const cellData = timetable[day]?.[period];
                // Use assigned color or transparent for free periods
                const cellColor = cellData?.color || "bg-transparent";

                return (
                  <TableCell
                    key={day}
                    // Apply color and padding
                    className={`h-20 align-top border-x last:border-r-0 first:border-l-0 dark:border-gray-700 p-0 ${cellColor}`}
                  >
                    {cellData ? (
                      <div className="p-2 h-full flex flex-col justify-center">
                        {cellData.content}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs italic p-1">
                        Free
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const LoadingSpinner = ({ text }: { text: string }) => (
  <div className="flex flex-col items-center justify-center text-muted-foreground py-10 space-y-2">
    <Loader2 className="h-8 w-8 animate-spin" />
    <p>{text}</p>
  </div>
);

export function ClassTimetable() {
  // Common state
  const [classes, setClasses] = useState<Class[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // State for Class-wise tab
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classTimetable, setClassTimetable] = useState<FormattedTimetable>({});
  const [classPeriods, setClassPeriods] = useState<number[]>([]);
  const [isClassLoading, setIsClassLoading] = useState(false);
  const [classError, setClassError] = useState<string | null>(null);

  // State for Teacher-wise tab
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    null
  );
  const [facultyTimetable, setFacultyTimetable] = useState<FormattedTimetable>(
    {}
  );
  const [facultyPeriods, setFacultyPeriods] = useState<number[]>([]);
  const [isFacultyLoading, setIsFacultyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState<string | null>(null);

  // 1. Fetch initial form data
  useEffect(() => {
    const fetchFormData = async () => {
      setIsInitialLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add_slot/form-data`,
          { withCredentials: true }
        );
        setClasses(response.data.classes || []);
        setFaculty(response.data.faculty || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch initial form data.");
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchFormData();
  }, []);

  // 2. Fetch timetable for the selected CLASS
  useEffect(() => {
    if (!selectedClassId) {
      setClassTimetable({});
      setClassPeriods([]);
      return;
    }
    const fetchTimetable = async () => {
      setIsClassLoading(true);
      setClassError(null);
      try {
        const response = await axios.get<TimetableEntry[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/timetable/class/${selectedClassId}`,
          { withCredentials: true }
        );
        const uniquePeriods: number[] = [
          ...new Set(response.data.map((entry) => entry.period_number)),
        ].sort((a, b) => a - b);
        const formattedData: FormattedTimetable = {};

        // --- NEW: Dynamic Color Assignment Logic ---
        const assignedColors: { [subject: string]: string } = {};
        let colorIndex = 0;
        // --- END NEW ---

        response.data.forEach((entry) => {
          if (!formattedData[entry.day]) {
            formattedData[entry.day] = {};
          }

          // --- NEW: Assign color if subject is new ---
          if (!assignedColors[entry.subject_name]) {
            assignedColors[entry.subject_name] =
              colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
          }
          const color = assignedColors[entry.subject_name];
          // --- END NEW ---

          formattedData[entry.day][entry.period_number] = {
            content: (
              <div className="text-center">
                <p className="font-medium text-xs sm:text-sm truncate">
                  {entry.subject_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{`${entry.f_name} ${entry.l_name}`}</p>
              </div>
            ),
            color: color, // Store the assigned color
          };
        });
        setClassPeriods(uniquePeriods);
        setClassTimetable(formattedData);
      } catch (err: any) {
        setClassTimetable({});
        setClassPeriods([]);
        const errorMsg =
          err.response?.data?.error || "Failed to fetch timetable.";
        setClassError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsClassLoading(false);
      }
    };
    fetchTimetable();
  }, [selectedClassId]);

  // 3. Fetch timetable for the selected FACULTY
  useEffect(() => {
    if (!selectedFacultyId) {
      setFacultyTimetable({});
      setFacultyPeriods([]);
      return;
    }
    const fetchTimetable = async () => {
      setIsFacultyLoading(true);
      setFacultyError(null);
      try {
        const response = await axios.get<FacultyScheduleEntry[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/timetable/faculty/${selectedFacultyId}`,
          { withCredentials: true }
        );
        const uniquePeriods: number[] = [
          ...new Set(response.data.map((entry) => entry.period_number)),
        ].sort((a, b) => a - b);
        const formattedData: FormattedTimetable = {};

        // --- NEW: Dynamic Color Assignment Logic ---
        const assignedColors: { [subject: string]: string } = {};
        let colorIndex = 0;
        // --- END NEW ---

        response.data.forEach((entry) => {
          if (!formattedData[entry.day]) {
            formattedData[entry.day] = {};
          }

          // --- NEW: Assign color if subject is new ---
          if (!assignedColors[entry.subject_name]) {
            assignedColors[entry.subject_name] =
              colorPalette[colorIndex % colorPalette.length];
            colorIndex++;
          }
          const color = assignedColors[entry.subject_name];
          // --- END NEW ---

          formattedData[entry.day][entry.period_number] = {
            content: (
              <div className="text-center">
                <p className="font-medium text-xs sm:text-sm truncate">
                  {entry.subject_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{`${entry.standard} - ${entry.division}`}</p>
              </div>
            ),
            color: color, // Store the assigned color
          };
        });
        setFacultyPeriods(uniquePeriods);
        setFacultyTimetable(formattedData);
      } catch (err: any) {
        setFacultyTimetable({});
        setFacultyPeriods([]);
        const errorMsg =
          err.response?.data?.error || "Failed to fetch schedule.";
        setFacultyError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsFacultyLoading(false);
      }
    };
    fetchTimetable();
  }, [selectedFacultyId]);

  if (isInitialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timetable Viewer</CardTitle>
          <CardDescription>
            View the weekly schedule for a specific class or teacher.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Loading initial data..." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timetable Viewer</CardTitle>
        <CardDescription>
          View the weekly schedule for a specific class or teacher.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="class-wise">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="class-wise">Class-wise</TabsTrigger>
            <TabsTrigger value="teacher-wise">Teacher-wise</TabsTrigger>
          </TabsList>

          <TabsContent value="class-wise" className="mt-0 pt-4">
            <div className="mb-4">
              <Label htmlFor="class-select">Select Class</Label>
              <Select
                onValueChange={setSelectedClassId}
                disabled={classes.length === 0}
              >
                <SelectTrigger
                  id="class-select"
                  className="w-full md:w-[280px] mt-1"
                >
                  <SelectValue placeholder="Choose a class..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.length > 0 ? (
                    classes.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={String(c.id)}
                      >{`${c.standard} - ${c.division}`}</SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      No classes found.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            {isClassLoading && <LoadingSpinner text="Loading timetable..." />}
            {classError && (
              <p className="text-center text-red-500 py-10">{classError}</p>
            )}
            {!isClassLoading &&
              !classError &&
              selectedClassId &&
              classPeriods.length === 0 && (
                <p className="text-center text-muted-foreground py-10">
                  No schedule has been created for this class yet.
                </p>
              )}
            {!isClassLoading && !classError && selectedClassId && (
              <TimetableDisplay
                timetable={classTimetable}
                periods={classPeriods}
              />
            )}
            {!selectedClassId && !isClassLoading && !classError && (
              <p className="text-center text-muted-foreground py-10">
                Please select a class to view its timetable.
              </p>
            )}
          </TabsContent>

          <TabsContent value="teacher-wise" className="mt-0 pt-4">
            <div className="mb-4">
              <Label htmlFor="teacher-select">Select Teacher</Label>
              <Select
                onValueChange={setSelectedFacultyId}
                disabled={faculty.length === 0}
              >
                <SelectTrigger
                  id="teacher-select"
                  className="w-full md:w-[280px] mt-1"
                >
                  <SelectValue placeholder="Choose a teacher..." />
                </SelectTrigger>
                <SelectContent>
                  {faculty.length > 0 ? (
                    faculty.map((f) => (
                      <SelectItem
                        key={f.id}
                        value={String(f.id)}
                      >{`${f.f_name} ${f.l_name}`}</SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      No faculty found.
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            {isFacultyLoading && <LoadingSpinner text="Loading schedule..." />}
            {facultyError && (
              <p className="text-center text-red-500 py-10">{facultyError}</p>
            )}
            {!isFacultyLoading &&
              !facultyError &&
              selectedFacultyId &&
              facultyPeriods.length === 0 && (
                <p className="text-center text-muted-foreground py-10">
                  No schedule has been created for this teacher yet.
                </p>
              )}
            {!isFacultyLoading && !facultyError && selectedFacultyId && (
              <TimetableDisplay
                timetable={facultyTimetable}
                periods={facultyPeriods}
              />
            )}
            {!selectedFacultyId && !isFacultyLoading && !facultyError && (
              <p className="text-center text-muted-foreground py-10">
                Please select a teacher to view their schedule.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
