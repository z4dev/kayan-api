import jwt from "jsonwebtoken";

// Generates access token
export const generateToken = async (user, expiresIn = "7d") => {
  const JWT_SECRET = process.env.JWT_SECRET || "secret";

  if (!user) return null;
  if (user.password) delete user.password;

  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn,
  });
};

export const generatePasswordResetToken = async (email, expiresIn = "15m") => {
  const JWT_SECRET = process.env.JWT_SECRET || "secret";

  if (!email) return null;

  return jwt.sign({ email }, JWT_SECRET, { expiresIn });
};
