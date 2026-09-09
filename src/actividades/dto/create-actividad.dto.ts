import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateActividadDto {
  @IsString()
  nombre: string;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsNumber()
  costo?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}