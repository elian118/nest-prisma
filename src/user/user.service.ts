import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { AuthEnums } from '../auth/auth.enums';
import { User as UserRes } from '../auth/interfaces/user';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaClient,
    private configService: ConfigService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({ where: userWhereUniqueInput });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, where, take, cursor, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const saltRounds = 10; // 솔트 반복 횟수 (값이 클수록 암호화 강도 높아짐)
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser: Prisma.UserCreateInput = {
      ...data,
      password: hashedPassword,
    };

    return this.prisma.user.create({ data: newUser });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { data, where } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = ''; //await this.prisma.user({where: {}});
    if (!user) {
      throw new NotFoundException(AuthEnums.NotExist);
    }
    return '';
  }

  async getUserInfo(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });
  }

  async findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        currentRefreshToken: true,
        currentRefreshTokenExp: true,
      },
    });
  }

  async setCurrentRefreshToken(refreshToken: string, id: any) {
    const currentRefreshToken =
      await this.getCurrentHashedRefreshToken(refreshToken);
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.prisma.user.update({
      data: { currentRefreshToken, currentRefreshTokenExp },
      where: { id },
    });
  }

  private async getCurrentHashedRefreshToken(refreshToken: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(refreshToken, saltOrRounds);
  }

  private async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();
    return new Date(
      currentDate.getTime() +
        parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')),
    );
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<UserRes> {
    const user: UserRes = await this.findUserById(userId);

    if (!user.currentRefreshToken) {
      return null;
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: any): Promise<void> {
    await this.prisma.user.update({
      data: {
        currentRefreshToken: null,
        currentRefreshTokenExp: null,
      },
      where: { id: Number(userId) },
    });
  }
}
