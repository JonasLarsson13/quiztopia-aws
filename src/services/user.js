import { db } from "./db.js";

export const getUserByUsername = async (username) => {
  try {
    const params = {
      TableName: "Users",
      FilterExpression: "#username = :usernameValue",
      ExpressionAttributeNames: {
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":usernameValue": username,
      },
    };

    const scanResult = await db.scan(params).promise();

    if (scanResult?.Items?.length === 0) return false;

    return scanResult;
  } catch (error) {
    let message =
      error?.details?.message || error?.message || "Something went wrong";
    return sendResponse(400, { error: message });
  }
};
