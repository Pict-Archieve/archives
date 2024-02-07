import mongoose from "mongoose";
import { User } from "./user.model.js";
const InterviewExperienceSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    interviewDate: {
      type: Date,
    },
    interviewType: {
      type: String,
      enum: ["OffCampus", "OnCampus"],
      required: true,
    },
    interviewMode: {
      type: String,
      enum: ["Online", "Onsite"],
      required: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
      },
    ],
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    status: {
      type: String,
      enum: ["Selected", "Rejected", "Pending"],
      default: "Pending",
      required: true,
    },

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    upvotes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const InterviewExperience = mongoose.model(
  "InterviewExperience",
  InterviewExperienceSchema
);

export { InterviewExperience };
