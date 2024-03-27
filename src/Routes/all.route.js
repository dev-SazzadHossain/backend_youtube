import express from "express";
import {
  changeUserPassword,
  logInController,
  logOutController,
  registerController,
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
allRoute.route("/logOut").post(authMiddleware, subscriptionController);
allRoute.route("/changePassowrd").post(authMiddleware, changeUserPassword);

export default allRoute;
