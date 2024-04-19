import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    PostService,
    // { provide: 'CHALK', useValue: chalk },
  ],
})
export class AppModule {}
