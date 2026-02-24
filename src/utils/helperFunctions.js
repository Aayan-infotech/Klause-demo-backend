import Additive from "../models/additive.model.js";

export const generateOTP = async (length = 6) => {
  let otp = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
};

export const generateUniqueAdditiveId = async () => {
  const lastAdditive = await Additive.findOne({}, { code: 1 })
    .sort({ createdAt: -1 })
    .lean();

  let lastNumber = lastAdditive
    ? parseInt(lastAdditive.code.split(" ")[1])
    : 99;

  const newNumber = lastNumber + 1;

  return `E ${newNumber}`;
};
