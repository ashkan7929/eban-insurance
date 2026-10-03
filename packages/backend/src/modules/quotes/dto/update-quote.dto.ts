import { IsOptional, IsObject, IsNumber, IsString } from 'class-validator';

export class UpdateQuoteDto {
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
