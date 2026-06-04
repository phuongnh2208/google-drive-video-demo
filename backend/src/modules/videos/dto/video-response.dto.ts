import { AccessLevel } from 'src/generated/prisma/client';

export class VideoResponseDto {
  id!: number;
  title!: string;
  driveFileId!: string;
  embedUrl!: string;
  accessLevel!: AccessLevel;
}
