import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { toast } from "sonner";
import { Lock, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import AuthLogo from "../components/AuthLogo";
import { supabase } from "../services/supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // 1. Listen for auth state changes (e.g., PASSWORD_RECOVERY event)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setSessionReady(true);
      }
      setCheckingSession(false);
    });

    // 2. Check current session in case already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
      setCheckingSession(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      toast.success("Password reset successfully! Please sign in with your new password.");
      // Sign out recovery session to require fresh login
      await supabase.auth.signOut();
      navigate("/login");
    } catch (err: any) {
      console.error("Error setting new password:", err);
      toast.error(err.message || "Failed to update password. Recovery link may have expired.");
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
        <AuthLogo subtitle="Choose New Password" />

        {/* Card */}
        <Card className="border border-white/80 shadow-2xl shadow-slate-300/50 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-300">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary-light" />
          <CardHeader className="text-center pt-6 pb-2">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">Choose New Password</CardTitle>
            <CardDescription className="text-slate-600 font-['Inter'] mt-1 text-sm">
              Create a secure password for your Better Me account
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-6">
            {checkingSession ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                Verifying recovery session...
              </div>
            ) : !sessionReady ? (
              <div className="space-y-4 text-center py-4">
                <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-600 mb-1">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-600">
                  No active recovery session was detected. Your reset link may have expired or been used already.
                </p>
                <Button
                  onClick={() => navigate("/forgot-password")}
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl"
                >
                  Request a New Reset Code
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-700 font-medium">New Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9 pr-10 rounded-xl h-11 border-slate-200"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 pr-10 rounded-xl h-11 border-slate-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !newPassword}
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/25 h-11 text-base font-medium mt-2"
                >
                  {loading ? "Updating Password..." : "Set New Password"}
                </Button>
              </form>
            )}

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

          <CardFooter className="bg-slate-50 border-t border-slate-100 py-3.5 px-6 flex justify-center">
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
