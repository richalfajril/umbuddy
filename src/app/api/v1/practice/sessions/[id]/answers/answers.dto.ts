import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator'

export class PracticeAnswersDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  answers!: unknown[]
}
