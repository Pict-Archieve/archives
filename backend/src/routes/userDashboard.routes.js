import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUser,
  updateUser,
  getResume,
} from "../controllers/userDashboard.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();



router.route("/").post(verifyJWT, getUser);
router.route("/edit").post(
  upload.fields([
     {
      name: "resume",
      maxCount: 1,
    },
    {
      name: "avatar",
      maxCount: 1,
    },
   
  ]),
  verifyJWT,
  updateUser
);
router.route("/resume").get(verifyJWT,getResume);
export default router;