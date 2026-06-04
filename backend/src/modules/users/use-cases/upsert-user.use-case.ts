import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UpsertUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async executive(data: {
    googleId: string;
    email: string;
    name: string;
    picture: string;
  }) {
    return this.userRepository.upsertGoogleUser(data);
  }
}
