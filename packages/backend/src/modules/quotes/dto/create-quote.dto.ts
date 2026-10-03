import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  productSlug: string;

  @IsObject()
  data: Record<string, any>;
}
