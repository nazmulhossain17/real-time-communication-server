import { z } from "zod";

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required",
    }),
    email: z
      .string({
        required_error: "email is required",
      })
      .email(),
    password: z.string({
      required_error: "password is required",
    }),
  }),
});

const login = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email is required",
      })
      .email(),
    password: z.string({
      required_error: "password is required",
    }),
  }),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    points: z.string().optional(),
  }),
});

export const UserValidation = { create, login, update };
