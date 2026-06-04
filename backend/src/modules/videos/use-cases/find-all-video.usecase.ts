import { Injectable } from '@nestjs/common';
import { VideoRepository } from 'src/modules/repositories/video.repository';
import { VideoResponseDto } from '../dto/video-response.dto';
import { AppException } from 'src/common/execptions/app.exception';
import { VideoError } from '../constants/video.errors';
import { VideoMapper } from '../mappers/video.mapper';

@Injectable()
export class FindAllVideosUseCase {
  constructor(private readonly videoRepository: VideoRepository) {}
  async executive(): Promise<VideoResponseDto[]> {
    const videos = await this.videoRepository.findAll();
    if (!videos || videos.length === 0)
      throw new AppException(VideoError.NOT_FOUND);
    return VideoMapper.toResponseDtoArray(videos);
  }
}
