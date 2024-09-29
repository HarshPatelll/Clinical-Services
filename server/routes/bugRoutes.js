import express from "express";
import {
  createSubBug,
  createBug,
  dashboardStatistics,
  deleteRestoreBug,
  duplicateBug,
  getBug,
  getBugs,
  postBugActivity,
  trashBug,
  updateBug,
} from "../controllers/bugController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createBug);
router.post("/duplicate/:id", protectRoute, duplicateBug);
router.post("/activity/:id", protectRoute, postBugActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getBugs);
router.get("/:id", protectRoute, getBug);

router.put("/create-subbug/:id", protectRoute, createSubBug);
router.put("/update/:id", protectRoute, updateBug);
router.put("/:id", protectRoute,trashBug);

router.delete(
  "/delete-restore/:id?",
  protectRoute,
  deleteRestoreBug
);

export default router;