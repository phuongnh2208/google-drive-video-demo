import { Injectable } from '@nestjs/common';
import { AppException } from 'src/common/execptions/app.exception';
import { UserRepository } from '../../repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserError } from '../constants/user.errors';

@Injectable()
export class GetMeUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async executive(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppException(UserError.NOT_FOUND);
    }

    return UserMapper.toResponseDto(user);
  }
}
