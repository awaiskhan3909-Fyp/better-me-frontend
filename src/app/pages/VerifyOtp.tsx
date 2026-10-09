import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";
import { toast } from "sonner";
import { Brain, ArrowLeft, MailCheck, ShieldCheck, RefreshCw } from "lucide-react";
import logo from "../../imports/Better_me_Logo.png";
import { supabase } from "../services/supabaseClient";
import { setCurrentUser } from "../services/apiService";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    if (!email) {
      toast.info("Please enter your email to verify");
    }
  }, [email]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setVerifying(true);
    try {
      // 1. Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: "signup",
      });

      if (error) {
        // Try fallback with type: 'email' (for sign in / magic link)
        const { data: fallbackData, error: fallbackError } = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: otp.trim(),
          type: "email",
        });

        if (fallbackError) {
          throw error;
        }

        if (fallbackData?.user) {
          setCurrentUser({
            id: fallbackData.user.id,
            email: fallbackData.user.email || email,
            full_name: fallbackData.user.user_metadata?.full_name || email.split("@")[0],
            is_active: true,
            has_completed_intake: false,
            created_at: new Date().toISOString(),
          });
        }
      } else if (data?.user) {
        setCurrentUser({
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split("@")[0],
          is_active: true,
          has_completed_intake: false,
          created_at: new Date().toISOString(),
        });
      }

      toast.success("Email verified successfully! Welcome to Better Me.");
      // Redirect to Initial Therapy Intake Assessment
      navigate("/onboarding");
    } catch (err: any) {
      console.error("OTP verification error:", err);
      toast.error(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please provide your email address");
      return;
    }

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
      });

      if (error) {
        throw error;
      }

      toast.success("A fresh 6-digit code has been sent to your email!");
      setResendCooldown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
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

        {/* Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <MailCheck className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Enter Verification Code</CardTitle>
            <CardDescription className="text-slate-600 font-['Inter'] mt-1">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-slate-800 break-all">{email || "your email"}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-6 space-y-6">
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* 6-Digit OTP Input */}
              <div className="flex flex-col items-center justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => {
                    setOtp(val);
                    if (val.length === 6) {
                      // Auto submit when 6 digits filled
                      setTimeout(() => handleVerifyOtp(), 100);
                    }
                  }}
                  autoFocus
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-11 h-12 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                    <InputOTPSlot index={1} className="w-11 h-12 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                    <InputOTPSlot index={2} className="w-11 h-12 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                    <InputOTPSlot index={3} className="w-11 h-12 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                    <InputOTPSlot index={4} className="w-11 h-12 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                    <InputOTPSlot index={5} className="w-11 h-12 text-lg font-bold rounded-xl border-2 border-slate-200 focus:border-primary" />
                  </InputOTPGroup>
                </InputOTP>
                <p className="text-xs text-slate-400 mt-2">Enter the 6 numbers from your email</p>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={otp.length !== 6 || verifying}
                className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/25 h-11 text-base font-medium"
              >
                {verifying ? "Verifying..." : "Verify & Continue"}
              </Button>
            </form>

            {/* Resend Code Section */}
            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2 font-['Inter']">Didn't receive the code?</p>
              {resendCooldown > 0 ? (
                <span className="text-xs font-semibold text-slate-400">
                  Resend code in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                  {resending ? "Sending..." : "Resend 6-Digit Code"}
                </button>
              )}
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 border-t border-slate-100 py-3.5 px-6 flex justify-center">
            <Link to="/register" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to registration
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
