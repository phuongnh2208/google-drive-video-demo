import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthTokenFactory } from './factories/auth-token.factory';
import { AuthGuard } from './guards/auth.guard';
import { EmailWhitelistGuard } from './guards/email-whitelist.guard';
import { VideoClassGuard } from './guards/video-class.guard';
import { GoogleLoginUseCase } from './use-cases/google-login.use-case';
import { GoogleAuthStrategy } from './strategies/google-auth.strategy';
import { SocialAuthStrategy } from './strategies/social-auth.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
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
    // Passport JwtStrategy
    JwtStrategy,
    AuthGuard,
    EmailWhitelistGuard,
    VideoClassGuard,
  ],
  exports: [
    AuthGuard,
    EmailWhitelistGuard,
    VideoClassGuard,
    AuthTokenFactory,
    SocialAuthStrategy,
  ],
})
export class AuthModule {}
