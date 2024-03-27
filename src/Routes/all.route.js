import express from "express";
import {
  changeUserPassword,
  logInController,
  logOutController,
  registerController,
  updateUserAvatar,
  updateUserProfile,
} from "../Controllers/user.controller.js";
import { fileUploadService } from "../Middleware/FileUpload/FileUpload.middleware.js";
import { authMiddleware } from "../Middleware/FileUpload/AuthMiddleware/Auth.middleware.js";
import { subscriptionController } from "../Controllers/subscription.controller.js";
const allRoute = express.Router();

allRoute.route("/user").post(
  fileUploadService.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerController
);
allRoute.route("/logIn").post(logInController);
allRoute.route("/logOut").post(authMiddleware, logOutController);
allRoute.route("/subscribe").post(authMiddleware, subscriptionController);
allRoute.route("/change_password").post(authMiddleware, changeUserPassword);
allRoute.route("/update_userProfile").post(authMiddleware, updateUserProfile);
allRoute
  .route("/update_userAvatar")
  .post(fileUploadService.single("avatar"), authMiddleware, updateUserAvatar);

export default allRoute;
