import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthTokenInfo = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tokenInfo = request['tokenInfo'];
    return data ? tokenInfo?.[data] : tokenInfo;
  },
);
