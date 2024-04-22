import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { Request } from 'express';
import { Payload, User } from '../interfaces';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.jwtRefSecret,
      passReqToCallback: true, // validate 첫번째 인자로 req 객체 전달 허용
    });
  }

  async validate(req: Request, payload: Payload) {
    console.log(payload);
    console.log('call validate');
    const tokens = req.get('Authorization').replace('Bearer', '').trim();
    const accessToken = tokens.split(',')[0];
    const refreshToken = tokens.split(',')[1];
    console.log(`accToken: ${accessToken}`);
    console.log(`refToken: ${refreshToken}`);
    const user: User = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
    return user;
  }
}
