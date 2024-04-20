import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './sign-in-dto';
import { AuthEnums } from './auth.enums';
import { Payload, User } from './interfaces';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getValidatedUser(signInDto: SignInDto): Promise<User> {
    const user = await this.userService.getUserInfo(signInDto.email);

    if (!user) {
      throw new NotFoundException(AuthEnums.NotExist);
    }

    if (!(await bcrypt.compare(signInDto.password, user.password))) {
      throw new BadRequestException(AuthEnums.WrongPassword);
    }

    return user as User;
  }

  async signIn(userEmail: string, pass: string): Promise<any> {
    const user = await this.userService.getUserInfo(userEmail);

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }

    const { password, id, name, email } = user;

    if (password !== pass) {
      throw new UnauthorizedException('비밀번호가 틀립니다.');
    }
    // JWT 생성
    const payload = { sub: id, username: name, email };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async getProfile(id: number): Promise<any> {
    const user = await this.userService.user({ id });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  async genAccToken(user: User): Promise<string> {
    const payload: Payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return this.jwtService.signAsync(payload);
  }

  async getRefreshToken(user: User): Promise<string> {
    const payload: Payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return this.jwtService.signAsync(
      { id: payload.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      },
    );
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refresh_token } = refreshTokenDto;

    const decodedRefreshToken = this.jwtService.verify(refresh_token, {
      secret: process.env.JWT_REFRESH_SECRET,
    }) as Payload;

    const userId = decodedRefreshToken.id;
    const user = await this.userService.getUserIfRefreshTokenMatches(
      refresh_token,
      Number(userId),
    );
    if (!user) {
      throw new UnauthorizedException(AuthEnums.NotExist);
    }

    const accessToken = await this.genAccToken(user);

    return { accessToken };
  }
}
