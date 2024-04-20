import { ApiProperty } from '@nestjs/swagger';
import { SignInDto } from '../../auth/sign-in-dto';

export class UserDto extends SignInDto {
  @ApiProperty({
    example: 'test',
    description: '사용자 이름',
  })
  name?: string;
}
