import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Brain, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import AuthLogo from "../components/AuthLogo";
import { registerUser, setCurrentUser } from "../services/apiService";
import { supabase } from "../services/supabaseClient";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      // 1. Trigger Supabase Auth to send 6-digit confirmation code / OTP to email
      const { data: supaData, error: supaError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
          },
        },
      });

      if (supaError) {
        console.warn("Supabase SignUp notice:", supaError.message);
        if (supaError.message.toLowerCase().includes("already registered")) {
          toast.info("An account with this email already exists. Please verify your OTP.");
          navigate(`/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
          return;
        }
      }

      // 2. Also register in FastAPI backend
      try {
        await registerUser(cleanEmail, password, cleanName);
      } catch (backendErr) {
        console.warn("FastAPI backend register:", backendErr);
      }

      // 3. Cache user session
      const userId = supaData?.user?.id || "user-" + Date.now();
      setCurrentUser({
        id: userId,
        email: cleanEmail,
        full_name: cleanName,
        is_active: true,
        has_completed_intake: false,
        created_at: new Date().toISOString(),
      });

      toast.success("Account created! We've sent a 6-digit verification code to your email.");
      // 4. Navigate directly to OTP verification screen
      navigate(`/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.message || "Failed to create account. Please try again.");
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
        <AuthLogo subtitle="Begin Your Therapy Journey" />

        {/* Glassmorphic Register Card */}
        <Card className="border border-white/80 shadow-2xl shadow-slate-300/50 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300">
          {/* Top Gradient Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary-light" />

          <CardHeader className="space-y-1.5 text-center pt-7 pb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-500 font-['Inter'] text-sm">
              Start your personalized journey to better mental wellbeing
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-7 px-6 sm:px-8">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-700 font-medium text-sm">Full Name</Label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 rounded-xl h-11 border-slate-200 bg-white/70 focus:bg-white transition-all text-sm"
                    required
                  />
                </div>
              </div>

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
                <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Password</Label>
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
                <p className="text-[11px] text-slate-500">
                  Must be at least 6 characters
                </p>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-slate-600 leading-tight cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl shadow-lg shadow-primary/25 h-11 text-base font-medium mt-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary-dark font-semibold hover:underline">
                  Sign in
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
          Better Me is a supportive CBT clinical tool designed to complement mental health care.
        </p>
      </div>
    </div>
  );
}
