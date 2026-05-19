import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator'

export class DiagnosticSubmitDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  answers!: unknown[]
}
