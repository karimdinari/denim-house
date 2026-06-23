import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./api";
import { startOfWeek } from "./labels";

export const queryKeys = {
  me: ["auth", "me"] as const,
  users: ["users"] as const,
  userWorkload: (id: string) => ["users", id, "workload"] as const,
  tasks: (params?: Record<string, string>) => ["tasks", params ?? {}] as const,
  scoring: (taskId: string) => ["scoring", taskId] as const,
  alerts: ["alerts"] as const,
  notifications: ["notifications"] as const,
  unreadCount: ["notifications", "unread"] as const,
  planning: (weekStart: string) => ["planning", weekStart] as const,
  moodBoards: ["moodboards"] as const,
  moodBoard: (id: string) => ["moodboards", id] as const,
  prototypes: ["prototypes"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiClient.getUsers(),
  });
}

export function useUserWorkloads(userIds: string[]) {
  return useQuery({
    queryKey: ["users", "workloads", userIds],
    queryFn: async () => {
      const results = await Promise.all(
        userIds.map(async (id) => ({
          id,
          ...(await apiClient.getUserWorkload(id)),
        })),
      );
      return Object.fromEntries(results.map((r) => [r.id, r]));
    },
    enabled: userIds.length > 0,
  });
}

export function useTasks(params?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.tasks(params),
    queryFn: () => apiClient.getTasks(params),
  });
}

export function useScoring(taskId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.scoring(taskId ?? ""),
    queryFn: () => apiClient.getScoring(taskId!),
    enabled: !!taskId,
  });
}

export function useAssignTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) =>
      apiClient.assignTask(taskId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["scoring"] });
    },
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: queryKeys.alerts,
    queryFn: () => apiClient.getAlerts(),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: () => apiClient.getUnreadCount(),
  });
}

export function usePlanning(weekStart = startOfWeek()) {
  return useQuery({
    queryKey: queryKeys.planning(weekStart),
    queryFn: () => apiClient.getPlanningWeek(weekStart),
  });
}

export function useMoodBoards() {
  return useQuery({
    queryKey: queryKeys.moodBoards,
    queryFn: () => apiClient.getMoodBoards(),
  });
}

export function usePrototypes() {
  return useQuery({
    queryKey: queryKeys.prototypes,
    queryFn: () => apiClient.getPrototypes(),
  });
}
