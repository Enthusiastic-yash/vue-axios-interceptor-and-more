// schemas.js
import { z } from "zod";

// Accepts either a single object OR an array of objects
export const countrySchema = z.union([
  z.object({
    code: z.string("country code is required"),
    name: z.string("country name is required"),
  }),
  z
    .array(
      z.object({
        code: z.string("country code is required"),
        name: z.string("country name is required"),
      }),
    )
    .min(1, "Select atleast one country")
    .default([]),
]);
export const step1Schema = z.object({
  fullName: z
    .string("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string("Email is required").email("Invalid email address"),
});

export const step2Schema = z.object({
  address: z.string("Address is required").min(5, "Address is too short"),
  city: z.string("City is required").min(1, "City is required"),
  // country: z.string("Country is required").min(1, "Please select a country"),
  country: countrySchema
    .nullable()
    .refine((val) => val !== null, "Please select a country"),
});

export const step3Schema = z.object({
  cardNumber: z
    .string("Card number is required")
    .length(16, "Card number must be 16 digits"),
  saveCard: z.boolean().optional(),
});

export const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema);
export type FormValues = z.infer<typeof fullSchema>;
