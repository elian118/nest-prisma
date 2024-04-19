import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { PostController } from './post/post.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController, PostController],
  providers: [UserService, PostService],
})
export class AppModule {}
