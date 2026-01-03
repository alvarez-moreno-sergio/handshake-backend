import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  avatarUrl: z.url().optional().default(""),
  publicKey: z.string().min(32).max(4096),
  publicSignKey: z.string().min(32).max(4096)
});

export type RegisterInput = z.infer<typeof registerSchema>;
