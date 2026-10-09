import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatTherapy from "./pages/ChatTherapy";
import Progress from "./pages/Progress";
import OnboardingAssessment from "./pages/OnboardingAssessment";
import VerifyOtp from "./pages/VerifyOtp";
import ThoughtRecords from "./pages/ThoughtRecords";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/verify-otp",
    Component: VerifyOtp,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/reset-password",
    Component: ResetPassword,
  },
  {
    path: "/onboarding",
    Component: OnboardingAssessment,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/chat",
    Component: ChatTherapy,
  },
  {
    path: "/progress",
    Component: Progress,
  },
  {
    path: "/thought-records",
    Component: ThoughtRecords,
  },
]);
