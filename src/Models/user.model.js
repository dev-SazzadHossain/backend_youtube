import mongoose, { Schema, SchemaTypes } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    watchHistory: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// password hashing this section
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});
// password hashing this section

// compare password true or false
userSchema.methods.isPasswordCorrect = async function (password) {
  if (password) {
    const response = await bcrypt.compare(password, this.password);
    return response; // retrun true or false
  }
};
// compare password true or false

// accessToken generated jwt->bearer token
userSchema.methods.generatedAccessToken = async function () {
  const response = await jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
  return response;
};
// accessToken generated jwt->bearer token

// refreshToken generated jwt->bearer token
userSchema.methods.generatedRefreshToken = async function () {
  const response = await jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return response;
};
// refreshToken generated jwt->bearer token

export const User = mongoose.model("User", userSchema);
