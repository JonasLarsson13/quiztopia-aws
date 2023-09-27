import { sendResponse } from "../../responses/index.js";
import { db } from "../../services/db.js";

export const handler = async (event) => {
  try {
    const quizId = event.pathParameters.quizId;

    const params = {
      TableName: "Leaderboard",
      KeyConditionExpression: "quizId = :quizId",
      ExpressionAttributeValues: {
        ":quizId": quizId,
      },
      ScanIndexForward: false,
    };

    const data = await db.query(params).promise();

    const leaderboard = data.Items.map((item) => {
      return {
        user: item.user,
        score: item.score,
      };
    });

    leaderboard.sort((a, b) => b.score - a.score);

    return sendResponse(200, {
      success: true,
      leaderboard: leaderboard,
    });
  } catch (error) {
    let message =
      error?.details?.message || error?.message || "Something went wrong";
    return sendResponse(400, { error: message });
  }
};
