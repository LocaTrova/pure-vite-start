import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const formSubmissionSchema = z.object({
  spaceType: z.string().min(1, "Tipo di spazio richiesto"),
  name: z.string().min(1, "Nome richiesto"),
  email: z.string().email("Email non valida"),
  phone: z.string().min(1, "Telefono richiesto"),
  city: z.string().min(1, "Città richiesta"),
  squareMeters: z.number().min(20).max(1000),
  availability: z.array(z.string()),
  characteristics: z.string().optional(),
  notes: z.string().max(500).optional(),
  privacy: z.boolean().refine(val => val === true, "Devi accettare i termini e condizioni"),
  marketing: z.boolean(),
});

export type FormSubmission = z.infer<typeof formSubmissionSchema>;
