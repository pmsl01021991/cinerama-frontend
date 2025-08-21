import { Router } from "express";
import { loginController } from "../src/controllers/authController.js";
import { verifyCaptcha } from "../src/middleware/verifyCaptcha.js";

const router = Router();

router.post("/login", verifyCaptcha, loginController);

export default router;
