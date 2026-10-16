import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Brain, Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AuthLogo from "../components/AuthLogo";
import { loginUser, setCurrentUser } from "../services/apiService";
import { supabase } from "../services/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Check if Supabase requires email verification
      try {
        const { error: supaErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (supaErr && supaErr.message.toLowerCase().includes("email not confirmed")) {
          toast.info("Please enter your 6-digit verification code to activate your account.");
          navigate(`/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
          return;
        }
      } catch (e) {
        // Supabase check is optional if backend handles auth
        console.warn("Supabase auth pre-check notice:", e);
      }

      // 2. Authenticate against FastAPI backend with hashed password verification
      const res = await loginUser(cleanEmail, password);
      toast.success(`Welcome back, ${res.user.full_name || "Friend"}!`);
      if (!res.user.has_completed_intake) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login verification error:", err);
      const errMsg = err?.message || "";
      if (errMsg.toLowerCase().includes("invalid") || errMsg.toLowerCase().includes("password") || errMsg.includes("401")) {
        toast.error("Invalid email or password. Please check your credentials or create an account.");
      } else {
        toast.error(errMsg || "Could not log in. Please ensure the backend server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // Attempt backend login for verified demo user
      const res = await loginUser("demo_user@betterme.app", "demo_password_123");
      toast.success(`Signed in as Demo User (${res.user.full_name || "Demo"})`);
      navigate("/dashboard");
    } catch (err: any) {
      // Fallback demo user with standard UUID for offline presentation
      setCurrentUser({
        id: "00000000-0000-0000-0000-000000000001",
        email: "demo_user@betterme.app",
        full_name: "Demo Patient",
        is_active: true,
        has_completed_intake: true,
        created_at: new Date().toISOString(),
      });
      toast.info("Signed in as Demo User (Offline Mode)");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-100 flex items-center justify-center p-4 sm:p-6">
      {/* Ambient Floating Gradient Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 via-sky-300/20 to-transparent blur-3xl pointer-events-none animate-blob-1" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-secondary/20 via-indigo-200/20 to-transparent blur-3xl pointer-events-none animate-blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-primary/5 to-transparent blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Animated Floating Logo */}
        <AuthLogo subtitle="AI Cognitive Therapy" />

        {/* Glassmorphic Login Card */}
        <Card className="border border-white/80 shadow-2xl shadow-slate-300/50 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300">
          {/* Top Gradient Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary-light" />

          <CardHeader className="space-y-1.5 text-center pt-7 pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-500 font-['Inter'] text-sm">
              Sign in to continue your mental wellbeing journey
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-7 px-6 sm:px-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 font-medium text-sm">Email Address</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl h-11 border-slate-200 bg-white/70 focus:bg-white transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:text-primary-dark font-medium hover:underline transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 rounded-xl h-11 border-slate-200 bg-white/70 focus:bg-white transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl shadow-lg shadow-primary/25 h-11 text-base font-medium mt-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/90 px-2 text-slate-400 font-medium">Or demo testing</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleDemoLogin}
                className="w-full border-primary/30 text-primary hover:bg-primary/5 rounded-xl h-10 text-sm font-medium transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Quick Demo Sign-In
              </Button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:text-primary-dark font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            {/* Academic FYP Attribution Capsule */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-1 bg-slate-50/70 rounded-2xl p-3 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                🎓 BS Final Year Project (FYP)
              </p>
              <p className="text-xs text-slate-700 font-medium">
                <strong>Team:</strong> Awais Khan • Saad Abdullah • Ajiya Asif
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Supervisor:</strong> Mam Farnaz Akbar
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-500 mt-5 px-4 leading-relaxed">
          By signing in, you agree to our Terms of Service and Privacy Policy. Better Me is a supportive CBT tool.
        </p>
      </div>
    </div>
  );
}
