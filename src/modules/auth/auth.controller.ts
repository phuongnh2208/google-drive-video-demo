import { Body, Controller, Post } from '@nestjs/common';
import { GoogleLoginDto } from './dto/google-login.dto';
import { GoogleLoginUseCase } from './use-cases/google-login.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly googleLoginUseCase: GoogleLoginUseCase) {}

  @Post('google-login')
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return await this.googleLoginUseCase.executive(dto);
  }
}
