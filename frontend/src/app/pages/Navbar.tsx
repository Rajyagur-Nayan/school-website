"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
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

export function Navbar() {
  const { logout, user } = useAuth() as any;
  const router = useRouter();

  // Unified logout handler: call auth logout then navigate to home
  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      // ensure any client side tokens/localStorage cleared by auth or here if needed
      // localStorage.clear(); // <-- don't clear everything unless you want to
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center space-x-4">
          <div className="relative w-10 h-10">
            <Image
              src="/school-logo.jpg"
              alt="School Logo"
              fill
              className="object-contain"
            />
          </div>
          <Link href="/home" className="hidden font-bold sm:inline-block">
            S.M.V High School
          </Link>
        </div>

        {/* Right: Theme toggle + Profile dialog (single) */}
        <div className="flex items-center space-x-2">
          {/* Profile dialog: shown regardless of role/token.
              It will display user's name/email if available from useAuth(). */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                aria-label="Open profile menu"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={user?.avatarUrl || "/user-avtar.png"}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {(user?.name || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  {user?.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => {
                  // Replace with actual profile page route if you have one
                  router.push("/profile");
                }}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
