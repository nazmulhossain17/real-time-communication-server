import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import jwt from "jsonwebtoken";
import config from "../../../config";
async function registerUser(data: User): Promise<Omit<User, "password">> {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function loginUser(
  email: string,
  password: string
): Promise<{ user: Omit<User, "password">; token: string }> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: "1h",
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}
const getAllUser = async (): Promise<Omit<User, "password">[]> => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      points: true,
      createdAt: true, // Add this line
      updatedAt: true, // Add this line
    },
  });
  return result as Omit<User, "password">[];
};

const getUserById = async (
  id: string
): Promise<Omit<User, "password"> | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      points: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result as Omit<User, "password"> | null;
};
const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<Omit<User, "password">> => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      points: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

export const UserService = {
  registerUser,
  loginUser,
  updateUser,
  getAllUser,
  getUserById,
};
