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
interface Faculty {
  id: number;
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

export function TeacherTimetable() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(
    null
  );
  const [timetable, setTimetable] = useState<FormattedTimetable>({});
  const [periods, setPeriods] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch the list of faculty for the dropdown
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/add_slot/form-data`,
          { withCredentials: true }
        );
        setFaculty(response.data.faculty || []);
      } catch (err) {
        console.log(err);

        toast.error("Failed to fetch faculty list.");
      }
    };
    fetchFaculty();
  }, []);

  // 2. Fetch the schedule for the selected faculty member
  useEffect(() => {
    if (!selectedFacultyId) {
      setTimetable({});
      setPeriods([]);
      return;
    }
    const fetchTimetable = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<FacultyScheduleEntry[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/timetable/faculty/${selectedFacultyId}`,
          { withCredentials: true }
        );
        const uniquePeriods: number[] = [
          ...new Set(response.data.map((entry) => entry.period_number)),
        ].sort((a, b) => a - b);

        const formattedData: FormattedTimetable = {};

        response.data.forEach((entry) => {
          if (!formattedData[entry.day]) {
            formattedData[entry.day] = {};
          }

          // --- MODIFICATION: Format content to match image style ---
          formattedData[entry.day][entry.period_number] = {
            content: (
              <div className="text-left">
                {/* Image has time, but we don't have that data */}
                <p className="font-semibold text-sm">{`${entry.standard}${entry.division} - ${entry.subject_name}`}</p>
              </div>
            ),
          };
          // --- END MODIFICATION ---
        });
        setPeriods(uniquePeriods);
        setTimetable(formattedData);
      } catch (err: any) {
        setTimetable({});
        setPeriods([]);
        const errorMsg =
          err.response?.data?.error || "Failed to fetch schedule.";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimetable();
  }, [selectedFacultyId]);

  // --- MODIFICATION: Added color array for styling ---
  const cardColors = [
    "bg-sky-100 text-sky-900 dark:bg-sky-900/70 dark:text-sky-100",
    "bg-pink-100 text-pink-900 dark:bg-pink-900/70 dark:text-pink-100",
    "bg-violet-100 text-violet-900 dark:bg-violet-900/70 dark:text-violet-100",
    "bg-teal-100 text-teal-900 dark:bg-teal-900/70 dark:text-teal-100",
    "bg-amber-100 text-amber-900 dark:bg-amber-900/70 dark:text-amber-100",
  ];
  // --- END MODIFICATION ---

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher-wise Timetable</CardTitle>
        <CardDescription>
          View the weekly schedule for a specific teacher.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label>Select Teacher</Label>
          <Select onValueChange={setSelectedFacultyId}>
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Choose a teacher..." />
            </SelectTrigger>
            <SelectContent>
              {faculty.map((f) => (
                <SelectItem key={f.id} value={String(f.id)}>
                  {`${f.f_name} ${f.l_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
          <p className="text-center text-muted-foreground">
            Loading schedule...
          </p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* --- MODIFICATION: Reworked Table Layout & Styling --- */}
        {!isLoading && !error && periods.length > 0 && (
          <div className="border rounded-md overflow-x-auto">
            {/* Use border-separate for a grid-like feel */}
            <Table className="border-separate border-spacing-0 min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-[100px] text-center align-middle p-3">
                    {/* Empty corner cell */}
                  </TableHead>
                  {WEEK_DAYS.map((day) => (
                    <TableHead
                      key={day}
                      className="text-center font-semibold p-3 border-b border-l"
                    >
                      {day}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Rows are now Periods */}
                {periods.map((period, pIndex) => (
                  <TableRow key={period}>
                    {/* First cell is the Period header, like time in the image */}
                    <TableCell className="font-semibold text-sm text-center align-top p-3 text-muted-foreground border-b border-r">
                      <p>Period {period}</p>
                    </TableCell>

                    {/* Columns are now Days */}
                    {WEEK_DAYS.map((day) => {
                      const cellData = timetable[day]?.[period];
                      const colorClass = cellData
                        ? cardColors[pIndex % cardColors.length]
                        : "";

                      return (
                        <TableCell
                          key={day}
                          className="border h-24 w-36 p-1 align-top bg-gray-50/30 dark:bg-gray-800/20"
                        >
                          {cellData ? (
                            <div
                              className={`h-full w-full rounded-lg p-2 ${colorClass}`}
                            >
                              {cellData.content}
                            </div>
                          ) : // Empty cell, matching the image
                          null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {/* --- END MODIFICATION --- */}

        {!isLoading && !error && selectedFacultyId && periods.length === 0 && (
          <p className="text-center text-muted-foreground py-10">
            No schedule has been created for this teacher yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
