export * from "./models/auth";
export * from "./models/chat";

import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

// === NUTRITION APP TABLES ===

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  height: integer("height"), // in cm
  weight: doublePrecision("weight"), // in kg
  age: integer("age"),
  gender: text("gender"), // male, female, other
  activityLevel: text("activity_level"), // sedentary, light, moderate, active, very_active
  dietaryGoals: text("dietary_goals"), // lose_weight, maintain, gain_muscle
  dietaryRestrictions: text("dietary_restrictions"), // none, vegetarian, vegan, gluten_free, etc.
  subscriptionTier: text("subscription_tier").default("free").notNull(), // free, premium
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"), // e.g., "Cereals", "Vegetables", "Fruits" (Kenya composition categories)
  calories: integer("calories").notNull(), // per 100g
  protein: doublePrecision("protein").notNull(), // g
  carbs: doublePrecision("carbs").notNull(), // g
  fat: doublePrecision("fat").notNull(), // g
  fiber: doublePrecision("fiber"), // g
  vitaminA: doublePrecision("vitamin_a"), // mcg
  iron: doublePrecision("iron"), // mg
  isKenyaSpecific: boolean("is_kenya_specific").default(false),
});

export const mealLogs = pgTable("meal_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow().notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  foodItems: jsonb("food_items").notNull(), // Array of { foodId, quantity_g, name, calories, macros }
  totalCalories: integer("total_calories").notNull(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  time: text("time").notNull(), // HH:mm
  type: text("type").notNull(), // water, meal, snack, supplement
  message: text("message").notNull(),
  isActive: boolean("is_active").default(true),
});

// === RELATIONS ===

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const mealLogsRelations = relations(mealLogs, ({ one }) => ({
  user: one(users, {
    fields: [mealLogs.userId],
    references: [users.id],
  }),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  user: one(users, {
    fields: [reminders.userId],
    references: [users.id],
  }),
}));

// === INSERTS & TYPES ===

export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, updatedAt: true, userId: true });
export const insertFoodSchema = createInsertSchema(foods).omit({ id: true });
export const insertMealLogSchema = createInsertSchema(mealLogs, {
  date: z.coerce.date(),
}).omit({ id: true, userId: true });
export const insertReminderSchema = createInsertSchema(reminders).omit({ id: true, userId: true });

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Food = typeof foods.$inferSelect;
export type InsertFood = z.infer<typeof insertFoodSchema>;
export type MealLog = typeof mealLogs.$inferSelect;
export type InsertMealLog = z.infer<typeof insertMealLogSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

// API Types
export type CreateProfileRequest = InsertProfile;
export type UpdateProfileRequest = Partial<InsertProfile>;
