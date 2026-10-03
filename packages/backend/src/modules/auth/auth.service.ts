import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import {
  generateNumericOtp,
  normalizeMobile,
  isValidIranianMobile,
} from '../../shared/utils/generators';
import { badRequest, unauthorized } from '../../shared/errors/AppError';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async sendOtp(mobile: string) {
    if (!mobile || typeof mobile !== 'string' || mobile.trim().length === 0) {
      throw badRequest('Mobile number is required');
    }
    const normalized = normalizeMobile(mobile);
    if (!isValidIranianMobile(normalized)) {
      throw badRequest('Invalid Iranian mobile number');
    }

    const code = generateNumericOtp(6);
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this.prisma.otpCode.deleteMany({
      where: { mobile: normalized },
    });

    await this.prisma.otpCode.create({
      data: {
        mobile: normalized,
        code,
        expires_at: expiresAt,
      },
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[OTP] Mobile: ${normalized}, Code: ${code}`);
    }

    return { message: 'OTP sent', expiresIn: 120 };
  }

  async verifyOtp(mobile: string, code: string): Promise<AuthResponse> {
    if (!mobile || typeof mobile !== 'string' || mobile.trim().length === 0 ||
        !code || typeof code !== 'string' || code.trim().length === 0) {
      throw unauthorized('Mobile and code are required');
    }
    const normalized = normalizeMobile(mobile);

    const otpCode = await this.prisma.otpCode.findFirst({
      where: { mobile: normalized },
      orderBy: { created_at: 'desc' },
    });

    if (!otpCode) {
      throw unauthorized('Invalid or expired OTP');
    }

    if (otpCode.used_at) {
      throw unauthorized('OTP already used');
    }

    if (otpCode.expires_at < new Date()) {
      throw unauthorized('OTP expired');
    }

    if (otpCode.code !== code) {
      throw unauthorized('Invalid OTP code');
    }

    await this.prisma.otpCode.update({
      where: { id: otpCode.id },
      data: { used_at: new Date() },
    });

    const user = await this.prisma.user.upsert({
      where: { mobile: normalized },
      create: { mobile: normalized },
      update: {},
    });

    const payload = {
      sub: user.id,
      mobile: user.mobile,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    });

    return { accessToken, user };
  }
}
