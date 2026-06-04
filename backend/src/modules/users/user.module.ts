import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRepository } from '../repositories/user.repository';
import { UserController } from './user.controller';
import { GetMeUseCase } from './use-cases/get-me.use-case';
import { UpsertUserUseCase } from './use-cases/upsert-user.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserRepository, GetMeUseCase, UpsertUserUseCase, AuthGuard],
  exports: [UserRepository, UpsertUserUseCase],
})
export class UserModule {}
