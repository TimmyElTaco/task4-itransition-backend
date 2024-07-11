import jwt from "jsonwebtoken";

export const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.PRIVATE_KEY_JWT, {
    expiresIn: '7d'
  });
}