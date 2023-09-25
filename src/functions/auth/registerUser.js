import { db } from "../../services/db.js";
import { sendResponse } from "../../responses/index.js";
import { nanoid } from "nanoid";
import { signJwtToken } from "../../utils/jwt.js";
import { validateAuthInputs } from "../../utils/validateBody.js";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    validateAuthInputs(body);

    const user = { ...body, points: 0, userId: `USR${nanoid()}` };
    const token = signJwtToken(user);

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
