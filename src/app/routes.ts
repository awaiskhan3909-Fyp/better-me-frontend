import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChatTherapy from "./pages/ChatTherapy";
import Progress from "./pages/Progress";
import OnboardingAssessment from "./pages/OnboardingAssessment";

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
]);
