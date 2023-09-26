import { sendResponse } from "../../responses/index.js";
import { db } from "../../services/db.js";

export const handler = async () => {
  try {
    const params = {
      TableName: "Quizzes",
      ProjectionExpression: "#quizId, #createdBy, #name",
      ExpressionAttributeNames: {
        "#quizId": "quizId",
        "#createdBy": "createdBy",
        "#name": "name",
      },
    };

    const result = await db.scan(params).promise();

    const quizzes = result.Items || [];

    return sendResponse(200, {
      success: true,
      quizzes: quizzes,
    });
  } catch (error) {
    let message =
      error?.details?.message || error?.message || "Something went wrong";
    return sendResponse(400, { error: message });
  }
};
