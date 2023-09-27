import middy from "@middy/core";
import { sendResponse } from "../../responses/index.js";
import { validateToken } from "../../middleware/auth.js";
import { createQuestion, getQuiz } from "../../services/quiz.js";

export const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      if (!event?.userId || (event?.error && event?.error === "401"))
        return sendResponse(401, {
          success: false,
          message: "Invalid token",
        });

      const quizId = event.pathParameters.quizId;

      const quiz = await getQuiz(quizId);

      if (event?.username !== quiz?.Item?.createdBy) {
        return sendResponse(403, {
          success: false,
          message: "You are not authorized to add a question to this quiz.",
        });
      }

      const body = JSON.parse(event.body);

      await createQuestion(body, quizId);

      return sendResponse(200, {
        success: true,
        quizId: quizId,
      });
    } catch (error) {
      let message =
        error?.details?.message || error?.message || "Something went wrong";
      return sendResponse(400, { error: message });
    }
  });
