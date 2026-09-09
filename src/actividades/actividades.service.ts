import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@Injectable()
export class ActividadesService {
  constructor(private prisma: PrismaService) {}

  private async verificarViajeDelUsuario(userId: string, viajeId: string) {
    const viaje = await this.prisma.viaje.findUnique({
      where: { id: viajeId },
    });

    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }

    if (viaje.userId !== userId) {
      throw new ForbiddenException(
        'No tenés permiso para modificar este viaje',
      );
    }

    return viaje;
  }

  async create(userId: string, viajeId: string, dto: CreateActividadDto) {
    await this.verificarViajeDelUsuario(userId, viajeId);

    return this.prisma.actividad.create({
      data: {
        ...dto,
        fecha: new Date(dto.fecha),
        viajeId,
      },
    });
  }

  async findAll(userId: string, viajeId: string) {
    await this.verificarViajeDelUsuario(userId, viajeId);

    return this.prisma.actividad.findMany({
      where: { viajeId },
      orderBy: { fecha: 'asc' },
    });
  }

  async findOne(userId: string, viajeId: string, id: string) {
    await this.verificarViajeDelUsuario(userId, viajeId);

    const actividad = await this.prisma.actividad.findUnique({
      where: { id },
    });

    if (!actividad || actividad.viajeId !== viajeId) {
      throw new NotFoundException('Actividad no encontrada');
    }

    return actividad;
  }

  async update(
    userId: string,
    viajeId: string,
    id: string,
    dto: UpdateActividadDto,
  ) {
    await this.findOne(userId, viajeId, id);

    return this.prisma.actividad.update({
      where: { id },
      data: {
        ...dto,
        fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      },
    });
  }

  async remove(userId: string, viajeId: string, id: string) {
    await this.findOne(userId, viajeId, id);

    return this.prisma.actividad.delete({
      where: { id },
    });
  }
}