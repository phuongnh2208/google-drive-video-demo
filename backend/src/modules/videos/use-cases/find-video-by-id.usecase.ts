import { Injectable } from '@nestjs/common';
import { VideoRepository } from 'src/modules/repositories/video.repository';
import { VideoResponseDto } from '../dto/video-response.dto';
import { AppException } from 'src/common/execptions/app.exception';
import { VideoError } from '../constants/video.errors';
import { VideoMapper } from '../mappers/video.mapper';

@Injectable()
export class FindVideoByIdUseCase {
  constructor(private readonly videoRepository: VideoRepository) {}
  async executive(id: number): Promise<VideoResponseDto> {
    if (!id || typeof id !== 'number' || id <= 0)
      throw new AppException(VideoError.INVALID_ID);
    const video = await this.videoRepository.findById(id);
    if (!video) throw new AppException(VideoError.NOT_FOUND);
    return VideoMapper.toResponseDto(video);
  }
}
