import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAccessAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const user = await this.validateToken(request);
      console.log('user');
      console.log(user);
      request.user = user;
      return user;
    } catch (err) {
      return false;
    }
  }

  private async validateToken(req: any) {
    const tokens = req.headers.authorization.split(`Bearer `)[1];
    const accToken = tokens.split(',')[0];
    const refToken = tokens.split(',')[1];
    console.log(`accToken: ${accToken}`);
    console.log(`refToken: ${refToken}`);
    return await this.jwtService.verify(accToken);
  }
}
