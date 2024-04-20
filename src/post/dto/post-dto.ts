import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({
    example: '대한민국 헌법 1조 1항',
    description: '포스트 제목',
  })
  title: string;
  @ApiProperty({
    example: '대한민국은 민주공화국이다.',
    description: '포스트 내용',
  })
  content?: string;
  @ApiProperty({
    example: 'test@naver.com',
    description: '포스트 저자 이메일',
  })
  authorEmail: string;
}
