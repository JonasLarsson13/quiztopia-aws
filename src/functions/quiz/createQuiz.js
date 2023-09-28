import middy from "@middy/core";
import { nanoid } from "nanoid";
import { sendResponse } from "../../responses/index.js";
import { validateToken } from "../../middleware/auth.js";
import { db } from "../../services/db.js";
import { createQuestion } from "../../services/quiz.js";
import {
  validateQuestion,
  validateQuizName,
} from "../../utils/validateBody.js";

export const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      if (!event?.userId || (event?.error && event?.error === "401"))
        return sendResponse(401, {
          success: false,
          message: "Invalid token",
        });

      const body = JSON.parse(event.body);
      const { name, questions } = body;
      const quizNameError = validateQuizName(name);
      if (quizNameError) {
        return sendResponse(400, {
          message: quizNameError,
        });
      }

      for (const questionData of questions) {
        const questionInputError = validateQuestion(questionData);
        if (questionInputError) {
          return sendResponse(400, {
            message: questionInputError,
          });
        }
      }

      const quizId = nanoid();
      const quizItem = {
        quizId: quizId,
        createdBy: event.username,
        name: name,
      };

      const quizParams = {
        TableName: "Quizzes",
        Item: quizItem,
      };

      await db.put(quizParams).promise();

      for (const questionData of questions) {
        await createQuestion(questionData, quizId);
      }

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
