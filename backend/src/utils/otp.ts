import { hashPassword, comparePassword } from './hash.js';

export const generateOTP = (length = 6): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(Math.floor(Math.random() * (max - min + 1) + min));
};

export const hashOTP = async (otp: string): Promise<string> => {
  // reuse hashPassword with lower salt rounds for speed
  return await hashPassword(otp, 8);
};

export const compareOTP = async (otp: string, hashed: string): Promise<boolean> => {
  return await comparePassword(otp, hashed);
};

export default {
  generateOTP,
  hashOTP,
  compareOTP,
};






