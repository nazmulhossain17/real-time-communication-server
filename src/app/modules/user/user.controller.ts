import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { User } from "@prisma/client";
import catchAsync from "../../../shared/catchAsync";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await UserService.registerUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User account created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already exists") {
      sendResponse(res, {
        statusCode: httpStatus.CONFLICT,
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await UserService.loginUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const getAllUser = async (req: Request, res: Response) => {
  const result = await UserService.getAllUser();
  sendResponse<Omit<User, "password">[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User data fetched successfully",
    data: result,
  });
};

const getAllUserById = async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id);
  sendResponse<Omit<User, "password">>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User single data fetched successfully",
    data: result,
  });
};

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserService.updateUser(id, payload);
  sendResponse<Omit<User, "password">>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const logoutUser = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Expire the cookie immediately
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logout successful",
  });
};

export const UserController = {
  registerUser,
  loginUser,
  getAllUser,
  getAllUserById,
  updateUser,
  logoutUser,
};
