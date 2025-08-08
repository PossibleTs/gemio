import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CompaniesService } from 'src/modules/companies/companies.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly companiesService: CompaniesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const secret = await this.configService.get<string>('JWT_SECRET');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('É necessário se autenticar no sistema');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      request['tokenInfo'] = payload;
    } catch {
      throw new UnauthorizedException('É necessário se autenticar no sistema');
    }

    const usr_permission =
      request.tokenInfo.usr_permission === 'admin'
        ? 'admin'
        : (await this.companiesService.findOne(request.tokenInfo.usr_com_id))
            ?.com_type;

    if (!usr_permission) {
      throw new UnauthorizedException(
        'O usuário autenticado não tem permissão para essa funcionalidade',
      );
    }

    if (!requiredRoles.includes(usr_permission)) {
      throw new ForbiddenException(
        'O usuário autenticado não tem permissão para essa funcionalidade',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
