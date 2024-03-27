import jwt from "jsonwebtoken";
import { User } from "../../../Models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const authToken =
      req.cookies?.accessToken || req.headers?.authorization.split(" ")[1];
    if (!authToken) {
      res.send({ error: true, message: "invalid authrization" });
    }
    //  check token
    const verifyToken = await jwt.verify(
      authToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!verifyToken?._id) {
      res.send({ error: true, message: "invalid authrization" });
    }
    const user = await User.findById(verifyToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      res.send({ error: true, message: "invalid User authrization" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.send({ error: true, message: "authMiddleware Error" });
  }
};
