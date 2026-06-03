import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoRepository } from 'src/modules/repositories/video.repository';
import { FindAllVideosUseCase } from './use-cases/find-all-video.usecase';
import { FindVideoByIdUseCase } from './use-cases/find-video-by-id.usecase';
import { GetPublicVideosUseCase } from './use-cases/get-public-videos.usecase';
import { GetPrivateVideosUseCase } from './use-cases/get-private-videos.usecase';
import { GetAllowedVideosUseCase } from './use-cases/get-allowed-videos.usecase';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VideoController],
  providers: [
    VideoRepository,
    FindAllVideosUseCase,
    FindVideoByIdUseCase,
    GetPublicVideosUseCase,
    GetPrivateVideosUseCase,
    GetAllowedVideosUseCase,
  ],
})
export class VideoModule {}
