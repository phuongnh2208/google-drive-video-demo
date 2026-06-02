/* eslint-disable */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppException } from 'src/common/execptions/app.exception';
import { VideoError } from '../constants/video.errors';

@Injectable()
export class EmailWhitelistGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.email) {
      throw new AppException(VideoError.UNAUTHORIZED);
    }
    const allowed = await this.prisma.allowedEmail.findFirst({
      where: { email: user.email, isActive: true },
    });
    if (!allowed) throw new AppException(VideoError.FORBIDDEN_EMAIL);
    return true;
  }
}
