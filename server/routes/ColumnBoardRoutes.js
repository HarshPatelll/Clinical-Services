import express from "express";
import { param } from "express-validator";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";
import * as columnBoardController from "../controllers/columnBoardController.js";

const router = express.Router({ mergeParams: true });

// Create a new ColumnBoard
router.post(
  "/:projectId",
  param("projectId").isMongoId().withMessage("Invalid project ID"),
  protectRoute,
  isAdminRoute,
  columnBoardController.create
);

// Update an existing ColumnBoard
router.put(
  "/:columnBoardId",
  param("columnBoardId").isMongoId().withMessage("Invalid column board ID"),
  protectRoute,
  isAdminRoute,
  columnBoardController.update
);

// Delete a ColumnBoard and its associated tasks
router.delete(
  "/:columnBoardId",
  param("columnBoardId").isMongoId().withMessage("Invalid column board ID"),
  protectRoute,
  isAdminRoute,
  columnBoardController.deleteColumn
);

export default router;
