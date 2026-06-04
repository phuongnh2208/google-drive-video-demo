import { Injectable } from '@nestjs/common';
import {
  IVideoRepository,
  VideoEntity,
} from './types/video.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { AccessLevel } from 'src/generated/prisma/client';

@Injectable()
export class VideoRepository implements IVideoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<VideoEntity[]> {
    return await this.prisma.video.findMany();
  }
  async findById(id: number): Promise<VideoEntity | null> {
    return await this.prisma.video.findUnique({
      where: { id },
    });
  }
  async findByAccessLevel(accessLevel: AccessLevel): Promise<VideoEntity[]> {
    return await this.prisma.video.findMany({
      where: {
        accessLevel: accessLevel,
      },
    });
  }
}
