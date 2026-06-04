export type SocialUserProfile = {
  googleId: string;
  email: string;
  name: string;
  picture: string;
};

export abstract class SocialAuthStrategy {
  abstract verifyToken(token: string): Promise<SocialUserProfile>;
}
