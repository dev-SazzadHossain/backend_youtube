import express from "express";
import { registerController } from "../Controllers/user.controller.js";
import { fileUploadService } from "../Middleware/FileUpload/FileUpload.middleware.js";
const allRoute = express.Router();

allRoute.route("/user").post(
  fileUploadService.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerController
);

export default allRoute;
