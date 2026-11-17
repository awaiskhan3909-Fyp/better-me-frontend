import { getApiBaseUrl, getCurrentUser } from "../../lib/apiClient";
import {
  AdminOverviewResponse,
  AdminUserItem,
  AdminSafetyResponse,
  AdminDistortionsResponse,
  AdminSessionsFunnelResponse,
  AdminAIOpsResponse,
  AdminEngagementResponse,
  AdminSystemResponse,
} from "./types";

function getAdminHeaders(): HeadersInit {
  const user = getCurrentUser();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (user?.id) {
    headers["X-User-Id"] = user.id;
  }

  // Support local development / testing admin bypass key if provided
  const customKey = localStorage.getItem("better_me_admin_key");
  if (customKey) {
    headers["X-Admin-Key"] = customKey;
  }

  return headers;
}

export async function fetchAdminOverview(days: number = 30): Promise<AdminOverviewResponse> {
  const response = await fetch(`${getApiBaseUrl()}/admin/overview?days=${days}`, {
    headers: getAdminHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch admin overview" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchAdminUsers(days: number = 30, limit: number = 100): Promise<AdminUserItem[]> {
  const response = await fetch(`${getApiBaseUrl()}/admin/users?days=${days}&limit=${limit}`, {
    headers: getAdminHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch admin users" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchAdminSafety(days: number = 30): Promise<AdminSafetyResponse> {
  const response = await fetch(`${getApiBaseUrl()}/admin/safety?days=${days}`, {
    headers: getAdminHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch safety analytics" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchAdminDistortions(days: number = 30): Promise<AdminDistortionsResponse> {
  const response = await fetch(`${getApiBaseUrl()}/admin/distortions?days=${days}`, {
    headers: getAdminHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch distortion analytics" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchAdminSessionsFunnel(days: number = 30): Promise<AdminSessionsFunnelResponse> {
  const response = await fetch(`${getApiBaseUrl()}/admin/sessions-funnel?days=${days}`, {
    headers: getAdminHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch sessions funnel" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchAdminAIOps(days: number = 30): Promise<AdminAIOpsResponse> {
  const response = await fetch(`${getApiBaseUrl()}/admin/ai-ops?days=${days}`, {
    headers: getAdminHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch AI operations telemetry" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchAdminEngagement(days: number = 30): Promise<AdminEngagementResponse> {
  const response = await fetch(`${getApiBaseUrl()}/admin/engagement?days=${days}`, {
    headers: getAdminHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch engagement analytics" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchAdminSystem(): Promise<AdminSystemResponse> {
  const response = await fetch(`${getApiBaseUrl()}/admin/system`, {
    headers: getAdminHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Failed to fetch system operations status" }));
    throw new Error(errorData.detail || `Server responded with status ${response.status}`);
  }
  return response.json();
}
