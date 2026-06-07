'use client'

import * as React from 'react'

export default function PopupCallbackPage() {
  React.useEffect(() => {
    // Pastikan ini berjalan di klien
    if (typeof window === 'undefined') return

    const searchParams = new URLSearchParams(window.location.search)
    const error = searchParams.get('error')
    
    // Kirim pesan ke jendela utama yang membuka popup ini
    if (window.opener) {
      window.opener.postMessage(
        { type: 'OAUTH_CALLBACK', error },
        window.location.origin
      )
      // Tutup jendela popup
      window.close()
    } else {
      // Fallback jika bukan dibuka sebagai popup (misal error window.opener)
      // Kita kembalikan ke halaman login dengan query param yang relevan
      window.location.href = error 
        ? `/auth/login?error=${encodeURIComponent(error)}`
        : `/auth/login?google_success=true`
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground animate-pulse">Menyelesaikan autentikasi...</p>
      </div>
    </div>
  )
}
