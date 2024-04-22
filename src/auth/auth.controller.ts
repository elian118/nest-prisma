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

    // 아래 해더 설정 코드는 프론트에서 토큰을 상태로 관리할 경우, 불필요
    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);

    return {
      message: 'login success',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @ApiBearerAuth('access_token')
  @UseGuards(JwtAccessAuthGuard)
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const newAccessToken = (await this.authService.refresh(refreshTokenDto))
        .newAccessToken;

      res.send({ newAccessToken });
    } catch (err) {
      throw new UnauthorizedException(AuthEnums.NotExist);
    }
  }

  @ApiOperation({ summary: '인증' })
  @ApiBearerAuth('access_token')
  @UseGuards(JwtAccessAuthGuard)
  @Get('authenticate')
  async user(@Req() req: any, @Res() res: Response): Promise<any> {
    const userId: number = Number(req.user.id);
    const verifiedUser = await this.userService.findUserById(userId);
    return res.send(verifiedUser);
  }
  @ApiOperation({ summary: '사용자 정보 조회' })
  @ApiBearerAuth('access_token')
  @UseGuards(JwtAccessAuthGuard)
  @Get('profile/:id')
  async getProfileById(@Param('id') id: string) {
    return await this.authService.getProfile(Number(id));
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('access_token')
  @UseGuards(JwtAccessAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response): Promise<any> {
    await this.userService.removeRefreshToken(req.user.id);

    return res.send({ message: 'logout success' });
  }
}
