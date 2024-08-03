import express from "express";
import { MessageController } from "./message.controller";

const router = express.Router();

router.get("/:id", MessageController.getMessages);
router.post("/send/:id", MessageController.sendMessage);

export const MessageRoutes = router;
