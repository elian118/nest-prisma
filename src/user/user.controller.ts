import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './dto/user-dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '사용자 목록 가져오기' })
  @Get()
  async getUsers() {
    return this.userService.users({});
  }

  @ApiOperation({ summary: '사용자 정보 가져오기' })
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.user({ id: Number(id) });
  }

  @ApiOperation({ summary: '회원 가입' })
  @Post()
  async signupUser(@Body() userData: UserDto): Promise<User> {
    return this.userService.createUser(userData);
  }
}
