import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [ActividadesService],
  controllers: [ActividadesController],
})
export class ActividadesModule {}