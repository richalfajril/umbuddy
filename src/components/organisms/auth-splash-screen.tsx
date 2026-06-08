import * as React from 'react'

interface AuthSplashScreenProps {
  isProcessingSuccess: boolean
  progress: number
  loadingText?: string
}

export function AuthSplashScreen({
  isProcessingSuccess,
  progress,
  loadingText = 'Menyiapkan markas Cambies...',
}: AuthSplashScreenProps) {
  const [isMobile, setIsMobile] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Cek mobile untuk memastikan video loading screen di-mute di mobile agar bisa autoplay
  React.useEffect(() => {
    const checkMobile = () => {
      return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
    }
    const timeout = setTimeout(() => setIsMobile(checkMobile()), 0)
    return () => clearTimeout(timeout)
  }, [])

  // Auto-play video saat sukses agar transisi instan
  React.useEffect(() => {
    if (isProcessingSuccess && videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }, [isProcessingSuccess])

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col bg-background overflow-hidden transition-opacity duration-500 ${isProcessingSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Video Area (Fullscreen appearance adjusting to available height) */}
      <div className="flex-1 relative overflow-hidden">
        <video 
          ref={videoRef}
          src="/mascot/mascot_running_video.webm" 
          preload="auto"
          loop 
          playsInline
          muted={isMobile}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      {/* Footer Progress Bar */}
      <div className="bg-background border-t border-border p-6 sm:p-8 flex flex-col justify-center space-y-4 relative z-10">
        <div className="text-center mb-1">
          <span className="text-sm font-bold text-primary animate-pulse">{loadingText}</span>
        </div>
        <div className="h-14 w-full max-w-4xl mx-auto bg-muted/30 rounded-2xl overflow-hidden relative border border-border/50 shadow-inner">
          <div 
            className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }} 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black text-white uppercase tracking-widest drop-shadow-md">
              MEMUAT... {progress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
