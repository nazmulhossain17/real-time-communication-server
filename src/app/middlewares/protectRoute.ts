import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // Adjust the path as necessary
import prisma from "../../shared/prisma";
import config from "../../config";

// Middleware to protect routes
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No Token Provided" });
  }

  try {
    // Verify the token
    console.log("Token:", token); // For debugging
    const decoded = jwt.verify(token, config.jwtSecret as string) as {
      userId: string;
    };
    console.log("Decoded:", decoded); // For debugging

    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User Not Found" });
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error); // Log the error for debugging
    return res.status(401).json({ error: "Unauthorized - Invalid Token" });
  }
};
