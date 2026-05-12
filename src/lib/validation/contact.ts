import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Votre nom doit contenir au moins 2 caractères")
    .max(100, "100 caractères maximum"),
  email: z
    .string()
    .min(1, "Email requis")
    .email("Adresse email invalide"),
  subject: z
    .string()
    .min(3, "Sujet trop court")
    .max(150, "150 caractères maximum"),
  message: z
    .string()
    .min(20, "Décrivez votre projet en quelques phrases (20 caractères min.)")
    .max(2000, "2000 caractères maximum"),
  /** Honeypot anti-spam : doit rester vide */
  website: z.string().max(0).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
