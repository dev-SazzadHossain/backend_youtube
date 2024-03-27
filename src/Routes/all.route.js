import express from "express";
import {
  logInController,
  logOutController,
  registerController,
} from "../Controllers/user.controller.js";
import { fileUploadService } from "../Middleware/FileUpload/FileUpload.middleware.js";
import { authMiddleware } from "../Middleware/FileUpload/AuthMiddleware/Auth.middleware.js";
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

export default allRoute;
