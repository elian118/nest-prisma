import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessAuthGuard } from './jwt/jwt-access.guard';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.jwtAccSecret,
      signOptions: {
        expiresIn: jwtConstants.jwtAccExpTime,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtRefreshStrategy,
    JwtAccessAuthGuard,
    JwtRefreshGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
