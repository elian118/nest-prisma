import { ApiProperty } from '@nestjs/swagger';
import { SignInDto } from '../../auth/sign-in-dto';

export class UserDto extends SignInDto {
  // @ApiProperty({
  //   example: 'test@naver.com',
  //   description: '사용자 이메일',
  // })
  // email: string;
  // @ApiProperty({
  //   example: '!password@',
  //   description: '사용자 비밀번호',
  // })
  // password: string;
  @ApiProperty({
    example: 'test',
    description: '사용자 이름',
  })
  name?: string;
}
