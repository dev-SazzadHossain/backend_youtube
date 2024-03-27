import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.COLUDINAEY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryService = async (localPath) => {
  try {
    if (localPath) {
      const uploadResponse = await cloudinary.uploader.upload(localPath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localPath);
      return uploadResponse;
    }
  } catch (error) {
    fs.unlinkSync(localPath);
    console.log(`File Upload Error Cloudinary---${error?.message}`);
    return null;
  }
};

export default cloudinaryService;
