import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AuthTokenInfo } from 'src/common/decorators/auth-token-info.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PostMessageDto } from './dto/post-message.dto';

@Controller('assets')
@UseGuards(RolesGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('request')
  @Roles('owner')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  createRequest(
    @Body() createAssetDto: CreateAssetDto,
    @AuthTokenInfo('usr_com_id') usr_com_id: number,
  ) {
    return this.assetsService.createRequest(createAssetDto, usr_com_id);
  }

  @Get('requests')
  @Roles('admin', 'owner', 'maintainer')
  findAllRequests(@AuthTokenInfo() authUserInfo) {
    return this.assetsService.findAllRequests(authUserInfo);
  }

  @Get('request/:id')
  @Roles('admin', 'owner')
  findOneRequest(@Param('id') id: string, @AuthTokenInfo() authUserInfo) {
    return this.assetsService.findOneRequest(+id, authUserInfo);
  }

  @HttpCode(HttpStatus.OK)
  @Post('request/:id/approve')
  @Roles('admin')
  approveRequest(@Param('id') id: string) {
    return this.assetsService.approveRequest(+id);
  }

  @Post(':ass_id/permission')
  @Roles('owner')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  createPermission(
    @Param('ass_id') ass_id: string,
    @Body() createPermissionDto: CreatePermissionDto,
    @AuthTokenInfo() authUserInfo,
  ) {
    return this.assetsService.createPermission(
      +ass_id,
      createPermissionDto,
      authUserInfo,
    );
  }

  @Get(':ass_id/permissions')
  @Roles('owner')
  findAllPermissions(
    @Param('ass_id') ass_id: string,
    @AuthTokenInfo() authUserInfo,
  ) {
    return this.assetsService.findAllPermissions(+ass_id, authUserInfo);
  }

  @Delete(':ass_id/permission/:map_id')
  @Roles('owner')
  deletePermission(
    @Param('ass_id') ass_id: string,
    @Param('map_id') map_id: string,
    @AuthTokenInfo() authUserInfo,
  ) {
    return this.assetsService.deletePermission(+ass_id, +map_id, authUserInfo);
  }

  @Post(':ass_id/message')
  @Roles('maintainer')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  postMessage(
    @Param('ass_id') ass_id: string,
    @Body() postMessageDto: PostMessageDto,
    @AuthTokenInfo() authUserInfo,
  ) {
    return this.assetsService.postMessage(
      +ass_id,
      postMessageDto,
      authUserInfo,
    );
  }

  @Get(':ass_id/messages')
  @Roles('owner', 'maintainer')
  getMessages(@Param('ass_id') ass_id: string, @AuthTokenInfo() authUserInfo) {
    return this.assetsService.getMessages(+ass_id, authUserInfo);
  }
}
