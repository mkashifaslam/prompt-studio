import { IsNotEmpty, IsString } from 'class-validator';

export class UpsertMcpDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  // config validated at runtime via zod schema
}
