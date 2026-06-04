import { Injectable } from '@nestjs/common';
import { AuthTokenFactory } from '../factories/auth-token.factory';
import { SocialAuthStrategy } from '../strategies/social-auth.strategy';
import { UpsertUserUseCase } from '../../users/use-cases/upsert-user.use-case';
import { GoogleLoginDto } from '../dto/google-login.dto';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly socialAuthStrategy: SocialAuthStrategy,
    private readonly upsertUserUseCase: UpsertUserUseCase,
    private readonly authTokenFactory: AuthTokenFactory,
  ) {}

  async executive(dto: GoogleLoginDto) {
    const googleProfile = await this.socialAuthStrategy.verifyToken(
      dto.idToken,
    );

    const user = await this.upsertUserUseCase.executive({
      googleId: googleProfile.googleId,
      email: googleProfile.email,
      name: googleProfile.name,
      picture: googleProfile.picture,
    });

    return this.authTokenFactory.createLoginResponse(user);
  }
}
