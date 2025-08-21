// routes/auth.js
import { Router } from "express";

// Ajusta estas rutas si tu estructura difiere:
// - Si tus controladores y middleware están en /src/controllers y /src/middleware
import { loginController } from "../src/controllers/authController.js";
import { verifyCaptcha } from "../src/middleware/verifyCaptcha.js";

const router = Router();

// POST /api/auth/login
router.post("/login", verifyCaptcha, loginController);

export default router;
