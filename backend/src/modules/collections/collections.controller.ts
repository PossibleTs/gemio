import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('collections')
@UseGuards(RolesGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @Roles('admin')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get(':col_id')
  @Roles('admin')
  findOne(@Param('col_id') col_id: string) {
    return this.collectionsService.findOne(+col_id);
  }

  @Get(':col_id/assets')
  @Roles('admin')
  getAssetsFromCollection(@Param('col_id') col_id: string) {
    return this.collectionsService.getAssetsFromCollection(+col_id);
  }
}
