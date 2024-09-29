import express from "express";
import {
    addBoard,
    editBoard,
    dashboardStatistics,
    getAllBoards,
    getBoard,
    createSubTask,
    addColumnToBoard,
    deleteBoard
} from "../controllers/taskController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Board Routes
router.post("/create", protectRoute, isAdminRoute, addBoard);
router.post("/edit/:id", protectRoute, isAdminRoute, editBoard);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getAllBoards); // Fetch all boards
router.get("/:id", protectRoute, getBoard); // Fetch a single board

router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask); // Add sub-task to board
router.put("/update/:id", protectRoute, isAdminRoute, addColumnToBoard); // Update board with new columns
router.delete("/:id", protectRoute, isAdminRoute, deleteBoard); // Delete board

export default router;
