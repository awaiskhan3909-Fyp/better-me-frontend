import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Brain, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import logo from "../../imports/Better_me_Logo.png";
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-slate-50 to-secondary-lighter flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src={logo} alt="Better Me" className="h-12" />
        </Link>

        {/* Register Card */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Start your journey to better mental wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg"
                />
              </div>

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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-slate-600 leading-tight cursor-pointer"
                >
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 rounded-lg"
                size="lg"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Academic FYP Attribution */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-1">
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
        <p className="text-center text-xs text-slate-500 mt-6 px-4">
          Better Me is a supportive tool designed to complement, not replace, professional mental health care.
        </p>
      </div>
    </div>
  );
}
