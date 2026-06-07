import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator'

export class StartPracticeSessionDto {
  @IsIn(['TWK', 'TIU', 'TKP'])
  category!: 'TWK' | 'TIU' | 'TKP'

  @IsIn(['easy', 'medium', 'hard', 'mixed'])
  difficulty!: 'easy' | 'medium' | 'hard' | 'mixed'

  @IsIn(['QUICK', 'GUIDED'])
  mode!: 'QUICK' | 'GUIDED'

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  question_count?: number
}
