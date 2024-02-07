import { Api_Response } from "../utils/API_Response.js";


const validateInterviewInput = (req, res, next) => {
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
  if (
    ![
      title,
      description,
      interviewDate,
      interviewType,
      interviewMode,
      questions,
      feedback,
      rating,
      status,
    ].every((field) => field)
  ) {
    return res
      .status(400)
      .json(new Api_Response(400, null, "All fields are required."));
  }
  next();
};



export { validateInterviewInput };
