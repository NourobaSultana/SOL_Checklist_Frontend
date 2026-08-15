import { IsOptional, IsString } from 'class-validator';

export class CreateDailyExpanseDto {
  @IsOptional()
  @IsString()
  DailyExpanse: string;
}
