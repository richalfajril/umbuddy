import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'

export class SupportNoteDto {
  @IsString({ message: 'Catatan harus berupa teks' })
  @MinLength(3, { message: 'Catatan minimal 3 karakter' })
  @MaxLength(1000, { message: 'Catatan maksimal 1000 karakter' })
  note!: string

  @IsOptional()
  @IsString({ message: 'Kategori harus berupa teks' })
  category?: string
}
