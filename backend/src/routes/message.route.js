import { Router } from "express";
import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartners } from "../controllers/message.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import arcjetProtection from "../utils/arcjet.js";

const router = Router();

router.use(arcjetProtection, verifyJwt);

router.route("/contacts").get(getAllContacts);
router.route("/chats").get(getChatPartners);
router.route("/:id").get(getMessagesByUserId);

router.route("/send/:id").post(sendMessage);

export default router;