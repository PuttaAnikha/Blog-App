import jwt from "jsonwebtoken";
import { config } from "dotenv";
const { verify } = jwt;
config();

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get token from cookie OR authorization header
      let token = req.cookies?.token;

      // If no cookie, check authorization header (Bearer token)
      if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
      }

      // Check token existed or not
      if (!token) {
        return res.status(401).json({ message: "Please login first" });
      }
      //validate token(decode the token)
      let decodedToken = verify(token, process.env.SECRET_KEY);

      // check the role is same as role in decodedToken
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "You are not authorized" });
      }
      //add decoded token
      req.user = decodedToken;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};