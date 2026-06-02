import { VideoEntity } from 'src/modules/repositories/types/video.repository.interface';
import { VideoResponseDto } from '../dto/video-response.dto';

export class VideoMapper {
  static toResponseDto(video: VideoEntity): VideoResponseDto {
    return {
      id: video.id,
      title: video.title,
      driveFileId: video.driveFileId,
      embedUrl: video.embedUrl,
      accessLevel: video.accessLevel,
    };
  }

  static toResponseDtoArray(videos: VideoEntity[]): VideoResponseDto[] {
    return videos.map((video) => this.toResponseDto(video));
  }
}
