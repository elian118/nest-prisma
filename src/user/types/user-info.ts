import { UserService } from '../user.service';
import { Prisma, PrismaClient } from '@prisma/client';

const userService = new UserService(new PrismaClient());

export type UserInfo = Prisma.PromiseReturnType<typeof userService.getUserInfo>;
