"use client";

import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

// Shadcn/ui Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// Type definition for the school/college data
type College = {
  id: number;
  name: string;
};

export default function UnifiedLoginPage() {
  // Renamed component for clarity
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [isFetchingSchools, setIsFetchingSchools] = useState(true);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Fetch Schools/Colleges on Load ---
  useEffect(() => {
    const fetchColleges = async () => {
      setIsFetchingSchools(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/add_school`);
        setColleges(res.data);
      } catch (error) {
        console.error("Failed to fetch colleges", error);
        toast.error("Could not fetch school list.");
      } finally {
        setIsFetchingSchools(false);
      }
    };

    fetchColleges();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // --- Added Validation for new fields ---
    if (!selectedSchool) {
      const msg = "Please select your school.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!role) {
      const msg = "Please select your role.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);

    // --- Dynamic Endpoint and Payload ---
    const endpoint = role === "admin" ? "/login_school" : "/login_school";
    const payload = {
      email,
      password,
      role,
      schoolId: selectedSchool, // Send the school ID
    };

    try {
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload, {
        withCredentials: true,
      });

      // --- Handle response from either admin or school login ---
      const userRole =
        response.data?.admin?.role || response.data?.college?.role;

      if (userRole) {
        localStorage.setItem("user_role", userRole);
        toast.success("Login successful!");

        // --- Dynamic Redirect ---
        const redirectUrl = userRole === "admin" ? "/admin-dashboard" : "/home";
        window.location.href = redirectUrl;
      } else {
        const msg = "Login successful, but no role returned from server.";
        toast.error(msg);
        setError(msg);
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMsg = err.response.data.error || "Login failed.";
        toast.error(errorMsg);
        setError(errorMsg);
      } else {
        const errorMsg = "An error occurred. Please try again.";
        toast.error(errorMsg);
        setError(errorMsg);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Welcome</CardTitle>
          <CardDescription className="pt-2">
            Please log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* --- ADDED: School Dropdown --- */}
            <div className="space-y-2">
              <Label htmlFor="school-select">Select Your School</Label>
              <Select
                onValueChange={setSelectedSchool}
                value={selectedSchool}
                disabled={isFetchingSchools}
              >
                <SelectTrigger id="school-select" className="w-full">
                  <SelectValue
                    placeholder={
                      isFetchingSchools
                        ? "Loading schools..."
                        : "Select your school..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={String(college.id)}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* --- ADDED: Role Dropdown --- */}
            <div className="space-y-2">
              <Label htmlFor="role-select">I am a</Label>
              <Select onValueChange={setRole} value={role}>
                <SelectTrigger id="role-select" className="w-full">
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isFetchingSchools}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
