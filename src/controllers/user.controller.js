import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser =  asyncHandler(async (req, res) => {
    //user detail from frontend
    //validation 
    //check user already exisit
    //check for images, avatar
    //upload to cloudinary, avatar
    //create user object - create entry in db
    //resmove pswd and refress token field from response
    //check for user creation
    //return res

    const {fullName, email, username, password} = req.body;
    console.log("email: ", email);

    if([fullName, email, password, username].some((field) => {
        field?.trim() === ""
    })){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User woth email or username already exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath); 

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong ehile registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "USer registerd Successfully")
    )

})


export {
    registerUser,
}