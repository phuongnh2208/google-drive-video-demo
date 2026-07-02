import { Injectable } from '@nestjs/common';
import { VideoRepository } from 'src/modules/repositories/video.repository';
import { VideoResponseDto } from '../dto/video-response.dto';
import { AppException } from 'src/common/execptions/app.exception';
import { VideoError } from '../constants/video.errors';
import { VideoMapper } from '../mappers/video.mapper';
import { DriveService } from '../drive.service';
import { MembershipService } from '../../users/services/membership.service';
import { AccessLevel } from 'src/generated/prisma/client';

@Injectable()
export class GetAllowedVideosUseCase {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly driveService: DriveService,
    private readonly membershipService: MembershipService,
  ) {}

  async executive(userEmail: string): Promise<VideoResponseDto[]> {
    const memberClass = await this.membershipService.getVideoClass(userEmail);
    if (!memberClass) {
      throw new AppException(VideoError.MEMBERSHIP_REQUIRED);
    }

    let videos = await this.videoRepository.findByAccessLevel(
      AccessLevel.ALLOWED,
    );
    if (!videos || videos.length === 0) {
      throw new AppException(VideoError.NOT_FOUND);
    }

    const folderId = this.driveService.getFolderIdForClass(memberClass);
    if (folderId) {
      const fileIdsInFolder =
        await this.driveService.listFileIdsInFolder(folderId);
      videos = videos.filter((video) => fileIdsInFolder.has(video.driveFileId));
      if (videos.length === 0) {
        throw new AppException(VideoError.NOT_FOUND);
      }
    }

    if (folderId) {
      await this.driveService.grantClassFolderAccess(memberClass, userEmail);
    }

    const dtosWithAccess = await Promise.all(
      videos.map(async (video) => {
        await this.driveService.grantAccess(video.driveFileId, userEmail);

        return {
          ...VideoMapper.toResponseDto(video),
          embedUrl: this.driveService.getPreviewUrl(video.driveFileId),
        };
      }),
    );

    return dtosWithAccess;
  }
}
