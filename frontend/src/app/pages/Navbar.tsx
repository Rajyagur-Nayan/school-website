"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut, Sun, Moon, User } from "lucide-react";
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

import { useTheme } from "next-themes";
import { useAuth } from "./auth/AuthContext";
// --- Removed LoginDialog and RegisterDialog imports ---

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth() as any;
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  usePathname();

  // --- Removed state for dialogs ---

  const [userRole, setUserRole] = useState<string | null>(null);
  const [teacherToken, setTeacherToken] = useState<string | null>(null);

  // Function to check auth state
  const checkTeacherAuth = () => {
    const role = localStorage.getItem("user_role");
    const token = Cookies.get("token");
    setUserRole(role);
    setTeacherToken(token || null);
  };

  // Use useEffect to check auth on initial load
  useEffect(() => {
    checkTeacherAuth();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // --- Unified logout function (No Change) ---
  const handleUnifiedLogout = () => {
    logout();
    Cookies.remove("token");
    Cookies.remove("student_id");
    localStorage.removeItem("user_role");
    setUserRole(null);
    setTeacherToken(null);
    router.push("/");
  };

  const UserNav = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="Open user menu"
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleUnifiedLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const TeacherNav = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="Open teacher menu"
        >
          <Avatar className="h-10 w-10 border bg-muted">
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <p className="text-sm font-medium leading-none">
            {userRole
              ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
              : "Staff"}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleUnifiedLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10">
              <Image
                src="/school-logo.jpg"
                alt="School Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <Link
              href={userRole === "teacher" && teacherToken ? "/home" : "/home"}
              className="hidden font-bold sm:inline-block"
            >
              S.M.V High School
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* --- Display logic (No Change) --- */}
            {isAuthenticated && userRole == "teacher" ? (
              <UserNav />
            ) : (
              <TeacherNav />
            )}
          </div>
        </div>
      </header>
    </>
  );
}
