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

// --- Data Types ---
interface Class {
  id: number;
  standard: string;
  division: string;
}

interface ClassScheduleEntry {
  day: string;
  period_number: number;
  subject_name: string;
  f_name: string;
  l_name: string;
}

interface FormattedTimetable {
  [day: string]: {
    [period: number]: {
      content: React.ReactNode;
    };
  };
}

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Define a set of consistent colors for class blocks for both light and dark modes
// These are Tailwind CSS classes that will apply background and text colors
const classBlockColors = [
  {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-800 dark:text-blue-100",
  },
  {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-800 dark:text-green-100",
  },
  {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-800 dark:text-purple-100",
  },
  {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-800 dark:text-yellow-100",
  },
  { bg: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-100" },
  {
    bg: "bg-indigo-100 dark:bg-indigo-900",
    text: "text-indigo-800 dark:text-indigo-100",
  },
];

export default function ClassTimetable() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [timetable, setTimetable] = useState<FormattedTimetable>({});
  const [periods, setPeriods] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch the list of classes for the dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add_slot/form-data`,
          { withCredentials: true }
        );
        setClasses(response.data.classes || []);
      } catch (err) {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
        toast.error("Failed to fetch class list.");
      }
    };
    fetchClasses();
  }, []);

  // 2. Fetch the schedule for the selected class (This is the logic you provided)
  useEffect(() => {
    if (!selectedClassId) {
      setTimetable({});
      setPeriods([]);
      return;
    }
    const fetchTimetable = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<ClassScheduleEntry[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/timetable/class/${selectedClassId}`,
          { withCredentials: true }
        );
        const uniquePeriods: number[] = [
          ...new Set(response.data.map((entry) => entry.period_number)),
        ].sort((a, b) => a - b);

        // Map subject names to a consistent color index
        const subjectColorMap = new Map<string, number>();
        let colorIndex = 0;

        const formattedData: FormattedTimetable = {};
        response.data.forEach((entry) => {
          if (!formattedData[entry.day]) {
            formattedData[entry.day] = {};
          }

          if (!subjectColorMap.has(entry.subject_name)) {
            subjectColorMap.set(entry.subject_name, colorIndex++);
            if (colorIndex >= classBlockColors.length) {
              colorIndex = 0; // Reset color index if we run out of unique colors
            }
          }
          const assignedColor =
            classBlockColors[subjectColorMap.get(entry.subject_name)!];

          formattedData[entry.day][entry.period_number] = {
            content: (
              <div
                className={`
                rounded-md p-2 h-full flex flex-col justify-center items-center text-center
                ${assignedColor.bg} ${assignedColor.text}
                shadow-sm
              `}
              >
                <p className="font-semibold text-sm leading-tight">
                  {entry.subject_name}
                </p>
                <p className="text-xs leading-tight opacity-80">{`${entry.f_name} ${entry.l_name}`}</p>
              </div>
            ),
          };
        });
        setPeriods(uniquePeriods);
        setTimetable(formattedData);
      } catch (err: any) {
        setTimetable({});
        setPeriods([]);
        const errorMsg =
          err.response?.data?.error || "Failed to fetch timetable.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimetable();
  }, [selectedClassId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class-wise Timetable</CardTitle>
        <CardDescription>
          View the weekly schedule for a specific class.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label>Select Class</Label>
          <Select
            onValueChange={setSelectedClassId}
            disabled={classes.length === 0}
          >
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Choose a class..." />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {`${c.standard} - ${c.division}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <p className="text-center text-muted-foreground py-10">
            Loading timetable...
          </p>
        )}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {!isLoading && !error && periods.length > 0 && (
          <div className="border rounded-md overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="font-bold w-[120px] text-center border-r dark:border-gray-700">
                    <span className="sr-only">Period / Day</span>
                  </TableHead>
                  {/* Columns are now the days */}
                  {WEEK_DAYS.map((day) => (
                    <TableHead
                      key={day}
                      className="text-center font-bold text-gray-700 dark:text-gray-300
                                 border-x last:border-r-0 first:border-l-0 dark:border-gray-700"
                    >
                      {day.substring(0, 3)}{" "}
                      {/* Abbreviate day names for compactness */}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Rows are now the periods */}
                {periods.map((period) => (
                  <TableRow
                    key={period}
                    className="border-b last:border-b-0 dark:border-gray-700"
                  >
                    <TableCell
                      className="font-semibold text-center align-middle
                                 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                                 border-r dark:border-gray-700"
                    >
                      {`P${period}`} {/* Shorthand for Period */}
                    </TableCell>
                    {/* Cells inside the row iterate through days */}
                    {WEEK_DAYS.map((day) => (
                      <TableCell
                        key={day}
                        className="p-1 h-20 w-40 max-w-[160px] align-top
                                   border-x last:border-r-0 first:border-l-0 dark:border-gray-700"
                      >
                        {timetable[day]?.[period] ? (
                          timetable[day][period].content
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm italic">
                            Free
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {!isLoading && !error && selectedClassId && periods.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No schedule has been created for this class yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
