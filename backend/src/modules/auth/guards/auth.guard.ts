/* eslint-disable */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { AppException } from 'src/common/execptions/app.exception';
import { AuthError } from '../constants/auth.errors';
@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    if (err) throw err;
    if (!user) throw new AppException(AuthError.UNAUTHORIZED);
    return user as TUser;
  }
}
