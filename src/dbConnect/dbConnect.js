import mongoose from "mongoose";
import { dbName } from "../Constance/Constance.js";

export const dbConnect = async () => {
  try {
    const dbConnectInstance = await mongoose.connect(
      `${process.env.DB_URI}/${dbName}`
    );
    console.log(dbConnectInstance.connection.host.bgMagenta.red.bold);
  } catch (error) {
    console.log(`dbConnection Failed---${error.message}`);
  }
};
