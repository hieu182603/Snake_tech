import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password
 * @param password plain text password
 * @param saltRounds optional salt rounds (default 10)
 @returns hashed password
 */
export const hashPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain text password with hashed password
 * @param plain plain text password
 * @param hashed hashed password from DB
 * @returns boolean - true if match
 */
export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(plain, hashed);
};

export default {
  hashPassword,
  comparePassword
};


