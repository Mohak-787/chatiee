import { Router } from "express";

const router = Router();

router.route("/signup").get();
router.route("/login").get();
router.route("/logout").get();

export default router;