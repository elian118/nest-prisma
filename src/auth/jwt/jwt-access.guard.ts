import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const user = await this.validateToken(request); // JWT 검증 및 파싱
      request.user = user;
      return user;
    } catch (err) {
      return false;
    }
  }

  private async validateToken(req: any) {
    const accToken = req.get('Authorization').replace('Bearer', '').trim();
    return await this.jwtService.verify(accToken);
  }
}
