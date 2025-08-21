import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePromptDto {
  @IsString() @IsNotEmpty() @MaxLength(160) name!: string;
  @IsString() @IsNotEmpty() content!: string;
  @IsArray() variables: { key: string; description?: string; required?: boolean }[] = [];
  @IsOptional() metadata?: Record<string, any>;
  @IsOptional() @IsInt() @Min(1) version?: number;
  @IsOptional() @IsBoolean() active?: boolean;
}
