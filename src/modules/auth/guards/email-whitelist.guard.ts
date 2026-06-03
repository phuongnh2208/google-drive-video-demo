/* eslint-disable */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppException } from 'src/common/execptions/app.exception';
import { AuthError } from '../constants/auth.errors';

@Injectable()
export class EmailWhitelistGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.email) {
      throw new AppException(AuthError.UNAUTHORIZED);
    }
    const allowed = await this.prisma.allowedEmail.findFirst({
      where: { email: user.email, isActive: true },
    });
    if (!allowed) throw new AppException(AuthError.EMAIL_NOT_ALLOWED);
    return true;
  }
}
