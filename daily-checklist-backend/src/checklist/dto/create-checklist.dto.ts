import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChecklistAnswerDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsIn(['Yes', 'No'])
  answer: string;
}

export class CreateChecklistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistAnswerDto)
  answers: ChecklistAnswerDto[];

}
