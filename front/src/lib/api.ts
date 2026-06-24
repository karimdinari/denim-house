const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const TOKEN_KEY = "sartex_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? res.statusText, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  login: (email: string, password: string) =>
    api<{ user: import("./types").User; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => api<import("./types").User>("/api/auth/me"),

  getUsers: () => api<import("./types").User[]>("/api/users"),

  getUserWorkload: (id: string) =>
    api<import("./types").Workload>(`/api/users/${id}/workload`),

  getTasks: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params)}` : "";
    return api<import("./types").Task[]>(`/api/tasks${qs}`);
  },

  getMyTasks: () => api<import("./types").Task[]>("/api/tasks/my"),

  assignTask: (taskId: string, userId: string) =>
    api<import("./types").Task>(`/api/tasks/${taskId}/assign`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  getScoring: (taskId: string) =>
    api<import("./types").ScoringResult>(`/api/scoring/tasks/${taskId}/candidates`),

  getAlerts: () => api<import("./types").Alert[]>("/api/alerts"),

  detectBottlenecks: () =>
    api<{ created: number }>("/api/alerts/detect/bottlenecks", { method: "POST" }),

  getNotifications: () => api<import("./types").Notification[]>("/api/notifications"),

  getUnreadCount: () => api<{ count: number }>("/api/notifications/unread-count"),

  getPlanningWeek: (weekStart: string) =>
    api<import("./types").PlanningBlock[]>(
      `/api/planning/week/all?weekStart=${weekStart}`,
    ),

  getMoodBoards: () => api<import("./types").MoodBoard[]>("/api/moodboards"),

  getMoodBoard: (id: string) =>
    api<import("./types").MoodBoard>(`/api/moodboards/${id}`),

  getPrototypes: () => api<import("./types").Prototype[]>("/api/prototypes"),

  getPrototypeProgress: (id: string) =>
    api<import("./types").Prototype & { progress: number; totalPhases: number }>(
      `/api/prototypes/${id}/progress`,
    ),
};
