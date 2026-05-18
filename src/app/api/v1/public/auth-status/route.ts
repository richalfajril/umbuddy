import { NextResponse } from 'next/server'
import { googleOAuthStatus } from '@/lib/auth/config'

export async function GET() {
  return NextResponse.json({
    google_oauth: googleOAuthStatus,
  })
}
