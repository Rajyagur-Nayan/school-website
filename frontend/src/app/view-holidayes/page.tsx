// components/holiday/HolidayList.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, parseISO, differenceInDays } from "date-fns";
import { CalendarDays, CalendarPlus, CalendarMinus } from "lucide-react";
import { gsap } from "gsap";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// --- Data Type ---
interface Holiday {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

/** Formats an ISO string (from API) to a user-friendly display format */
const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), "do MMMM, yyyy"); // e.g., "14th October, 2025"
  } catch (error) {
    return "Invalid Date";
  }
};

const getDurationInDays = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return null;
  try {
    const start = parseISO(startStr);
    const end = parseISO(endStr);
    const days = differenceInDays(end, start) + 1;
    return `${days} ${days === 1 ? "Day" : "Days"}`;
  } catch (error) {
    return null;
  }
};

// --- NEW: Array of distinct background colors (Tailwind classes) ---
const cardBackgrounds = [
  "bg-blue-50/70 dark:bg-blue-900/40", // Light Blue
  "bg-green-50/70 dark:bg-green-900/40", // Light Green
  "bg-purple-50/70 dark:bg-purple-900/40", // Light Purple
  "bg-orange-50/70 dark:bg-orange-900/40", // Light Orange
  "bg-red-50/70 dark:bg-red-900/40", // Light Red
  "bg-teal-50/70 dark:bg-teal-900/40", // Light Teal
];

/**
 * A component to display a list of holidays as an animated, attractive grid.
 * Each card will have a different background color from a predefined set.
 */
export default function HolidayList() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/holiday`,
          { withCredentials: true }
        );
        const sortedHolidays = (response.data || []).sort(
          (a: Holiday, b: Holiday) =>
            parseISO(b.start_date).getTime() - parseISO(a.start_date).getTime()
        );
        setHolidays(sortedHolidays);
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
        toast.error("Could not load holiday list.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  useEffect(() => {
    if (!isLoading && holidays.length > 0) {
      gsap.fromTo(
        ".gsap-holiday-card",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
        }
      );
    }
  }, [isLoading, holidays]);

  /**
   * Renders the skeleton loading placeholders in a grid layout
   */
  const renderSkeletonGrid = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <Card
          key={index}
          className={`flex flex-col ${
            cardBackgrounds[index % cardBackgrounds.length]
          } border-none shadow-md`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <Skeleton className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700" />{" "}
              {/* Adjusted skeleton bg */}
              <Skeleton className="h-6 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
            </div>
            <Skeleton className="mt-3 h-7 w-3/4 bg-gray-200 dark:bg-gray-700" />
          </CardHeader>
          <CardContent className="flex-1 space-y-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="w-full space-y-1">
                <Skeleton className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="w-full space-y-1">
                <Skeleton className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-20 text-center text-muted-foreground">
      <CalendarDays className="h-12 w-12" />
      <p className="mt-4 text-xl font-medium">No Holidays Found</p>
      <p className="mt-2 text-sm">
        It looks like no holidays have been scheduled yet.
      </p>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Holiday Schedule</CardTitle>
        <CardDescription>
          A schedule of all upcoming and past school holidays.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          renderSkeletonGrid()
        ) : holidays.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {holidays.map((holiday, index) => {
              const duration = getDurationInDays(
                holiday.start_date,
                holiday.end_date
              );
              // --- NEW: Select background color based on index ---
              const bgColorClass =
                cardBackgrounds[index % cardBackgrounds.length];

              return (
                <Card
                  key={holiday.id}
                  className={`gsap-holiday-card flex flex-col opacity-0 transition-all hover:shadow-xl ${bgColorClass} border-none shadow-md`} // Added bgColorClass and removed default border
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      {/* Main Icon - changed background for better contrast */}
                      <div className="flex-shrink-0 rounded-lg bg-background p-3 text-primary shadow-sm">
                        <CalendarDays className="h-6 w-6" />
                      </div>
                      {/* Duration Badge */}
                      {duration && (
                        <Badge variant="secondary">{duration}</Badge>
                      )}
                    </div>
                    {/* Holiday Name */}
                    <CardTitle className="pt-3 text-xl font-bold tracking-tight">
                      {holiday.name}
                    </CardTitle>
                  </CardHeader>

                  {/* Date Information */}
                  <CardContent className="flex flex-1 flex-col justify-end space-y-4">
                    {/* Start Date */}
                    <div className="flex items-center gap-3">
                      <CalendarPlus className="h-5 w-5 flex-shrink-0 text-green-700 dark:text-green-400" />{" "}
                      {/* Adjusted color */}
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                          Starts On
                        </p>
                        <p className="text-md font-medium text-foreground">
                          {formatDateForDisplay(holiday.start_date)}
                        </p>
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="flex items-center gap-3">
                      <CalendarMinus className="h-5 w-5 flex-shrink-0 text-red-700 dark:text-red-400" />{" "}
                      {/* Adjusted color */}
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                          Ends On
                        </p>
                        <p className="text-md font-medium text-foreground">
                          {formatDateForDisplay(holiday.end_date)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
