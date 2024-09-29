import express from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
import bugRoutes from "./bugRoutes.js";

import projectRoute from "./projectRoute.js";
import columnRoutes from "./ColumnBoardRoutes.js";


const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/bug", bugRoutes);
router.use("/project", projectRoute);
router.use("/column", columnRoutes);


export default router;
