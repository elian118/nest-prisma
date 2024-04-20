import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessAuthGuard } from './jwt/jwt-access.guard';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule.register({}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
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
