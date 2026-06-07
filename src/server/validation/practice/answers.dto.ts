import { ArrayMaxSize, IsArray } from 'class-validator'

export class PracticeAnswersDto {
  @IsArray()
  @ArrayMaxSize(10)
  answers!: unknown[]
}
