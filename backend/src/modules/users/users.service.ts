import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user.dto';
import { User } from '../../models/user.model';
import { Transaction } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async create(createUserDto: CreateUserDto, transaction?: Transaction) {
    return await this.userModel.create(
      { ...createUserDto },
      {
        transaction: transaction,
      },
    );
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateProfile(updateUserProfileDto: UpdateUserProfileDto, authUserInfo: any) {
    const user = await this.userModel.findByPk(authUserInfo.usr_id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado no sistema');
    }

    if (updateUserProfileDto.usr_email) {
      const existingUser = await this.userModel.findOne({
        where: {
          usr_email: updateUserProfileDto.usr_email,
          usr_id: { [Op.ne]: authUserInfo.usr_id },
        },
      });

      if (existingUser) {
        throw new ConflictException('E-mail já cadastrado no sistema.');
      }
    }

    await user.update(updateUserProfileDto);

    return {
      response: 'Perfil atualizado com sucesso'
    };
  }

  async updatePassword(updateUserPasswordDto: UpdateUserPasswordDto, authUserInfo: any) {
    const user = await this.userModel.findByPk(authUserInfo.usr_id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.usr_password = updateUserPasswordDto.usr_password;
    await user.save();

    return {
      response: 'Senha alterada com sucesso'
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneWhere(where: any, scope?: string) {
    return scope
      ? this.userModel.scope(scope).findOne({
          where: where,
        })
      : this.userModel.findOne({
          where: where,
        });
  }
}
