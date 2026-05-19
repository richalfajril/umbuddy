import { describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { proxy } from '../../proxy'

vi.mock('next-auth/jwt', () => ({
  getToken: vi.fn(),
}))

describe('U18 onboarding proxy redirects', () => {
  it('redirects protected routes to login without session', async () => {
    vi.mocked(getToken).mockResolvedValue(null)

    const response = await proxy(new NextRequest('http://localhost/dashboard'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/auth/login')
  })

  it('redirects unfinished users to onboarding', async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: 'user-1',
      onboardingRequired: true,
      revoked: false,
    })

    const response = await proxy(new NextRequest('http://localhost/dashboard'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost/onboarding')
  })

  it('redirects completed users away from onboarding to dashboard', async () => {
    vi.mocked(getToken).mockResolvedValue({
      id: 'user-1',
      onboardingRequired: false,
      revoked: false,
    })

    const response = await proxy(new NextRequest('http://localhost/onboarding'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost/dashboard')
  })
})
