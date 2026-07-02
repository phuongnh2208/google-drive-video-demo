import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FindAllVideosUseCase } from './use-cases/find-all-video.usecase';
import { FindVideoByIdUseCase } from './use-cases/find-video-by-id.usecase';
import { GetPublicVideosUseCase } from './use-cases/get-public-videos.usecase';
import { GetPrivateVideosUseCase } from './use-cases/get-private-videos.usecase';
import { GetAllowedVideosUseCase } from './use-cases/get-allowed-videos.usecase';
import { AuthGuard } from '../auth/guards/auth.guard';
import { EmailWhitelistGuard } from '../auth/guards/email-whitelist.guard';

@Controller('videos')
export class VideoController {
  constructor(
    private readonly findAllVideoUseCase: FindAllVideosUseCase,
    private readonly findVideoByIdUseCase: FindVideoByIdUseCase,
    private readonly getPublicVideosUseCase: GetPublicVideosUseCase,
    private readonly getPrivateVideosUseCase: GetPrivateVideosUseCase,
    private readonly getAllowedVideosUseCase: GetAllowedVideosUseCase,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.findAllVideoUseCase.executive();
  }

  @Get('public')
  async findPublic() {
    return await this.getPublicVideosUseCase.executive();
  }

  @Get('private')
  @UseGuards(AuthGuard)
  async findPrivate() {
    return await this.getPrivateVideosUseCase.executive();
  }

  @Get('allowed')
  @UseGuards(AuthGuard, EmailWhitelistGuard)
  async findAllowed(@Req() req: any) {
    return await this.getAllowedVideosUseCase.executive(req.user.email);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.findVideoByIdUseCase.executive(Number(id));
  }
}
