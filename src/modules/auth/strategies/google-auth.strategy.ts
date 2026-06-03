import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AppException } from 'src/common/execptions/app.exception';
import { AuthError } from 'src/modules/auth/constants/auth.errors';
import { SocialAuthStrategy, SocialUserProfile } from './social-auth.strategy';

@Injectable()
export class GoogleAuthStrategy implements SocialAuthStrategy {
  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyToken(idToken: string): Promise<SocialUserProfile> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new AppException(AuthError.MISSING_EMAIL);
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || '',
        picture: payload.picture || '',
      };
    } catch {
      throw new AppException(AuthError.INVALID_TOKEN);
    }
  }
}
