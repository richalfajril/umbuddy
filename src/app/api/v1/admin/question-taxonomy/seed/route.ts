import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionTaxonomyService } from '@/server/admin-question-taxonomy/admin-question-taxonomy.service'

export async function POST() {
  try {
    const session = await AdminAuthService.getCurrentAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const result = await AdminQuestionTaxonomyService.seedDefaultTaxonomy()
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
