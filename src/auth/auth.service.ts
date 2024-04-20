import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userSevice: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(userEmail: string, pass: string): Promise<any> {
    const user = await this.userSevice.getUserInfo(userEmail);
    console.log(user);
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

  async getProfile(id): Promise<any> {
    const user = await this.userSevice.user({ id });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }
}
