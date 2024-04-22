import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './sign-in-dto';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { JwtAccessAuthGuard } from './jwt/jwt-access.guard';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { AuthEnums } from './auth.enums';
import { JwtRefreshGuard } from './jwt/jwt-refresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.getValidatedUser(signInDto);
    const accessToken = await this.authService.genAccToken(user);
    const refreshToken = await this.authService.getRefreshToken(user);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    // 아래 명령은 프론트에서 자체 처리
    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
    // res.cookie('access_token', accessToken, { httpOnly: true });
    // res.cookie('refresh_token', refreshToken, { httpOnly: true });

    return {
      tokens: [accessToken, refreshToken].toString(), // 토큰 샘플
      message: 'login success',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  @ApiOperation({ summary: '리프레시 토큰 - 접근 토큰 갱신' })
  @ApiBearerAuth('tokens')
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const newAccessToken = (await this.authService.refresh(refreshTokenDto))
        .accessToken;
      // 아래 명령은 프론트에서 자체 처리
      // res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      // res.cookie('access_token', newAccessToken, { httpOnly: true });

      res.send({ newAccessToken });
    } catch (err) {
      throw new UnauthorizedException(AuthEnums.NotExist);
    }
  }

  // @ApiExcludeEndpoint()

  @ApiOperation({ summary: '인증' })
  @ApiBearerAuth('tokens')
  @UseGuards(JwtAccessAuthGuard)
  @Get('authenticate')
  async user(@Req() req: any, @Res() res: Response): Promise<any> {
    const userId: number = Number(req.user.id);
    console.log('userId', userId);
    const verifiedUser = await this.userService.findUserById(userId);
    return res.send(verifiedUser);
  }
  @ApiOperation({ summary: '사용자 정보 조회' })
  @ApiBearerAuth('tokens')
  @UseGuards(JwtAccessAuthGuard)
  @Get('profile/:id')
  async getProfileById(@Param('id') id: string) {
    return await this.authService.getProfile(Number(id));
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('tokens')
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response): Promise<any> {
    await this.userService.removeRefreshToken(req.user.id);
    // 아래 명령은 프론트에서 자체 처리
    // res.clearCookie('access_token');
    // res.clearCookie('refresh_token');

    return res.send({ message: 'logout success' });
  }
}
