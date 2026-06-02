import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { VideoModule } from './modules/videos/video.module';

@Module({
  imports: [PrismaModule, VideoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
