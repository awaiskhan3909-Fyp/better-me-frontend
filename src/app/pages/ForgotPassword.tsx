import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { toast } from "sonner";
import { KeyRound, ArrowLeft, Mail, Lock, RefreshCw, CheckCircle2, Eye, EyeOff } from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";
import { supabase } from "../services/supabaseClient";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Step 1: Send recovery email / OTP via Supabase
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your registered email address");
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        throw error;
      }

      toast.success("Reset instructions sent! Please check your email inbox.");
      setStep("verify");
      setResendCooldown(60);
    } catch (err: any) {
      console.error("Reset password request error:", err);
      toast.error(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Recovery OTP & Update Password in Supabase
  const handleResetWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Email is required");
      return;
    }

    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit recovery code");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP with recovery type
      const { data, error: otpError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: otp.trim(),
        type: "recovery",
      });

      if (otpError) {
        throw otpError;
      }

      // 2. Once verified, update the password for the active recovery session
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Password updated successfully! You can now sign in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Password reset error:", err);
      toast.error(err.message || "Invalid recovery code or expired session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend recovery email
  const handleResend = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setResending(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (error) {
        throw error;
      }

      toast.success("A fresh recovery code has been sent to your email!");
      setResendCooldown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend recovery code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-slate-50 to-secondary-lighter flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-6">
          <img src={logo} alt="Better Me" className="h-10" />
        </Link>

        {/* Reset Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {step === "request" ? "Reset Your Password" : "Set New Password"}
            </CardTitle>
            <CardDescription className="text-slate-600 font-['Inter'] mt-1">
              {step === "request"
                ? "Enter your email address and we'll send you a recovery code."
                : `Enter the 6-digit code sent to ${email} along with your new password.`}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-6">
            {step === "request" ? (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 rounded-xl h-11 border-slate-200"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/25 h-11 text-base font-medium mt-2"
                >
                  {loading ? "Sending Code..." : "Send Recovery Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetWithOtp} className="space-y-5">
                {/* 6-Digit OTP */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium block text-center">6-Digit Recovery Code</Label>
                  <div className="flex flex-col items-center justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(val) => setOtp(val)}
                      autoFocus
                    >
                      <InputOTPGroup className="gap-2">
                        <InputOTPSlot index={0} className="w-10 h-11 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                        <InputOTPSlot index={1} className="w-10 h-11 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                        <InputOTPSlot index={2} className="w-10 h-11 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                        <InputOTPSlot index={3} className="w-10 h-11 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                        <InputOTPSlot index={4} className="w-10 h-11 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                        <InputOTPSlot index={5} className="w-10 h-11 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {/* New Password */}
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

                {/* Confirm Password */}
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
                  disabled={loading || otp.length !== 6 || !newPassword}
                  className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/25 h-11 text-base font-medium"
                >
                  {loading ? "Updating Password..." : "Update Password"}
                </Button>

                {/* Resend Code Section */}
                <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="text-slate-500 hover:text-slate-800 underline"
                  >
                    Change email
                  </button>

                  {resendCooldown > 0 ? (
                    <span className="font-semibold text-slate-400">
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending}
                      className="font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                      {resending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>
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
