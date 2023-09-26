import middy from "@middy/core";
import { sendResponse } from "../../responses/index.js";
import { validateToken } from "../../middleware/auth.js";
import { db } from "../../services/db.js";

export const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const { username } = event;
      const quizId = event.pathParameters.quizId;

      const quizParams = {
        TableName: "Quizzes",
        KeyConditionExpression: "quizId = :quizId",
        ExpressionAttributeValues: {
          ":quizId": quizId,
        },
      };

      const quizResult = await db.query(quizParams).promise();

      if (!quizResult?.Items || quizResult?.Items?.length === 0) {
        return sendResponse(404, { error: "Quiz not found" });
      }

      const createdBy = quizResult.Items[0].createdBy;

      if (username !== createdBy) {
        return sendResponse(403, { error: "Unauthorized" });
      }

      const deleteQuizParams = {
        TableName: "Quizzes",
        Key: {
          quizId: quizId,
        },
      };

      await db.delete(deleteQuizParams).promise();

      const deleteQuestionsParams = {
        TableName: "Questions",
        KeyConditionExpression: "quizId = :quizId",
        ExpressionAttributeValues: {
          ":quizId": quizId,
        },
      };

      const questionsToDelete = await db.query(deleteQuestionsParams).promise();

      for (const question of questionsToDelete.Items) {
        const deleteQuestionParams = {
          TableName: "Questions",
          Key: {
            quizId: question.quizId,
            questionId: question.questionId,
          },
        };

        await db.delete(deleteQuestionParams).promise();
      }

      return sendResponse(200, {
        success: true,
        message: "Quiz deleted",
      });
    } catch (error) {
      let message =
        error?.details?.message || error?.message || "Something went wrong";
      return sendResponse(400, { error: message });
    }
  });
