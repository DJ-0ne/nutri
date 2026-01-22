import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth First
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Register Chat Routes (AI Advisor)
  registerChatRoutes(app);

  // === API ROUTES ===

  // Middleware to ensure user is authenticated for API routes
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Profiles
  app.get(api.profiles.get.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub; // From Replit Auth
    const profile = await storage.getProfile(userId);
    res.json(profile || null);
  });

  app.post(api.profiles.update.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    try {
      const input = api.profiles.update.input.parse(req.body);
      const profile = await storage.upsertProfile(userId, input);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  app.post(api.profiles.upgrade.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    try {
      const { tier } = req.body;
      // In a real app, this would verify payment.
      // Here we just update the profile to 'premium'.
      const profile = await storage.upsertProfile(userId, { subscriptionTier: tier } as any);
      res.json(profile);
    } catch (err) {
      res.status(500).json({ message: "Upgrade failed" });
    }
  });

  // Foods
  app.get(api.foods.list.path, requireAuth, async (req, res) => {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const foods = await storage.getFoods(search, category);
    res.json(foods);
  });

  // Meal Logs
  app.get(api.mealLogs.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const dateStr = req.query.date as string | undefined;
    const date = dateStr ? new Date(dateStr) : undefined;
    const logs = await storage.getMealLogs(userId, date);
    res.json(logs);
  });

  app.post(api.mealLogs.create.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    try {
      const input = api.mealLogs.create.input.parse(req.body);
      const log = await storage.createMealLog({ ...input, userId });
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  app.delete(api.mealLogs.delete.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const id = parseInt(req.params.id);
    await storage.deleteMealLog(id, userId);
    res.status(204).send();
  });

  // Reminders
  app.get(api.reminders.list.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const reminders = await storage.getReminders(userId);
    res.json(reminders);
  });

  app.post(api.reminders.create.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    try {
      const input = api.reminders.create.input.parse(req.body);
      const reminder = await storage.createReminder({ ...input, userId });
      res.status(201).json(reminder);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.put(api.reminders.update.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const id = parseInt(req.params.id);
    try {
      const input = api.reminders.update.input.parse(req.body);
      const reminder = await storage.updateReminder(id, userId, input);
      res.json(reminder);
    } catch (err) {
      res.status(400).json({ message: "Update failed" });
    }
  });
  
  app.delete(api.reminders.delete.path, requireAuth, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const id = parseInt(req.params.id);
    await storage.deleteReminder(id, userId);
    res.status(204).send();
  });

  // Seed Kenya Foods
  await seedKenyaFoods();

  return httpServer;
}

async function seedKenyaFoods() {
  const existing = await storage.getFoods();
  if (existing.length > 0) return;

  const kenyaFoods = [
    { name: "Ugali (Maize Meal)", category: "Cereals", calories: 365, protein: 7.0, carbs: 78.0, fat: 1.0, isKenyaSpecific: true },
    { name: "Sukuma Wiki (Collard Greens)", category: "Vegetables", calories: 32, protein: 3.0, carbs: 5.4, fat: 0.7, vitaminA: 500, iron: 1.5, isKenyaSpecific: true },
    { name: "Githeri (Maize & Beans)", category: "Mixed", calories: 150, protein: 6.0, carbs: 25.0, fat: 1.5, isKenyaSpecific: true },
    { name: "Chapati", category: "Cereals", calories: 297, protein: 8.0, carbs: 46.0, fat: 9.0, isKenyaSpecific: true },
    { name: "Nyama Choma (Roasted Goat)", category: "Meat", calories: 143, protein: 27.0, carbs: 0.0, fat: 3.0, isKenyaSpecific: true },
    { name: "Kachumbari", category: "Vegetables", calories: 45, protein: 1.0, carbs: 10.0, fat: 0.2, isKenyaSpecific: true },
    { name: "Matoke (Green Bananas)", category: "Fruits/Starch", calories: 122, protein: 1.3, carbs: 31.0, fat: 0.3, isKenyaSpecific: true },
    { name: "Chai (Tea with Milk)", category: "Beverages", calories: 60, protein: 3.0, carbs: 5.0, fat: 3.0, isKenyaSpecific: true },
    { name: "Mandazi", category: "Snacks", calories: 300, protein: 5.0, carbs: 45.0, fat: 10.0, isKenyaSpecific: true },
    { name: "Mukimo", category: "Mixed", calories: 180, protein: 4.0, carbs: 35.0, fat: 2.0, isKenyaSpecific: true },
  ];

  for (const food of kenyaFoods) {
    await storage.createFood(food as any);
  }
}
