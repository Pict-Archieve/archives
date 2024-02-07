import ApiError from "../utils/API_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Api_Response } from "../utils/API_Response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import { createReadStream } from "fs";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
import fs from "fs";
const getUser = asyncHandler(async (req, res) => {
  const user = req.user._id;
  try {
    const loggedInUser = await User.findOne(user).select(
      "-password -refreshToken"
    );
    if (!loggedInUser) {
      throw new ApiError(404, "User Profile Not Found in Database ");
    }
    res.status(200).json(new Api_Response(200, "User Profile", loggedInUser));
  } catch (error) {
    console.log("Error: ", error);
    res.status(404).json(new Api_Response(404, "User Profile Not Found"));
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const oldResume = req.user.resume;

  try {
    let avatarLocalPath = null;
    let resumeLocalPath = null;

    if (
      req.files &&
      Array.isArray(req.files.resume) &&
      req.files.resume.length > 0
    ) {
      resumeLocalPath = req.files?.resume[0]?.path;
    }
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      avatarLocalPath = req.files?.avatar[0]?.path;
    }

    console.log(resumeLocalPath);
    // const { fullName, password } = req.body;
    const fullName = req.body?.fullName;
    const password = req.body?.password;

    const updateFields = {};

    if (fullName) {
      updateFields.fullName = fullName;
    }
    if (avatarLocalPath) {
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new ApiError(400, "Avatar File is Not able to store");
      }
      updateFields.avatar = avatar.url;
    }
    if (resumeLocalPath) {
      // Use GridFS to store the resume
      try {
        const resumeStream = createReadStream(resumeLocalPath);
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db);
        // Delete the old resume if it exists
        if (oldResume) {
          await bucket.delete(oldResume);
        }

        // Upload the new resume
        const uploadStream = await bucket.openUploadStream(
          req.files.resume[0].originalname
        );
        if (!uploadStream) {
          throw new ApiError(500, "Failed to update the resume");
        }

        // Pipe the resume stream to the GridFS upload stream
        const uploaded = await resumeStream.pipe(uploadStream);
        if (!uploaded) {
          throw new ApiError(500, "Failed to update the resume");
        }
        fs.unlinkSync(resumeLocalPath);
        updateFields.resume = uploadStream?.id;
      } catch (error) {
        console.log("Error while updating resume");
      } // Store the ObjectID of the resume in the user document
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields }, // Use $set operator to update specific fields
      { new: true } // Return the updated document
    ).select("-password -refreshToken");
    console.log(updatedUser, "Userrrr");
    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user.");
    }
    return res
      .status(200)
      .json(new Api_Response(200, updatedUser, "User updated successfully."));
  } catch (error) {
    console.log("Error while updating profile", error);
    res.status(200).json(new Api_Response(500, "Error while updating profile"));
  }
});

const getResume = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Find the user document to get the resume ID
    const user = await User.findById(userId);

    if (!user || !user.resume) {
      throw new ApiError(404, "Resume not found");
    }

    // Get the resume ID from the user document
    const resumeId = user.resume;

    // Create a GridFSBucket instance
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db);

    // Open a download stream for the resume file
    const downloadStream = bucket.openDownloadStream(resumeId);

    // Set the appropriate response headers
    res.set("Content-Type", "application/pdf"); // Adjust content type as needed
    res.set("Content-Disposition", 'attachment; filename="resume.pdf"'); // Adjust filename as needed

    // Pipe the download stream to the response
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error while getting resume", error);
    res
      .status(error.status || 500)
      .json(
        new Api_Response(error.status || 500, "Error while getting resume")
      );
  }
});

export { getUser, updateUser, getResume };
