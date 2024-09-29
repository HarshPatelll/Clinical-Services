import express from "express";
import {
  createSubProject,
  createProject,
  dashboardStatistics,
  deleteRestoreProject,
  duplicateProject,
  getProject,
  getProjects,
  postProjectActivity,
  trashProject,
  updateProject,
} from "../controllers/projectController.js";

import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createProject);
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateProject);
router.post("/activity/:id", protectRoute, postProjectActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getProjects);
router.get("/:id", protectRoute, getProject);

router.put("/create-subproject/:id", protectRoute, isAdminRoute, createSubProject);
router.put("/update/:id", protectRoute, isAdminRoute, updateProject);
router.put("/:id", protectRoute, isAdminRoute, trashProject);

router.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreProject
);

export default router;