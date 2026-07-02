import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/generated/prisma/client';
import { MembershipService } from '../../users/services/membership.service';

@Injectable()
export class AuthTokenFactory {
  constructor(
    private readonly jwtService: JwtService,
    private readonly membershipService: MembershipService,
  ) {}

  async createLoginResponse(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const videoClass = await this.membershipService.getVideoClass(user.email);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        videoClass,
      },
    };
  }
}
