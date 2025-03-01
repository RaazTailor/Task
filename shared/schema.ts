import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jlptLevels = ["N1", "N2", "N3", "N4", "N5"] as const; // F5s levels

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  category: text("category", { enum: jlptLevels }).notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, createdAt: true })
  .extend({
    title: z.string().min(1, "Title is required").max(200),
    category: z.enum(jlptLevels),
    date: z.coerce.date(),
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
