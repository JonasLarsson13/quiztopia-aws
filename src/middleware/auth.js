import jwt from "jsonwebtoken";
import { sendResponse } from "../responses/index.js";

export const validateToken = {
  before: async (request) => {
    try {
      const token = request.event.headers.Authorization.replace("Bearer ", "");

      if (!token)
        return sendResponse(400, {
          success: false,
          message: "No token provided",
        });

      const data = jwt.verify(token, "secret");
      request.event.userId = data.userId;
      request.event.username = data.username;

      return request.response;
    } catch (error) {
      request.event.error = "401";

      return request.response;
    }
  },
  onError: async (request) => {
    request.event.error = "401";
    return request.response;
  },
};
