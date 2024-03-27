import expres from "express";
import allRoute from "./all.route.js";
const mainRoute = expres.Router();

mainRoute.use(process.env.API, allRoute);

export default mainRoute;
