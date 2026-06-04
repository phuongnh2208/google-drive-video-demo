import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class AuthTokenFactory {
  constructor(private readonly jwtService: JwtService) {}

  async createLoginResponse(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    };
  }
}
