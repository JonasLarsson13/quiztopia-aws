import { db } from "../../services/db.js";
import { sendResponse } from "../../responses/index.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (!body?.username || !body?.password)
      return sendResponse(400, {
        error: "Please fill in both username and password to create an account",
      });

    const user = { ...body, points: 0, userId: `USR${nanoid()}` };

    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
      },
      "secret",
      { expiresIn: "1h" }
    );

    const params = {
      TableName: "Users",
      Item: user,
    };

    await db.put(params).promise();

    return sendResponse(200, {
      success: true,
      token: token,
    });
  } catch (error) {
    let message =
      error?.details?.message || error?.message || "Something went wrong";
    return sendResponse(400, { error: message });
  }
};
