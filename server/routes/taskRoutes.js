import express from "express";
import { param, body } from "express-validator";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddleware.js";
import * as taskController from "../controllers/taskController.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  body("columnBoardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid column board ID");
    } else return Promise.resolve();
  }),
  protectRoute,
  taskController.create
);

router.put("/update-position", protectRoute, taskController.updatePosition);

router.delete(
  "/:taskId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board ID");
    } else return Promise.resolve();
  }),
  param("taskId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid task ID");
    } else return Promise.resolve();
  }),
  protectRoute,
  taskController.delete_task
);

router.post(
  "/changeColumnBoard",
  protectRoute,
  taskController.changeTaskColumnBoard
);

router.put(
  "/:taskId",
  param("boardId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid board ID");
    } else return Promise.resolve();
  }),
  param("taskId").custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject("Invalid task ID");
    } else return Promise.resolve();
  }),
  protectRoute,
  taskController.update_task
);

export default router;
