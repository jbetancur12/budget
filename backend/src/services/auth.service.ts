import { EntityManager } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User.js';
import { config } from '../config/index.js';
import { UnauthorizedError, ValidationError } from '../utils/errors.js';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor(private em: EntityManager) {}

  async login(
    email: string,
    password: string,
  ): Promise<TokenPair & { user: { id: number; email: string; name: string } }> {
    const user = await this.em.findOne(User, { email });
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const tokens = this.generateTokens(user.id, user.email, user.role);
    user.refreshToken = tokens.refreshToken;
    await this.em.flush();

    return { ...tokens, user: { id: user.id, email: user.email, name: user.name } };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
      userId: number;
      email: string;
      role: string;
    };
    const user = await this.em.findOne(User, { id: payload.userId, refreshToken });

    if (!user) throw new UnauthorizedError('Invalid refresh token');

    const tokens = this.generateTokens(user.id, user.email, user.role);
    user.refreshToken = tokens.refreshToken;
    await this.em.flush();

    return tokens;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.em.findOne(User, userId);
    if (!user) throw new UnauthorizedError('User not found');

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new UnauthorizedError('Current password is incorrect');

    if (newPassword.length < 8)
      throw new ValidationError('New password must be at least 8 characters');

    user.password = await bcrypt.hash(newPassword, 12);
    user.refreshToken = undefined;
    await this.em.flush();
  }

  async logout(userId: number): Promise<void> {
    const user = await this.em.findOne(User, userId);
    if (user) {
      user.refreshToken = undefined;
      await this.em.flush();
    }
  }

  private generateTokens(userId: number, email: string, role: string): TokenPair {
    const accessToken = jwt.sign({ userId, email, role }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign({ userId, email, role }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }
}
