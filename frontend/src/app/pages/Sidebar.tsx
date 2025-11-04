"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  ClipboardList,
  Umbrella,
  BrainCircuit,
  GraduationCap,
  UmbrellaIcon,
  Plus,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  House,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "./auth/AuthContext";

// ---------------- MENU ITEMS ----------------
const teacherItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin-dashboard",
  },
  { title: "Home", icon: House, href: "/home" },

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

const parentItems = [
  {
    title: "Student Dashboard",
    icon: GraduationCap,
    href: "/student-dashboard",
  },
  { title: "Home", icon: House, href: "/home" },
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

const adminItems = [
  {
    title: "Admin Dashboard",
    icon: LayoutDashboard,
    href: "/admin-dashboard",
  },
];

// ---------------- SIDEBAR ----------------
function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  // ✅ Hooks must come first
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const { logout, user } = useAuth() as any;

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const sessionToken = localStorage.getItem("token");

    // prevent infinite loop: only redirect if you're NOT already on "/"
    if (!role || !sessionToken) {
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    } else {
      setUserRole(role);
      setToken(sessionToken);
    }
  }, []); // ✅ remove [router]

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student_id");
    localStorage.removeItem("user_role");
    if (logout) logout();
    window.location.replace("/");
  };

  // ✅ Conditional rendering AFTER all hooks
  const hideSidebar =
    pathname === "/" || pathname === "/login" || pathname === "/admin/login";
  if (hideSidebar) {
    return null;
  }
  // ✅ Modified part: show parentItems if parent, teacherItems if teacher
  let sidebarLinks: any[] = [];
  if (userRole?.toLowerCase() === "parent") {
    sidebarLinks = parentItems;
  } else if (userRole?.toLowerCase() === "teacher") {
    sidebarLinks = teacherItems;
  } else {
    sidebarLinks = adminItems; // no links if role not found
  }

  return (
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50">
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src="/school-logo.jpg"
            alt="School Logo"
            width={40}
            height={40}
            className="object-contain rounded"
          />
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            SMV Highschool
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {token && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage
                      src={user?.avatarUrl || "/user-avtar.png"}
                      alt="User"
                    />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userRole || "No role"}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-800 dark:text-slate-200"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ===== SIDEBAR ===== */}
      <aside
        onMouseEnter={() => setIsHoverOpen(true)}
        onMouseLeave={() => setIsHoverOpen(false)}
        className={`fixed top-16 left-0 h-180 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-md flex flex-col transition-all duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0 w-72" : "-translate-x-full"}
        lg:translate-x-0 ${isHoverOpen ? "lg:w-70" : "lg:w-20"}`}
      >
        <nav className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.title}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                    : "text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <link.icon
                  className={`flex-shrink-0 transition-all duration-300 ${
                    isHoverOpen || isOpen ? "h-6 w-6" : "h-6 w-6 mx-auto"
                  }`}
                />
                {(isHoverOpen || isOpen) && (
                  <span className="ml-4 whitespace-nowrap">{link.title}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}

// ---------------- NAVBAR ----------------
function Navbar({}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  const { logout, user } = useAuth() as any;
  const { theme, setTheme } = useTheme();
  const [userRole, setUserRole] = useState<string | null>(null);

  // --- Get token from cookies ---
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const sessionToken = localStorage.getItem("token");

    // prevent infinite loop: only redirect if you're NOT already on "/"
    if (!role || !sessionToken) {
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    } else {
      setUserRole(role);
      setToken(sessionToken);
    }
  }, []); // ✅ remove [router]

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student_id");
    localStorage.removeItem("user_role");
    if (logout) logout();
    window.location.replace("/");
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header className="hidden lg:flex fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 items-center justify-between px-6 shadow-md z-40">
      {/* --- Left: Logo --- */}
      <Link href="/home" className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src="/school-logo.jpg"
            alt="Logo"
            fill
            className="object-contain rounded-md"
          />
        </div>
        <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">
          S.M.V High School
        </span>
      </Link>

      {/* --- Right: Controls --- */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* --- Profile Dropdown --- */}
        {token && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={user?.avatarUrl || "/user-avtar.png"}
                    alt="User"
                  />
                  <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userRole || "No role"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Section */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar - fixed at top */}
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <main
          className={`
            flex-1 overflow-y-auto p-4 sm:p-6 mt-16
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "lg:ml-72" : "lg:ml-20"}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
