import { IsString, IsOptional, MaxLength } from 'class-validator'

export class ManualEmailVerificationDto {
  @IsOptional()
  @IsString({ message: 'Alasan harus berupa teks' })
  @MaxLength(500, { message: 'Alasan maksimal 500 karakter' })
  reason?: string
}
