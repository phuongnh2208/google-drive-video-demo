import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IUserRepository } from './types/user.repository.interface';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async upsertGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
    picture: string;
  }): Promise<User> {
    return this.prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        picture: data.picture,
      },
      create: {
        googleId: data.googleId,
        email: data.email,
        name: data.name,
        picture: data.picture,
      },
    });
  }
}
