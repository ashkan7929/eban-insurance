import { IsNotEmpty, IsString } from 'class-validator';

export class TrackingDto {
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  orderNumber: string;
}
