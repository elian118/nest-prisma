import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Request } from 'express';
import { Payload, User } from '../interfaces';
import { jwtConstants } from '../constants';

// passport 예시 - 사용 안 함
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.refresh_token,
      ]),
      secretOrKey: jwtConstants.jwtRefSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload) {
    const refreshToken = req.cookies['refresh_token'];
    const user: User = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
    return user;
  }
}
