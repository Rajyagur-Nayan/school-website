"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Shadcn/ui Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [isRegisterView, setIsRegisterView] = useState(false);

  // --- Login Form State ---
  const [loginGrNo, setLoginGrNo] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // --- Register Form State ---
  const [registerGrNo, setRegisterGrNo] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  // ✅ --- AUTO LOGIN (VERIFY SESSION COOKIE) ---
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/verify-session`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          // Store role if returned by backend, or fallback to parent
          localStorage.setItem("user_role", data.user?.role || "parent");
          toast.success("Session restored! Redirecting...");
          router.push("/school-info");
        }
      } catch (err) {
        console.warn("Session verification failed:", err);
      }
    };

    verifySession();
  }, [router]);

  // --- Login Form Submit Handler ---
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoginLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/login`,
        {
          grNo: loginGrNo,
          password: loginPassword,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("user_role", "parent");
        toast.success("Login successful! Redirecting...");
        router.push("/school-info");
      } else {
        const msg =
          "Login successful, but server returned an unexpected status.";
        toast.error(msg);
        setLoginError(msg);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        "Login failed. Please check your credentials.";
      toast.error(errorMsg);
      setLoginError(errorMsg);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // --- Register Form Submit Handler ---
  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      const msg = "Passwords do not match.";
      toast.error(msg);
      setRegisterError(msg);
      return;
    }

    setRegisterError("");
    setIsRegisterLoading(true);

    try {
      await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          grNo: registerGrNo,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      toast.success("Registration successful! Please log in.");
      setRegisterGrNo("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setIsRegisterView(false);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMsg);
      setRegisterError(errorMsg);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // --- JSX (unchanged) ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 transition-colors p-4">
      <div className="w-full max-w-md overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: isRegisterView ? "translateX(-100%)" : "translateX(0%)",
          }}
        >
          {/* --- LOGIN FORM (Slide 1) --- */}
          <div className="w-full flex-shrink-0">
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold">
                  Welcome Back
                </CardTitle>
                <CardDescription className="pt-2">
                  Please log in to continue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleLoginSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="login-grNo">GR No.</Label>
                    <Input
                      type="text"
                      id="login-grNo"
                      value={loginGrNo}
                      onChange={(e) => setLoginGrNo(e.target.value)}
                      placeholder="Enter your GR No."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      type="password"
                      id="login-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="text-right">
                    <Link
                      href=""
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  {loginError && (
                    <p className="text-sm text-red-600 text-center">
                      {loginError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "Logging in..." : "Log In"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex-col items-center justify-center space-y-3 text-sm">
                <p className="text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegisterView(true)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Sign Up Here
                  </button>
                </p>
                <p className="text-gray-600">
                  Are you an admin?{" "}
                  <Link
                    href="/admin/login"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Login as Admin
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* --- REGISTER FORM (Slide 2) --- */}
          <div className="w-full flex-shrink-0">
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold">
                  Create Account
                </CardTitle>
                <CardDescription className="pt-2">
                  Sign up as a new parent.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="reg-grNo">GR No.</Label>
                    <Input
                      type="text"
                      id="reg-grNo"
                      value={registerGrNo}
                      onChange={(e) => setRegisterGrNo(e.target.value)}
                      placeholder="Enter your GR No."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email Address</Label>
                    <Input
                      type="email"
                      id="reg-email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <Input
                      type="password"
                      id="reg-password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm-password">
                      Confirm Password
                    </Label>
                    <Input
                      type="password"
                      id="reg-confirm-password"
                      value={registerConfirmPassword}
                      onChange={(e) =>
                        setRegisterConfirmPassword(e.target.value)
                      }
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {registerError && (
                    <p className="text-sm text-red-600 text-center">
                      {registerError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex justify-center">
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegisterView(false)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Log In
                  </button>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
