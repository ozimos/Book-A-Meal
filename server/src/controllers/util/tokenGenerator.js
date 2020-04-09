import jwt from "jsonwebtoken";

export default function tokenGenerator({ isCaterer, id: userId, firstName }) {
    return jwt.sign(
      { isCaterer, userId, firstName },
      process.env.TOKEN_PASSWORD,
      { expiresIn: process.env.TOKEN_EXPIRY || "6h" }
    );
  }