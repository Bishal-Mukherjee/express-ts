import express from "express";
const router = express.Router();
import { getAllUsers, getUserById } from "../controllers/users";

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
