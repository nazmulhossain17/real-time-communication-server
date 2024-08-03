import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { PointController, UserController } from "./user.controller";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(UserValidation.create),
  UserController.registerUser
);

router.post(
  "/login-user",
  validateRequest(UserValidation.login),
  UserController.loginUser
);

router.put(
  "/update-user/:id",
  validateRequest(UserValidation.update),
  UserController.updateUser
);

router.get("/get-all", UserController.getAllUser);
router.get("/get-all/:id", UserController.getAllUserById);
router.post("/log-out", UserController.logoutUser);

router.post("/increase-point", PointController.increasePoint);
router.post("/decrease-point", PointController.decreasePoint);

export const UserRoutes = router;
