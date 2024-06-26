import bcrypt from "bcrypt";
import { User } from "../models/userModel";
import { catchAsyncError } from "../utils/catchAsyncError";
import createToken from "../utils/jwtToken";
import sendResponse from "../utils/sendResponse";
import { bcryptSalRound, findUserByEmailOrNumber } from "../utils/user";
export const registerController = catchAsyncError(async (req, res, next) => {
  const { body } = req;
  const isExist = await findUserByEmailOrNumber(body.emailOrNumber);
  if (isExist) {
    return sendResponse(res, {
      data: null,
      message: "User already exist in this email or number",
      statusCode: 400,
      success: false,
    });
  }
  const result = await User.create(body);
  const { password, ...user } = result.toObject();
  sendResponse(res, {
    data: user,
    message: "User creaeted successfully",
    statusCode: 200,
    success: true,
  });
});
export const loginController = catchAsyncError(async (req, res, next) => {
  const { emailOrNumber, password } = req.body;
  const user = await findUserByEmailOrNumber(emailOrNumber);
  if (!user) {
    return sendResponse(res, {
      data: null,
      message: "User not found",
      statusCode: 404,
      success: false,
    });
  }

  const isPasswordMathced = await bcrypt.compare(password, user.password);
  if (!isPasswordMathced) {
    return sendResponse(res, {
      data: null,
      message: "Password didn't matched",
      statusCode: 401,
      success: false,
    });
  }

  const { password: pass, ...restUser } = user.toObject();

  const token = createToken(restUser, "7d");

  sendResponse(res, {
    data: restUser,
    message: "Successfully loged in",
    statusCode: 200,
    success: true,
    token: token,
  });
});
export const passwordResetController = catchAsyncError(
  async (req, res, next) => {
    const { emailOrNumber, newPassword, oldPassword } = req.body;
    const user = await findUserByEmailOrNumber(emailOrNumber);
    if (!user) {
      return sendResponse(res, {
        data: null,
        message: "User not found",
        statusCode: 404,
        success: false,
      });
    }
    console.log(user.password);

    const isPasswordMathced = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMathced) {
      return sendResponse(res, {
        data: null,
        message: "Password didn't matched",
        statusCode: 401,
        success: false,
      });
    }

    const newBcryptedPassword = await bcrypt.hash(newPassword, bcryptSalRound);
    await User.findOneAndUpdate(
      { emailOrNumber },
      { password: newBcryptedPassword },
      { new: true }
    );
    sendResponse(res, {
      data: null,
      success: true,
      message: "password updated successfully",
      statusCode: 200,
    });
  }
);
