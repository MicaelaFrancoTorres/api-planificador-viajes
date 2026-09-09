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
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('viajes/:viajeId/actividades')
@UseGuards(JwtAuthGuard)
export class ActividadesController {
  constructor(private actividadesService: ActividadesService) {}

  @Post()
  create(
    @Req() req: any,
    @Param('viajeId') viajeId: string,
    @Body() dto: CreateActividadDto,
  ) {
    return this.actividadesService.create(req.user.userId, viajeId, dto);
  }

  @Get()
  findAll(@Req() req: any, @Param('viajeId') viajeId: string) {
    return this.actividadesService.findAll(req.user.userId, viajeId);
  }

  @Get(':id')
  findOne(
    @Req() req: any,
    @Param('viajeId') viajeId: string,
    @Param('id') id: string,
  ) {
    return this.actividadesService.findOne(req.user.userId, viajeId, id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('viajeId') viajeId: string,
    @Param('id') id: string,
    @Body() dto: UpdateActividadDto,
  ) {
    return this.actividadesService.update(req.user.userId, viajeId, id, dto);
  }

  @Delete(':id')
  remove(
    @Req() req: any,
    @Param('viajeId') viajeId: string,
    @Param('id') id: string,
  ) {
    return this.actividadesService.remove(req.user.userId, viajeId, id);
  }
}