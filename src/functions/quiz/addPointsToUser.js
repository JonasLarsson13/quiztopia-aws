import middy from "@middy/core";
import { sendResponse } from "../../responses/index.js";
import { validateToken } from "../../middleware/auth.js";
import { db } from "../../services/db.js";

export const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const body = JSON.parse(event.body);
      const { score } = body;
      const username = event.username;
      const quizId = event.pathParameters.quizId;

      if (!event?.userId || (event?.error && event?.error === "401"))
        return sendResponse(401, {
          success: false,
          message: "Invalid token",
        });

      if (!quizId || !username || typeof score !== "number" || score < 0)
        return sendResponse(400, {
          message: "Something is missing or score is below 0",
        });

      const leaderboardId = `${quizId}_${username}`;

      const params = {
        TableName: "Leaderboard",
        Key: {
          leaderboardId: leaderboardId,
          user: username,
        },
      };

      const existingEntry = await db.get(params).promise();

      if (existingEntry.Item) {
        const updatedScore = existingEntry.Item.score + score;

        const updateParams = {
          TableName: "Leaderboard",
          Key: {
            leaderboardId: `${quizId}_${username}`,
          },
          UpdateExpression: "SET score = :score",
          ExpressionAttributeValues: {
            ":score": updatedScore,
          },
          ReturnValues: "ALL_NEW",
        };

        const updatedEntry = await db.update(updateParams).promise();
        return updatedEntry.Attributes;
      } else {
        const newItem = {
          TableName: "Leaderboard",
          Item: {
            leaderboardId: `${quizId}_${username}`,
            quizId: quizId,
            user: username,
            score: score,
          },
        };

        await db.put(newItem).promise();
      }

      return sendResponse(200, {
        success: true,
        message: "Score updated",
      });
    } catch (error) {
      let message =
        error?.details?.message || error?.message || "Something went wrong";
      return sendResponse(400, { error: message });
    }
  });
