import { User } from "../Models/user.model.js";
import cloudinaryService from "../Utils/CloudinaryService/CloudinaryService.js";

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // check all filed
    if ([username, email, password].some((filed) => filed.trim() == "")) {
      return res.send({ success: false, message: "All Fileds Are Required" });
    }
    // check existin user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.send({ success: true, message: "Already Have An Account" });
    }
    // check existin user
    // check file

    if (!req.files.avatar || !req.files.coverImage) {
      return res.send({
        success: false,
        message: "All File Fileds Are Required",
      });
    }
    const avatar = req.files.avatar[0].path;
    const coverImage = req.files.coverImage[0].path;
    // upload image cloudinary
    const avatarUrl = await cloudinaryService(avatar);
    const coverImageUrl = await cloudinaryService(coverImage);

    if (!(avatarUrl || coverImageUrl)) {
      return res.send({
        success: false,
        message: "All File Fileds Are Required",
      });
    }

    const createUser = new User({
      username,
      email,
      password,
      avatar: avatarUrl.url,
      coverImage: coverImageUrl.url,
    });
    const saveUser = await createUser.save({ validateBeforeSave: false });
    const findUser = await User.findById(saveUser?._id).select(
      "-password -refreshToken"
    );
    if (!findUser) {
      return res.send({ error: "User is Not Found" });
    }
    res.send({
      success: true,
      message: "User Add Successfully",
      data: findUser,
    });
  } catch (error) {
    res.send({ error: true, message: "user routes is not found" });
  }
};

const logInController = async (req, res) => {
  try {
  } catch (error) {
    res.send({ error: true, message: "user routes is not found" });
  }
};

export { registerController, logInController };
