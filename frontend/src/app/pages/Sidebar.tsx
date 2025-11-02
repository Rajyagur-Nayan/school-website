"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Megaphone,
  IndianRupee,
  CalendarDays,
  Bot,
  School,
  UserCheck,
  Warehouse,
  FileQuestion,
  ChevronRight,
  Menu,
  ClipboardList,
  Umbrella,
  BrainCircuit,
  GraduationCap,
  UmbrellaIcon,
  Plus,
} from "lucide-react";
// --- MODIFIED: Imported useRouter ---
import { usePathname, useRouter } from "next/navigation";

// --- Link list for Teachers ---
const teacherItems = [
  {
    title: "Admin Dashboard",
    icon: LayoutDashboard,
    href: "/admin-dashboard",
  },

  { title: "Add Student using excel", icon: Users, href: "/add-student" },
  { title: "Student admission", icon: Users, href: "/student-management" },
  { title: "Fee's", icon: IndianRupee, href: "/fee-management" },
  { title: "Exam's", icon: ClipboardList, href: "/exam-management" },
  {
    title: "Attendance",
    icon: UserCheck,
    href: "/attendance-management",
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
// --- Link list for Parents ---
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

// --- Sidebar Component ---
const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const pathname = usePathname();
  const router = useRouter(); // --- MODIFIED: Initialized router ---
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- MODIFIED: Added redirect logic ---
  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (!role) {
      // No role found, redirect to login page
      router.push("/login"); // Assuming '/login' is your login page
    } else {
      // Role found, set state and continue
      setUserRole(role);
      setIsLoading(false);
    }
  }, [router]);

  const sidebarLinks = userRole === "parent" ? parentItems : teacherItems;

  const renderLink = (link: any) => {
    const isActive =
      pathname.startsWith(link.href) && (link.href !== "/" || pathname === "/");

    if (link.type === "title") {
      return (
        <p
          key={link.title}
          className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider lg:text-center lg:group-hover:text-left"
        >
          <span className="lg:hidden lg:group-hover:inline whitespace-nowrap">
            {link.title}
          </span>
        </p>
      );
    }

    if (link.type === "collapsible") {
      return (
        <Collapsible key={link.title} defaultOpen={isActive}>
          <CollapsibleTrigger className="w-full">
            <div
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 
                lg:justify-center lg:group-hover:justify-between ${
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200"
                    : "text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
            >
              <div className="flex items-center">
                <link.icon className="h-6 w-6" />
                <span className="ml-3 text-sm font-medium lg:hidden lg:group-hover:inline whitespace-nowrap">
                  {link.title}
                </span>
              </div>
              <ChevronRight className="h-5 w-5 transition-transform group-data-[state=open]:rotate-90 lg:hidden lg:group-hover:inline" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-8 pl-3 mt-1 border-l border-slate-300 dark:border-slate-700 lg:hidden lg:group-hover:block">
            {link.subLinks.map((sub: any) => {
              const isSubActive = pathname === sub.href;
              return (
                <Link
                  key={sub.title}
                  href={sub.href}
                  className={`block py-1.5 px-3 text-sm rounded-md my-1 transition-colors ${
                    isSubActive
                      ? "text-blue-600 font-semibold dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {sub.title}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // This handles `type: "link"`
    return (
      <Link
        key={link.title}
        href={link.href}
        className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-all duration-200
          lg:justify-center lg:group-hover:justify-start ${
            isActive
              ? "bg-blue-50 text-blue-600 font-semibold dark:bg-blue-900/30 dark:text-blue-200"
              : "text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
      >
        <link.icon className="h-6 w-6" />
        <span className="ml-3 lg:hidden lg:group-hover:inline whitespace-nowrap">
          {link.title}
        </span>
      </Link>
    );
  };

  // This loading state is now crucial. It prevents the sidebar from rendering
  // (and defaulting to 'teacherItems') before the auth check is complete.
  if (isLoading) {
    return (
      <aside
        className={`group fixed lg:relative z-40 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 transform flex flex-col 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:w-20 overflow-hidden`}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3">
          <p className="text-center text-sm text-slate-400">Loading menu...</p>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside
        className={`group fixed lg:relative h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 transform flex flex-col 
      z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:w-20 lg:hover:w-72 overflow-hidden`}
      >
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3">
          <div className="space-y-1">
            {sidebarLinks.map((link) => renderLink(link))}
          </div>
        </nav>
      </aside>

      {/* This is the overlay that shows on mobile when the menu is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm
          z-40 lg:hidden`}
        />
      )}
    </>
  );
};

// --- Main AppShell Component (No Change) ---
export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-gray-200 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/*
         *
         * THIS IS THE MOBILE HEADER
         *
         */}
        <header
          className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 shadow-md flex items-center justify-between p-4 h-16 border-b dark:border-slate-800
    
         z-40"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="bg-slate-100 dark:bg-slate-800"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Edu-Center</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 mt-16 lg:mt-0">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
