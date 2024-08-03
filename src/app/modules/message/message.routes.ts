import express from "express";
import { MessageController } from "./message.controller";
import { protectRoute } from "../../middlewares/protectRoute";

const router = express.Router();

router.get("/:id", MessageController.getMessages);
router.post("/send/:id", MessageController.sendMessage);

export const MessageRoutes = router;
