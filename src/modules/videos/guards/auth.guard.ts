/* eslint-disable */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppException } from 'src/common/execptions/app.exception';
import { VideoError } from '../constants/video.errors';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      throw new AppException(VideoError.UNAUTHORIZED);
    }
    return true;
  }
}
