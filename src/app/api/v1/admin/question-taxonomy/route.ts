import { NextResponse } from 'next/server'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminQuestionTaxonomyService } from '@/server/admin-question-taxonomy/admin-question-taxonomy.service'

export async function GET() {
  try {
    const session = await AdminAuthService.getCurrentAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const taxonomy = await AdminQuestionTaxonomyService.getTaxonomyTree()
    return NextResponse.json({ taxonomy })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
