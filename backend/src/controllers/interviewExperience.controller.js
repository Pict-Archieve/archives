import ApiError from "../utils/API_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

import { Api_Response } from "../utils/API_Response.js";
import { InterviewExperience } from "../models/interviewExperience.model.js";

// Adding post to user post array
const addPostIdToUserPost = async (userId, postId) => {
  console.log(userId);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { interviewExperiences: postId } },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(500, "Not able add postID in user");
  }
  return updatedUser;
};

// Form checking for Interview Experinces and Saving in database
const postInterviewExperience = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const {
    title,
    description,
    interviewDate,
    interviewType,
    interviewMode,
    questions,
    feedback,
    rating,
    status,
  } = req.body;

  const saveInterviewExperience = await InterviewExperience.create({
    userID: user._id,
    description: description,
    title: title,
    interviewDate: interviewDate,
    interviewType: interviewType,
    interviewMode: interviewMode,
    questions: questions,
    feedback: feedback,
    rating: rating,
    status: status,
  });

  if (!saveInterviewExperience) {
    throw new ApiError(
      500,
      "Something went wrong while creating new Interview Experience"
    );
  }

  // Call function to add postId to user's posts array
  const addPostToUser = await addPostIdToUserPost(
    user._id,
    saveInterviewExperience._id
  );
  if (!addPostToUser) {
    throw new ApiError(500, "Something went wrong while add post to user");
  }
  return res
    .status(201)
    .json(
      new Api_Response(
        200,
        saveInterviewExperience,
        "Posted Interview Experience Successfully"
      )
    );
});

// Get all interview experinces from database
const getAllInterviewExperinces = asyncHandler(async (req, res) => {
  try {
    const allExperinces = await InterviewExperience.find();
    if (allExperinces) {
      res
        .status(200)
        .json(
          new Api_Response(
            200,
            allExperinces,
            "Interview experinces recieved successfully"
          )
        );
    }
  } catch (error) {
    console.log("Error while fetching all experinces", error);
    res
      .status(500)
      .json(
        new Api_Response(500, null, "Not able to fetch all experiences", error)
      );
  }
});

const getInterviewExp = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(postId, "Post ID");

    const postFetching = await InterviewExperience.findById(postId);
    if (!postFetching) {
      throw new ApiError(500, "Not able to find interview experience");
    }
    res
      .status(200)
      .json(
        new Api_Response(
          200,
          postFetching,
          "Interview experiences recieved successfully"
        )
      );
  } catch (error) {
    console.log("Error while fetching post", error);
    res
      .status(500)
      .json(new Api_Response(500, null, "Not able to fetch post", error));
  }
});

const addComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const user = req.user._id;
  const { text } = req.body;

  try {
    const addingComment = await InterviewExperience.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: user, text: text, createdAt: Date.now() } },
      },
      { new: true }
    );

    if (!addingComment) {
      throw new ApiError(500, "Not able add comment in user");
    }
    res.status(201).json(new Api_Response(200, "Comment Added Successfully"));
  } catch (error) {
    console.log("Error while adding Comment", error);
    return res
      .status(500)
      .json(new Api_Response(500, "Error while adding a comment"));
  }
});

const addUpvote = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user._id;
  console.log(userId, "User ID");

  try {
    const post = await InterviewExperience.findById(postId);
    if (!post) {
      throw new ApiError(500, "Post does not exists in database");
    }
    const existingUpvoteIndex = post.upvotes.findIndex((upvote) =>
      upvote?.user?.equals(userId)
    );
    let flagAdded = false;
    if (existingUpvoteIndex !== -1) {
      // If the user has already upvoted, remove their upvote
      post.upvotes.splice(existingUpvoteIndex, 1);
      flagAdded = true;
      console.log("hello");
    } else {
      // If the user hasn't upvoted yet, add their upvote

      post.upvotes.push({ user: userId });
    }

    const upVoted = await post.save();
    if (!upVoted) {
      throw new ApiError(500, "Error while Upvoting post");
    }
    if (flagAdded) {
      res
        .status(201)
        .json(new Api_Response(200, "Upvote Removed Successfully"));
    }
    res.status(201).json(new Api_Response(200, "Upvote Added Successfully"));
  } catch (error) {
    console.log("Error while adding Upvote", error);
    return res
      .status(500)
      .json(new Api_Response(500, "Error while adding a Upvote"));
  }
});

export {
  postInterviewExperience,
  getAllInterviewExperinces,
  addComment,
  addUpvote,
  getInterviewExp,
};
