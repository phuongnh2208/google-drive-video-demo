import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { VideoClass } from 'src/generated/prisma/client';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async getVideoClass(email: string): Promise<VideoClass | null> {
    const membership = await this.prisma.allowedEmail.findFirst({
      where: { email, isActive: true },
      select: { videoClass: true },
    });
    return membership?.videoClass ?? null;
  }
}
