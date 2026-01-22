import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertProfile, type InsertMealLog, type InsertReminder, type InsertFood } from "@shared/schema";

// === PROFILES ===
export function useProfile() {
  return useQuery({
    queryKey: [api.profiles.get.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.get.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profiles.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProfile) => {
      const res = await fetch(api.profiles.update.path, {
        method: api.profiles.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return api.profiles.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.profiles.get.path] }),
  });
}

export function useUpgradeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tier: 'free' | 'premium') => {
      const res = await fetch(api.profiles.upgrade.path, {
        method: api.profiles.upgrade.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upgrade profile");
      return api.profiles.upgrade.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.profiles.get.path] }),
  });
}

// === FOODS ===
export function useFoods(search?: string, category?: string) {
  return useQuery({
    queryKey: [api.foods.list.path, search, category],
    queryFn: async () => {
      const url = new URL(window.location.origin + api.foods.list.path);
      if (search) url.searchParams.set("search", search);
      if (category) url.searchParams.set("category", category);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch foods");
      return api.foods.list.responses[200].parse(await res.json());
    },
  });
}

// === MEAL LOGS ===
export function useMealLogs(date?: string) {
  return useQuery({
    queryKey: [api.mealLogs.list.path, date],
    queryFn: async () => {
      const url = new URL(window.location.origin + api.mealLogs.list.path);
      if (date) url.searchParams.set("date", date);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch meal logs");
      return api.mealLogs.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMealLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMealLog) => {
      // Ensure numeric fields are numbers, not strings from form inputs
      const validated = {
        ...data,
        totalCalories: Number(data.totalCalories)
      };
      
      const res = await fetch(api.mealLogs.create.path, {
        method: api.mealLogs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log meal");
      return api.mealLogs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.mealLogs.list.path] }),
  });
}

export function useDeleteMealLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.mealLogs.delete.path, { id });
      const res = await fetch(url, { 
        method: api.mealLogs.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete meal log");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.mealLogs.list.path] }),
  });
}

// === REMINDERS ===
export function useReminders() {
  return useQuery({
    queryKey: [api.reminders.list.path],
    queryFn: async () => {
      const res = await fetch(api.reminders.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reminders");
      return api.reminders.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertReminder) => {
      const res = await fetch(api.reminders.create.path, {
        method: api.reminders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create reminder");
      return api.reminders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.reminders.list.path] }),
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.reminders.delete.path, { id });
      const res = await fetch(url, { 
        method: api.reminders.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete reminder");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.reminders.list.path] }),
  });
}
