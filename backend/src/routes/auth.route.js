import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt, logout);

router.route("/update-profile").put(verifyJwt, updateProfile);

router.route("/check").get(verifyJwt, (req, res) => res.status(200).json(req.user));

export default router;