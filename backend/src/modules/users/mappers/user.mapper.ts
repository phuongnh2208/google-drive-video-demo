import { User, VideoClass } from 'src/generated/prisma/client';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toResponseDto(
    user: User,
    videoClass: VideoClass | null = null,
  ): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createAt: user.createAt,
      videoClass,
    };
  }
}
