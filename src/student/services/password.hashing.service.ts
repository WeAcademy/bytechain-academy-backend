import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PasswordHashingService {
  /**
   * Hashes a plain text password
   * @param password Plain text password to hash
   * @returns Promise resolving to the hashed password
   */
  public abstract hashPassword(password: string): Promise<string>;
  /**
   * Compares a plain text password against a hashed password
   * @param plainTextPassword Plain text password to check
   * @param hashedPassword Hashed password to compare against
   * @returns Promise resolving to boolean indicating if passwords match
   */
  // abstract comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
