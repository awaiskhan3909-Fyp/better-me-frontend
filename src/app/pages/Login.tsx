import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Brain } from "lucide-react";
import { toast } from "sonner";
import logo from "../../imports/Better_me_Logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would authenticate with backend
    if (email && password) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-slate-50 to-secondary-lighter flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src={logo} alt="Better Me" className="h-12" />
        </Link>

        {/* Login Card */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to continue your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 rounded-lg"
                size="lg"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-500 mt-6 px-4">
          By signing in, you agree to our Terms of Service and Privacy Policy. Better me is a supportive tool and not a replacement for professional care.
        </p>
      </div>
    </div>
  );
}
