import { sendResponse } from "../../responses/index.js";

export const handler = async (event) => {
  try {
    return sendResponse(200, {
      success: true,
    });
  } catch (error) {
    let message =
      error?.details?.message || error?.message || "Something went wrong";
    return sendResponse(400, { error: message });
  }
};
