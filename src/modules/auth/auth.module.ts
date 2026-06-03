import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthTokenFactory } from './factories/auth-token.factory';
import { AuthGuard } from './guards/auth.guard';
import { EmailWhitelistGuard } from './guards/email-whitelist.guard';
import { GoogleLoginUseCase } from './use-cases/google-login.use-case';
import { GoogleAuthStrategy } from './strategies/google-auth.strategy';
import { SocialAuthStrategy } from './strategies/social-auth.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'jwt_secret_key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleLoginUseCase,
    AuthTokenFactory,
    GoogleAuthStrategy,
    {
      provide: SocialAuthStrategy,
      useClass: GoogleAuthStrategy,
    },
    AuthGuard,
    EmailWhitelistGuard,
  ],
  exports: [
    AuthGuard,
    EmailWhitelistGuard,
    AuthTokenFactory,
    SocialAuthStrategy,
  ],
})
export class AuthModule {}
