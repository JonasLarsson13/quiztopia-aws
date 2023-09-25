import jwt from "jsonwebtoken";

export const signJwtToken = (user) => {
  const token = jwt.sign(
    {
      userId: user.userId,
      username: user.username,
    },
    "secret",
    { expiresIn: "1h" }
  );
  return token;
};
