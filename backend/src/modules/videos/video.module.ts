import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoRepository } from 'src/modules/repositories/video.repository';
import { FindAllVideosUseCase } from './use-cases/find-all-video.usecase';
import { FindVideoByIdUseCase } from './use-cases/find-video-by-id.usecase';
import { GetPublicVideosUseCase } from './use-cases/get-public-videos.usecase';
import { GetPrivateVideosUseCase } from './use-cases/get-private-videos.usecase';
import { GetAllowedVideosUseCase } from './use-cases/get-allowed-videos.usecase';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { DriveService } from './drive.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [VideoController],
  providers: [
    VideoRepository,
    FindAllVideosUseCase,
    FindVideoByIdUseCase,
    GetPublicVideosUseCase,
    GetPrivateVideosUseCase,
    GetAllowedVideosUseCase,
    DriveService,
  ],
})
export class VideoModule {}
