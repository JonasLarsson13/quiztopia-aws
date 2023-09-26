import { sendResponse } from "../../responses/index.js";
import { db } from "../../services/db.js";

export const handler = async (event) => {
  try {
    if (!event.pathParameters || !event.pathParameters.quizId) {
      return sendResponse(400, {
        error: "Missing quizId in query parameters",
        event: event,
      });
    }
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

    const questionParams = {
      TableName: "Questions",
      KeyConditionExpression: "quizId = :quizId",
      ExpressionAttributeValues: {
        ":quizId": quizId,
      },
    };

    const questionResult = await db.query(questionParams).promise();

    const quizDetails = quizResult.Items[0];
    const questions = questionResult.Items || [];

    return sendResponse(200, {
      success: true,
      quiz: {
        name: quizDetails.name,
        questions: questions.map((question) => ({
          question: question.question,
          answer: question.answer,
        })),
      },
    });
  } catch (error) {
    let message =
      error?.details?.message || error?.message || "Something went wrong";
    return sendResponse(400, { error: message });
  }
};
