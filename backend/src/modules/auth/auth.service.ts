import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CompaniesService } from 'src/modules/companies/companies.service';

@Injectable()
export class AuthService {
  constructor(
    private companiesService: CompaniesService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(payload) {
    const user = await this.usersService.findOneWhere(
      {
        usr_email: payload.usr_email,
      },
      'full',
    );

    if (!user)
      throw new UnauthorizedException(
        'O usuário não existe ou a senha está errada',
      );

    const passwordValid = bcrypt.compareSync(
      payload.usr_password,
      user.usr_password,
    );
    if (!passwordValid)
      throw new UnauthorizedException(
        'O usuário não existe ou a senha está errada',
      );

    const company =
      user.usr_permission === 'company'
        ? await this.companiesService.findOne(user.usr_com_id)
        : null;

    const payloadSign = {
      usr_id: user.usr_id,
      usr_com_id: user.usr_com_id,
      usr_name: user.usr_name,
      usr_email: user.usr_email,
      usr_permission: user.usr_permission,
      com_type: company?.com_type || null,
    };
    const token = await this.jwtService.signAsync(payloadSign);

    return {
      token: token,
      ...payloadSign,
    };
  }
}
