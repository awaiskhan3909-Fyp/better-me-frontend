import { createBrowserRouter, Navigate } from "react-router";
import Landing from "../features/landing/Landing";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../features/dashboard/Dashboard";
import ChatTherapy from "../features/chat/ChatTherapy";
import Progress from "../features/progress/Progress";
import OnboardingAssessment from "../features/onboarding/OnboardingAssessment";
import VerifyOtp from "../features/auth/VerifyOtp";
import PracticeHub from "../features/practice/PracticeHub";
import ForgotPassword from "../features/auth/ForgotPassword";
import ResetPassword from "../features/auth/ResetPassword";
import DesignSystemPage from "../features/design-system/DesignSystemPage";
import AdminOverviewPage from "../features/admin/pages/AdminOverviewPage";
import AdminUsersPage from "../features/admin/pages/AdminUsersPage";
import AdminSafetyPage from "../features/admin/pages/AdminSafetyPage";
import AdminDistortionsPage from "../features/admin/pages/AdminDistortionsPage";
import AdminSessionsFunnelPage from "../features/admin/pages/AdminSessionsFunnelPage";
import AdminAIOpsPage from "../features/admin/pages/AdminAIOpsPage";
import AdminEngagementPage from "../features/admin/pages/AdminEngagementPage";
import AdminSystemPage from "../features/admin/pages/AdminSystemPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  ...(import.meta.env.DEV
    ? [
        {
          path: "/design-system",
          Component: DesignSystemPage,
        },
      ]
    : [
        {
          path: "/design-system",
          Component: () => <Navigate to="/" replace />,
        },
      ]),
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
    path: "/practice",
    Component: PracticeHub,
  },
  {
    path: "/admin",
    Component: AdminOverviewPage,
  },
  {
    path: "/admin/overview",
    Component: AdminOverviewPage,
  },
  {
    path: "/admin/users",
    Component: AdminUsersPage,
  },
  {
    path: "/admin/safety",
    Component: AdminSafetyPage,
  },
  {
    path: "/admin/distortions",
    Component: AdminDistortionsPage,
  },
  {
    path: "/admin/sessions-funnel",
    Component: AdminSessionsFunnelPage,
  },
  {
    path: "/admin/ai-ops",
    Component: AdminAIOpsPage,
  },
  {
    path: "/admin/engagement",
    Component: AdminEngagementPage,
  },
  {
    path: "/admin/system",
    Component: AdminSystemPage,
  },
  {
    path: "/thought-records",
    Component: () => <Navigate to="/practice?tab=exercises" replace />,
  },
  {
    path: "/stress-relief",
    Component: () => <Navigate to="/practice?tab=relief" replace />,
  },
]);
