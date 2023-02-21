import express from "express";
const router = express.Router();
import controller from "../controllers/userController.js";
import verifyUser, { admin } from "../middleware/auth.js";

router.get("/", verifyUser, admin, controller.getAll);
router.get("/:id", verifyUser, admin, controller.get);
router.post("/signup", controller.signUp);
router.patch("/:id", verifyUser, controller.patch);
router.delete("/:id", verifyUser, admin, controller.delete);
router.post("/login", controller.logIn);
router.post("/logout", controller.logOut);

export default router;
