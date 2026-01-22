import { db } from "./db";
import { 
  users, profiles, foods, mealLogs, reminders,
  type User, type Profile, type Food, type MealLog, type Reminder,
  type InsertProfile, type InsertFood, type InsertMealLog, type InsertReminder
} from "@shared/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  upsertProfile(userId: string, profile: InsertProfile): Promise<Profile>;
  
  // Foods
  getFoods(search?: string, category?: string): Promise<Food[]>;
  createFood(food: InsertFood): Promise<Food>;
  
  // Meal Logs
  getMealLogs(userId: string, date?: Date): Promise<MealLog[]>;
  createMealLog(log: InsertMealLog): Promise<MealLog>;
  deleteMealLog(id: number, userId: string): Promise<void>;
  
  // Reminders
  getReminders(userId: string): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, userId: string, updates: Partial<InsertReminder>): Promise<Reminder>;
  deleteReminder(id: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async upsertProfile(userId: string, profileData: InsertProfile): Promise<Profile> {
    // Check if profile exists to decide update vs insert (or use onConflict)
    // profiles table doesn't have a unique constraint on userId in schema definition yet, 
    // but logic implies 1:1. Ideally schema should have unique(userId).
    // For now, I'll check existence.
    const existing = await this.getProfile(userId);
    if (existing) {
      const [updated] = await db.update(profiles)
        .set({ ...profileData, updatedAt: new Date() })
        .where(eq(profiles.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(profiles)
        .values({ ...profileData, userId })
        .returning();
      return created;
    }
  }

  // Foods
  async getFoods(search?: string, category?: string): Promise<Food[]> {
    let query = db.select().from(foods);
    
    // Simple in-memory filtering for MVP or basic SQL like
    // For robust search, we'd use ilike. Drizzle: ilike(foods.name, `%${search}%`)
    
    const results = await query;
    
    return results.filter(food => {
      const matchSearch = search ? food.name.toLowerCase().includes(search.toLowerCase()) : true;
      const matchCategory = category ? food.category === category : true;
      return matchSearch && matchCategory;
    });
  }

  async createFood(food: InsertFood): Promise<Food> {
    const [created] = await db.insert(foods).values(food).returning();
    return created;
  }

  // Meal Logs
  async getMealLogs(userId: string, date?: Date): Promise<MealLog[]> {
    let conditions = [eq(mealLogs.userId, userId)];
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      conditions.push(and(
        gte(mealLogs.date, startOfDay),
        lte(mealLogs.date, endOfDay)
      )!);
    }
    
    return db.select()
      .from(mealLogs)
      .where(and(...conditions))
      .orderBy(desc(mealLogs.date));
  }

  async createMealLog(log: InsertMealLog): Promise<MealLog> {
    const [created] = await db.insert(mealLogs).values(log).returning();
    return created;
  }

  async deleteMealLog(id: number, userId: string): Promise<void> {
    await db.delete(mealLogs).where(and(eq(mealLogs.id, id), eq(mealLogs.userId, userId)));
  }

  // Reminders
  async getReminders(userId: string): Promise<Reminder[]> {
    return db.select().from(reminders).where(eq(reminders.userId, userId));
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [created] = await db.insert(reminders).values(reminder).returning();
    return created;
  }

  async updateReminder(id: number, userId: string, updates: Partial<InsertReminder>): Promise<Reminder> {
    const [updated] = await db.update(reminders)
      .set(updates)
      .where(and(eq(reminders.id, id), eq(reminders.userId, userId)))
      .returning();
    return updated;
  }

  async deleteReminder(id: number, userId: string): Promise<void> {
    await db.delete(reminders).where(and(eq(reminders.id, id), eq(reminders.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
