/* eslint-disable */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'prisma/prisma.service';
import { VideoClass } from 'src/generated/prisma/client';
import { AppException } from 'src/common/execptions/app.exception';
import { AuthError } from '../constants/auth.errors';
import { REQUIRED_VIDEO_CLASS } from '../decorators/require-video-class.decorator';

@Injectable()
export class VideoClassGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredClass = this.reflector.get<VideoClass>(
      REQUIRED_VIDEO_CLASS,
      context.getHandler(),
    );
    if (!requiredClass) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user?.email) {
      throw new AppException(AuthError.UNAUTHORIZED);
    }

    const membership = await this.prisma.allowedEmail.findFirst({
      where: { email: user.email, isActive: true },
    });
    if (!membership) {
      throw new AppException(AuthError.EMAIL_NOT_ALLOWED);
    }
    if (membership.videoClass !== requiredClass) {
      throw new AppException(AuthError.WRONG_VIDEO_CLASS);
    }

    return true;
  }
}
