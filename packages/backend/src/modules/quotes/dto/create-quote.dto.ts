import { IsString, IsNotEmpty, IsObject, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  productSlug: string;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsArray()
  breakdown?: Array<{ label: string; value: number }>;

  @IsOptional()
  @IsString()
  userId?: string;
}
