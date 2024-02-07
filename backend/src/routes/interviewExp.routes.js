import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  postInterviewExperience,
  getAllInterviewExperinces,
  addComment,
  addUpvote,
  getInterviewExp,
} from "../controllers/interviewExperience.controller.js";
import { validateInterviewInput } from "../middlewares/interviewExperience.middleware.js";

const router = Router();

router.route("/:postId").get(getInterviewExp);

router.route("/:postId/comment").post(verifyJWT, addComment);
router.route("/:postId/upvote").post(verifyJWT,addUpvote);
router.route("/post").post(verifyJWT,validateInterviewInput, postInterviewExperience);
router.route("/").get(getAllInterviewExperinces);
export default router;
