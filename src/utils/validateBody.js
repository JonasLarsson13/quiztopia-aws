export const validateAuthInputs = (body) => {
  if (!body?.username || !body?.password)
    return sendResponse(400, {
      error: "Please fill in both username and password",
    });
  if (body?.username < 5)
    return sendResponse(400, {
      error: "Username is to short, should include at least 5 letters",
    });
  if (body?.password < 8)
    return sendResponse(400, {
      error: "Password is to short, should include at least 8 letters",
    });
};
