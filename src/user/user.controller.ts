import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './dto/user-dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.users({});
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.user({ id: Number(id) });
  }

  @Post()
  async signupUser(@Body() userData: UserDto): Promise<User> {
    return this.userService.createUser(userData);
  }
}
