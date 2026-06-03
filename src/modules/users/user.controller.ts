/* eslint-disable */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetMeUseCase } from './use-cases/get-me.use-case';

type RequestWithUser = {
  user?: {
    sub?: string | number;
    id?: string | number;
  };
};

@Controller('users')
export class UserController {
  constructor(private readonly getMeUseCase: GetMeUseCase) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: RequestWithUser) {
    const userId = Number(req.user?.sub ?? req.user?.id);
    return this.getMeUseCase.executive(userId);
  }
}
