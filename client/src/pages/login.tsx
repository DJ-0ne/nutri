// Updated LoginPage.tsx (simple demo login with localStorage – no context, no useAuth)

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLocation } from "wouter"; // Only this from wouter
import { Mail, Lock, Loader2, Activity, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginForm = z.infer<typeof loginSchema>;

// DEMO CREDENTIALS
const DEMO_EMAIL = "test@example.com";
const DEMO_PASSWORD = "password123";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, navigate] = useLocation(); // Only navigate needed

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setErrorMessage(null);

    // DEMO MODE: Check credentials
    if (data.email === DEMO_EMAIL && data.password === DEMO_PASSWORD) {
      // Mock login success
      localStorage.setItem("isLoggedIn", "true"); // Simple flag
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard"); // Directly go to dashboard
      }, 800);
      return;
    }

    // If wrong credentials
    setErrorMessage("Invalid email or password");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="space-y-3 text-center pb-8 pt-10 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Nutri Coach AI</CardTitle>
            <CardDescription className="text-base">
              Log in to continue tracking your nutrition journey
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Demo mode:</strong> Use email <code className="bg-blue-100 px-1 rounded">test@example.com</code> and password <code className="bg-blue-100 px-1 rounded">password123</code> to log in and go to dashboard.
              </AlertDescription>
            </Alert>

            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    defaultValue={DEMO_EMAIL}
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    defaultValue={DEMO_PASSWORD}
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 pt-4 pb-10">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground px-8">
              By logging in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}