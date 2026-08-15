import { IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsOptional()
  @IsString()
  appointment: string;
}
