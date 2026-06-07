import { IsString, MinLength } from 'class-validator'

export class EmailVerifyDto {
  @IsString()
  @MinLength(20)
  token!: string
}
