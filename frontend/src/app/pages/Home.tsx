"use client"; // Required because DashboardCard uses a Link and is interactive

// --- Added useState and useEffect ---
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import {
  School,
  Users,
  UserCog,
  ClipboardList,
  Megaphone,
  Warehouse,
  CalendarDays,
  IndianRupee,
  UserCheck,
  FileQuestion,
  Bot,
  LayoutDashboard,
  GraduationCap,
  BrainCircuit,
  Umbrella,
  UmbrellaIcon,
  Plus,
} from "lucide-react";

// --- DashboardCard Component Definition ---
interface DashboardCardProps {
  title: string;
  icon: React.ElementType; // Type for Lucide icons
  href: string;
}

function DashboardCard({ title, icon: Icon, href }: DashboardCardProps) {
  return (
    <Link href={href}>
      <Card className="flex flex-col items-center justify-center p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer h-40 w-48">
        <CardContent className="flex flex-col items-center p-0 pt-4">
          <Icon className="h-10 w-10 text-gray-700 dark:text-white mb-3" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}

// --- End of DashboardCard Definition ---

// --- Defined item lists based on role ---
const parentItems = [
  {
    title: "Student Dashboard",
    icon: GraduationCap,
    href: "/student-dashboard",
  },
  { title: "School Information", icon: School, href: "/school-info" },
  { title: "Exam's", icon: ClipboardList, href: "/view-exam-report" },
  {
    title: "Attendance",
    icon: UserCheck,
    href: "/view-attendance-report",
  },
  {
    title: "Timetable",
    icon: CalendarDays,
    href: "/view-timetable",
  },
  {
    title: "Ai Chat Bot",
    icon: Bot,
    href: "/ai-chatbot",
  },
  { title: "Events", icon: Megaphone, href: "/view_event" },
  {
    title: "Inventory",
    icon: Warehouse,
    href: "/view-inventory",
  },
  {
    title: "AI-Lerning",
    icon: BrainCircuit,
    href: "/ai-lerning",
  },
  { title: "View Holiday", icon: Umbrella, href: "/view-holidayes" },
];

const teacherItems = [
  {
    title: "Admin Dashboard",
    icon: LayoutDashboard,
    href: "/admin-dashboard",
  },

  { title: "Add Student useing Excel", icon: Users, href: "/add-student" },
  { title: "Student admission", icon: Users, href: "/student-management" },
  { title: "Fee's", icon: IndianRupee, href: "/fee-management" },
  { title: "Exam's", icon: ClipboardList, href: "/exam-management" },
  {
    title: "Student Attendance",
    icon: UserCheck,
    href: "/attendance-management",
  },
  {
    title: "feculty Attendance",
    icon: UserCheck,
    href: "/staff-attendance",
  },
  {
    title: "Timetable",
    icon: CalendarDays,
    href: "/timetable-management/view",
  },
  { title: "Staff Management", icon: UserCog, href: "/staff-management" },
  { title: "Add Department", icon: Plus, href: "/add-school" },
  {
    title: "Exam paper Gunration",
    icon: FileQuestion,
    href: "/exam-paper-generator",
  },
  { title: "Events", icon: Megaphone, href: "/event-management" },
  {
    title: "Holidayes",
    icon: UmbrellaIcon,
    href: "/holiday-management",
  },
  {
    title: "Inventory",
    icon: Warehouse,
    href: "/inventory-management",
  },
];

export default function HomePage() {
  // --- State to hold the user's role ---
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- useEffect to safely access localStorage on the client ---
  useEffect(() => {
    // This code runs only in the browser
    const role = localStorage.getItem("user_role");
    setUserRole(role);
    setIsLoading(false);
  }, []); // Empty array ensures this runs only once on mount

  // --- Determine which items to display ---
  const itemsToDisplay =
    userRole === "parent"
      ? parentItems
      : userRole === "teacher"
      ? teacherItems
      : []; // Default to empty array if no role matches

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-grow container mx-auto p-8">
        {/* --- Conditional Rendering based on loading and role --- */}
        {isLoading ? (
          <div className="text-center text-gray-700 dark:text-white">
            Loading dashboard...
          </div>
        ) : itemsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {itemsToDisplay.map((item) => (
              <DashboardCard
                key={item.href} // <-- FIX: Use unique href for key
                title={item.title}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700 dark:text-white">
            No dashboard items available for your role.
          </div>
        )}
      </main>
    </div>
  );
}
