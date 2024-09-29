import express from 'express';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import { activateUserProfile, changeUserPassword, deleteUserProfile, getNotificationsList, getProjectAssignedUsers, getTeamList, loginUser, logoutUser, markNotificationRead, registerUser, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser)

router.get("/get-team", protectRoute , getTeamList);
router.get("/notification", protectRoute, getNotificationsList);
router.get('/:projectId/assigned-users',getProjectAssignedUsers);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

router
    .route("/:id")
    .put(protectRoute, isAdminRoute, activateUserProfile)
    .delete(protectRoute, isAdminRoute, deleteUserProfile);

export default router;
