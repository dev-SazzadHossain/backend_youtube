import { User } from "../Models/user.model.js";
import cloudinaryService from "../Utils/CloudinaryService/CloudinaryService.js";
import { options } from "../Utils/Options.js";

const generatedAccessAndRefreshToken = async (id) => {
  if (id) {
    const user = await User.findById(id);
    const accessToken = await user.generatedAccessToken();
    const refreshToken = await user.generatedRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  }
};

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
    const { email, password } = req.body;
    // check user data is valid
    if ([email, password].some((filed) => filed.trim() == "")) {
      return res.send({ success: false, messag: "All Filed Are Required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.send({ success: false, message: "Invalid User Credentials" });
    }
    // check password
    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.send({
        success: false,
        message: "Invalid UserPass Credentials",
      });
    }
    // generateAccessAndRefreshToken
    const { accessToken, refreshToken } = await generatedAccessAndRefreshToken(
      existingUser?._id
    );
    const userFind = await User.findById(existingUser?._id).select(
      "-password -refreshToken"
    );
    if (userFind) {
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .send({
          success: true,
          message: "LogIn Successfully",
          refreshToken,
          accessToken,
          data: userFind,
        });
    }
  } catch (error) {
    res.send({ error: true, message: "user routes is not found" });
  }
};

const logOutController = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
        refreshToken: null,
      },
    });

    // clear cookie
    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .send({ success: true, message: "LogOut Successfully" });
  } catch (error) {
    res.send({ error: true, message: "user routes is not found" });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if ([newPassword, oldPassword].some((filed) => filed.trim() == "")) {
      return res.send({
        success: false,
        message: "newPassword Filed is Required",
      });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.send({
        success: false,
        message: "Invalid User Access",
      });
    }
    // check old password
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      return res.send({
        success: false,
        message: "incorrect User oldPassowrd",
      });
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .send({ success: true, message: "Password Change Successfully" });

    // hasing
  } catch (error) {
    res.send({ error: true, message: "Routes Not Found" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    console.log(email);
    if ([username, email].some((filed) => filed.trim() == "")) {
      return res.send({ success: false, message: "All Filed are Required" });
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          username,
          email,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.send({ success: false, message: "Invalid User Access" });
    }
    res.send({
      success: true,
      message: "User Update Profile Successfully",
      data: user,
    });
  } catch (error) {
    res.send({ error: true, message: "Routes Not Found" });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const filePath = req.file?.path;

    if (!filePath) {
      return res.send({ success: false, message: "File Is Required" });
    }
    const fileUrl = await cloudinaryService(filePath);

    if (!fileUrl?.url) {
      return res.send({ success: false, message: "File Url Is Required" });
    }
    const updateFile = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: fileUrl?.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");
    res.status(200).send({
      success: true,
      message: "User Avatar Update SuccessFully",
      data: updateFile,
    });
  } catch (error) {
    res.send({ error: true, message: "Routes Not Found" });
  }
};

export {
  registerController,
  logInController,
  logOutController,
  changeUserPassword,
  updateUserProfile,
  updateUserAvatar,
};
