import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateViajeDto } from './dto/create-viaje.dto';
import { UpdateViajeDto } from './dto/update-viaje.dto';

@Injectable()
export class ViajesService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateViajeDto) {
    return this.prisma.viaje.create({
      data: {
        ...dto,
        fechaInicio: new Date(dto.fechaInicio),
        fechaFin: new Date(dto.fechaFin),
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.viaje.findMany({
      where: { userId },
      include: { actividades: true },
      orderBy: { fechaInicio: 'asc' },
    });
  }

  async findOne(userId: string, id: string) {
    const viaje = await this.prisma.viaje.findUnique({
      where: { id },
      include: { actividades: true },
    });

    if (!viaje) {
      throw new NotFoundException('Viaje no encontrado');
    }

    if (viaje.userId !== userId) {
      throw new ForbiddenException('No tenés permiso para ver este viaje');
    }

    const gastoTotal = viaje.actividades.reduce(
      (total, actividad) => total + actividad.costo,
      0,
    );

    const hoy = new Date();
    const diasRestantes = Math.ceil(
      (viaje.fechaInicio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
    );

    return { ...viaje, gastoTotal, diasRestantes };
  }

  async update(userId: string, id: string, dto: UpdateViajeDto) {
    await this.findOne(userId, id);

    return this.prisma.viaje.update({
      where: { id },
      data: {
        ...dto,
        fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : undefined,
        fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.viaje.delete({
      where: { id },
    });
  }
}