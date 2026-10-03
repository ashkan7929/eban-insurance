import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { forbidden } from '../errors/AppError.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

interface JwtPayload {
  sub: string;
  mobile: string;
  role: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload | undefined;

    if (!user || !user.role) {
      throw forbidden();
    }

    if (!requiredRoles.includes(user.role)) {
      throw forbidden();
    }

    return true;
  }
}
