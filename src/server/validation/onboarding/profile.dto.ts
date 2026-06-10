import { IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'

export class OnboardingProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  target_instansi!: string

  @IsInt()
  @Min(0)
  @Max(550)
  target_score!: number

  @IsDateString()
  birth_date!: string

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  province!: string

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  city!: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  institution?: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  major?: string

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string
}
