import { IsString } from 'class-validator';

export class CreateTenancyDto {
  @IsString()
  readonly name: string;
}
