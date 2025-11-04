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

    const endpoint = role === "admin" ? "/login_school" : "/login_school";
    const payload = {
      email,
      password,
      role,
      schoolId: selectedSchool,
    };

    try {
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload, {
        withCredentials: true,
      });

      const userRole =
        response.data?.admin?.role || response.data?.college?.role;
      const token = response.data?.token;
      if (userRole && token) {
        localStorage.setItem("user_role", userRole);
        localStorage.setItem("token", token); // ✅ Store token in localStorage
        toast.success("Login successful!");

        const redirectUrl = userRole === "admin" ? "/admin-dashboard" : "/home";

        // ✅ Give localStorage time to persist before redirecting
        setTimeout(() => {
          window.location.replace(redirectUrl); // use replace to avoid back-button loop
        }, 300);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Welcome
          </CardTitle>
          <CardDescription className="pt-2 text-gray-600 dark:text-gray-400">
            Please log in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* --- School Dropdown --- */}
            <div className="space-y-2">
              <Label
                htmlFor="school-select"
                className="text-gray-700 dark:text-gray-300"
              >
                Select Your School
              </Label>
              <Select
                onValueChange={setSelectedSchool}
                value={selectedSchool}
                disabled={isFetchingSchools}
              >
                <SelectTrigger
                  id="school-select"
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                >
                  <SelectValue
                    placeholder={
                      isFetchingSchools
                        ? "Loading schools..."
                        : "Select your school..."
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={String(college.id)}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* --- Role Dropdown --- */}
            <div className="space-y-2">
              <Label
                htmlFor="role-select"
                className="text-gray-700 dark:text-gray-300"
              >
                I am a
              </Label>
              <Select onValueChange={setRole} value={role}>
                <SelectTrigger
                  id="role-select"
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                >
                  <SelectValue placeholder="Select your role..." />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-700 dark:text-gray-300"
              >
                Email Address
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-300"
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
