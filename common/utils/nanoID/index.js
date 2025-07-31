import { customAlphabet } from "nanoid";

const nanoid = (
  len = 10,
  charRange = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
) => {
  return customAlphabet(charRange, len)();
};
export default nanoid;
