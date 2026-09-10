import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ViajesService } from './viajes.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Viajes')
@ApiBearerAuth()
@Controller('viajes')
@UseGuards(JwtAuthGuard)
export class ViajesController {
  constructor(private viajesService: ViajesService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateViajeDto) {
    return this.viajesService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.viajesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.viajesService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateViajeDto,
  ) {
    return this.viajesService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.viajesService.remove(req.user.userId, id);
  }
}