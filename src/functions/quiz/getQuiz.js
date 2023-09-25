import { sendResponse } from "../../responses/index.js";

export const handler = async (event) => {
  try {
    return sendResponse(200, {
      success: true,
    });
  } catch (error) {
    return sendResponse(400, { error: "something went wrong" });
  }
};
