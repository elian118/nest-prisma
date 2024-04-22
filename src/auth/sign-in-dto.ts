import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'test3@naver.com',
    description: '사용자 이메일',
  })
  email: string;
  @ApiProperty({
    example: 'ein!@ein34ein',
    description: '사용자 비밀번호',
  })
  password: string;
}
