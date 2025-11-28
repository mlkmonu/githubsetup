import jwt from "jsonwebtoken";
import "dotenv/config";

export const userVerify = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(400).json({
        message: "user is not register",
        recievedBody: req.body,
      });

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "invalid token",
    });
  }
};