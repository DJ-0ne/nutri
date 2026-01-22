import { z } from 'zod';
import { 
  insertProfileSchema, 
  insertFoodSchema, 
  insertMealLogSchema, 
  insertReminderSchema,
  profiles,
  foods,
  mealLogs,
  reminders
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  profiles: {
    get: {
      method: 'GET' as const,
      path: '/api/profile',
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        404: z.null(), // Profile might not exist yet
      },
    },
    update: {
      method: 'POST' as const, // Upsert
      path: '/api/profile',
      input: insertProfileSchema,
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    upgrade: {
      method: 'POST' as const,
      path: '/api/profile/upgrade',
      input: z.object({ tier: z.enum(['free', 'premium']) }),
      responses: {
        200: z.custom<typeof profiles.$inferSelect>(),
      }
    }
  },
  foods: {
    list: {
      method: 'GET' as const,
      path: '/api/foods',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof foods.$inferSelect>()),
      },
    },
    create: { // For admin or seeding
      method: 'POST' as const,
      path: '/api/foods',
      input: insertFoodSchema,
      responses: {
        201: z.custom<typeof foods.$inferSelect>(),
      },
    },
  },
  mealLogs: {
    list: {
      method: 'GET' as const,
      path: '/api/meals',
      input: z.object({ date: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof mealLogs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/meals',
      input: insertMealLogSchema,
      responses: {
        201: z.custom<typeof mealLogs.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/meals/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  reminders: {
    list: {
      method: 'GET' as const,
      path: '/api/reminders',
      responses: {
        200: z.array(z.custom<typeof reminders.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reminders',
      input: insertReminderSchema,
      responses: {
        201: z.custom<typeof reminders.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/reminders/:id',
      input: insertReminderSchema.partial(),
      responses: {
        200: z.custom<typeof reminders.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/reminders/:id',
      responses: {
        204: z.void(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
