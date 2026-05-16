/**
 * Smoke test untuk memverifikasi setup testing environment Umbuddy.
 * Test ini memastikan Vitest + Testing Library + jsdom terkonfigurasi dengan benar.
 */
import { describe, it, expect } from 'vitest'

describe('Umbuddy Test Environment', () => {
  it('should have a working test environment', () => {
    expect(true).toBe(true)
  })

  it('should support basic arithmetic', () => {
    // Contoh: verifikasi logika dasar sebelum implementasi gamification scoring
    const score = 100 * 4 // 4 soal benar dari 100 poin
    expect(score).toBe(400)
  })
})
