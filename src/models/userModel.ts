import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { bcryptSalRound } from "../utils/user";

const userSchema = new mongoose.Schema(
  {
    emailOrNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    userType: {
      type: String,
      enum: ["guest", "customer"],
      required: true,
      default: "guest",
    },

    // add others details of user= ===>
  },
  {
    timestamps: true,
  }
);

// hashing password and save into DB
userSchema.pre("save", async function (next) {
  const user = this; // doc
  user.password = await bcrypt.hash(user.password, bcryptSalRound);
  next();
});

export const User = mongoose.model("User", userSchema);