import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokenS = async (userId) => {
  try {
    // Generate access token and refresh token
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  /**
   ****************** step to register user ***********************
   ****************************************************************
   * get user details from frontend
   * validation
   * check if user is already registered: username, email
   * create user object - create entity in database
   * remove password and refresh token from resposne
   * check for user creation
   * return res
   ****************************************************************
   */

  // get user details
  const { email, username, password } = req.body;
  console.log(email, username, password);
  if ([email, username, password].some((field) => field?.trim() === "")) {
    res.status(500).json("All fields are required");
  }

  // check if user is already registered
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    res.status(500).json("email already exist");
  }
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  });
  // remove password and refresh token from response
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    res.status(500).json("Failed to create user");
  }
  // return response with user details
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    /**
     ****************** step to Login user ***********************
     *************************************************************
     * get user details
     * check if user exists
     * check password
     * create token and refresh token
     * send cookie
     * send response
     *************************************************************
     */
  
    // get user details
    const { email, password, username } = req.body;
    if (!(email || username)) {
      res.status(500).json("email is required");
    }
  
    // check if user exists
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
  
    if (!user) {
      res.status(500).json("User not found");
    }
  
    // check password
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      res.status(500).json("Invalid password");
    }
  
    // generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokenS(
      user._id
    );
  
    // get user details and remove password and refresh token
    const loggedInUser = await User.findOne(user._id).select(
      "-password -refresh-token"
    );
  
    // security for token
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    // send response with user details and tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "user logged in successfully"
        )
      );
  });

  const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true }
    );
  
    // security for token
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "user logged out successfully"));
  });

  export {
    loginUser,
    registerUser
  }
