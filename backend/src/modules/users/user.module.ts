import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRepository } from '../repositories/user.repository';
import { UserController } from './user.controller';
import { GetMeUseCase } from './use-cases/get-me.use-case';
import { UpsertUserUseCase } from './use-cases/upsert-user.use-case';
import { MembershipService } from './services/membership.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [
    UserRepository,
    GetMeUseCase,
    UpsertUserUseCase,
    MembershipService,
    AuthGuard,
  ],
  exports: [UserRepository, UpsertUserUseCase, MembershipService],
})
export class UserModule {}
