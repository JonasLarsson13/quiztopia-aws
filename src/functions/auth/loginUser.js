import { sendResponse } from "../../responses/index.js";
import { getUserByUsername } from "../../services/user.js";
import { signJwtToken } from "../../utils/jwt.js";
import { validateAuthInputs } from "../../utils/validateBody.js";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    validateAuthInputs(body);
    const { username, password } = body;

    const scanResult = await getUserByUsername(username);

    if (
      scanResult.Items.length === 0 ||
      scanResult.Items[0].password !== password
    ) {
      return sendResponse(401, { error: "Authentication failed, try again." });
    }

    const token = signJwtToken(scanResult.Items[0]);

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
