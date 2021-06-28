import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ReadTenancyDto {
  @IsNumber()
  @Expose()
  readonly id: number;

  @IsString()
  @Expose()
  readonly name: string;
}
