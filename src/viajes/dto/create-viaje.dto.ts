import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreateViajeDto {
  @IsString()
  destino: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsOptional()
  @IsNumber()
  presupuesto?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}