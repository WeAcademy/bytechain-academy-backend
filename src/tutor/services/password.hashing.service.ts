import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable() // <-- This is necessary
export class PasswordHashingService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
