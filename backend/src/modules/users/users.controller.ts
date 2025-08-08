import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthTokenInfo } from 'src/common/decorators/auth-token-info.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch('edit-profile')
  @Roles('admin', 'owner', 'maintainer')
  async updateProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @AuthTokenInfo() authUserInfo
  ) {
    return this.usersService.updateProfile(updateUserProfileDto, authUserInfo);
  }

  @Patch('edit-password')
  @Roles('admin', 'owner', 'maintainer')
  async updatePassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @AuthTokenInfo() authUserInfo
  ) {
    return this.usersService.updatePassword(updateUserPasswordDto, authUserInfo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
