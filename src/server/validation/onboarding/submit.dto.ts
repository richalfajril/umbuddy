import { ArrayMaxSize, IsArray } from 'class-validator'

export class DiagnosticSubmitDto {
  @IsArray()
  @ArrayMaxSize(15)
  answers!: unknown[]
}
