import { NextResponse } from 'next/server'
import { AuthService } from '@/services/auth.service'

/**
 * API Route: /api/v1/auth/register
 * 
 * Sesuai AGENTS.md: "Seluruh endpoint REST wajib memiliki rute dengan awalan /api/v1/."
 * Sesuai U1_Authentication.md: "Registration flow via Email/Password."
 */
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter' },
        { status: 400 }
      )
    }

    const user = await AuthService.registerUser({ name, email, password })

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Registration API error:', error)
    
    const message = error instanceof Error ? error.message : ''
    if (message === 'Email sudah terdaftar') {
      return NextResponse.json({ error: message }, { status: 409 })
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat pendaftaran' },
      { status: 500 }
    )
  }
}
