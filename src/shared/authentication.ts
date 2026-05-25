import z from "zod";

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  preferred_username: z.string(),
  role: z.string(),
  iss: z.string(),
  exp: z.number(),
  iat: z.number(),
});

export type ValidatedJwtPayload = z.infer<typeof jwtPayloadSchema>;
