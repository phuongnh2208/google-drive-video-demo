import { AccessLevel } from 'src/generated/prisma/client';

export interface VideoEntity {
  id: number;
  title: string;
  driveFileId: string;
  embedUrl: string;
  accessLevel: AccessLevel;
  createAt: Date;
  updatedAt: Date;
}

export interface IVideoRepository {
  findAll(): Promise<VideoEntity[]>;
  findById(id: number): Promise<VideoEntity | null>;
  findByAccessLevel(accessLevel: AccessLevel): Promise<VideoEntity[]>;
}
