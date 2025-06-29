import express from "express";
const router = express.Router();
import userRoutes from "@/routes/users";

router.use("/users", userRoutes);

export default router;
