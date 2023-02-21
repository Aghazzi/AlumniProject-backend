import express from "express";
const router = express.Router();
import controller from "../controllers/categoriesController.js";
import verifyUser, { admin, upload } from "../middleware/auth.js";

router.get("/", controller.getAll);
router.get("/:id", controller.get);
router.post("/", verifyUser, admin, upload, controller.create);
router.patch("/:id", verifyUser, admin, upload, controller.update);
router.delete("/:id", verifyUser, admin, controller.delete);

export default router;
