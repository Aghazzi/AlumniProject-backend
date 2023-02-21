import express from "express";
const router = express.Router();
import controller from "../controllers/productsController.js";
import verifyUser, { admin, upload } from "../middleware/auth.js";

router.get("/", verifyUser, controller.getAll);
router.get("/:id", verifyUser, controller.getById);
router.post("/", verifyUser, admin, upload, controller.addProduct);
router.delete("/:id", verifyUser, admin, controller.deleteProductById);
router.patch("/:id", verifyUser, admin, upload, controller.updateProductById);

export default router;
