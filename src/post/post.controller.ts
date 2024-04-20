import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from '.prisma/client';
import { PostDto } from './dto/post-dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '발행된 포스트 목록 조회' })
  @Get()
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({ where: { published: true } });
  }

  @ApiOperation({ summary: '포스트 상세 조회' })
  @Get('/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.post({ id: Number(id) });
  }

  @ApiQuery({
    name: 'searchString',
    description: '검색 키워드 입력',
  })
  @ApiOperation({ summary: '포스트 키워드 검색' })
  @Get('/filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      },
    });
  }

  @ApiOperation({ summary: '포스트 생성' })
  @Post()
  async createDraft(@Body() postData: PostDto): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @ApiOperation({ summary: '포스트 발행' })
  @Put('/publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @ApiOperation({ summary: '포스트 삭제' })
  @Delete('/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
