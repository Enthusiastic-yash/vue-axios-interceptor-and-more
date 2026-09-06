// schemas.js
import { z } from "zod";

export const step1Schema = z.object({
  fullName: z.string("Full name is required").min(2, "Name must be at least 2 characters"),
  email: z.string("Email is required").email("Invalid email address"),
});

export const step2Schema = z.object({
  address: z.string("Address is required").min(5, "Address is too short"),
  city: z.string("City is required").min(1, "City is required"),
  country: z.string("Country is required").min(1, "Please select a country"),
});

export const step3Schema = z.object({
  cardNumber: z.string("Card number is required").length(16, "Card number must be 16 digits"),
  saveCard: z.boolean().optional(),
});

export const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
export type FormValues = z.infer<typeof fullSchema>;
