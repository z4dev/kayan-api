import jwt from "jsonwebtoken";

export const generateToken = async (user, expiresIn) => {
  const JWT_SECRET = process.env.JWT_SECRET || "secret";
  const JWT_EXPIRES_IN = expiresIn;
  if (!user) return null;

  if (user.password) delete user.password;

  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const generatePasswordResetToken = async (email) => {
  const JWT_SECRET = process.env.JWT_SECRET || "secret";
  const JWT_EXPIRES_IN = "15m";
  if (!email) return null;

  return jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
