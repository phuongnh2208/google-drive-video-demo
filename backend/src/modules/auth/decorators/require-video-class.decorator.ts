import { SetMetadata } from '@nestjs/common';
import { VideoClass } from 'src/generated/prisma/client';

export const REQUIRED_VIDEO_CLASS = 'requiredVideoClass';

export const RequireVideoClass = (videoClass: VideoClass) =>
  SetMetadata(REQUIRED_VIDEO_CLASS, videoClass);
