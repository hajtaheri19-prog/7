import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2, Sparkles, Zap, Star } from 'lucide-react';

export default function Loading() {
  const logo = PlaceHolderImages.find(p => p.id === 'logo');

  return (
    <div className="gradient-bg flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center p-10 md:p-12 glass-effect rounded-3xl shadow-2xl flex flex-col items-center gap-6 relative z-10 backdrop-blur-xl border border-white/10 max-w-md w-[90%]">
        {/* Logo with enhanced animation */}
        {logo && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-lg animate-pulse"></div>
            <Image src={logo.imageUrl} width={96} height={96} alt="لوگوی تبدیلا" className="relative z-10 drop-shadow-2xl" />
          </div>
        )}

        {/* Main loading text with enhanced styling */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-primary text-glow">
            <Loader2 className="animate-spin w-8 h-8" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              تبدیلا
            </span>
          </div>
          
          {/* Animated loading dots */}
          <div className="flex items-center gap-2 text-lg text-muted-foreground">
            <span>در حال بارگذاری</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
        </div>

        {/* Feature highlights */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>سریع</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-blue-500" />
            <span>دقیق</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>زیبا</span>
          </div>
        </div>

        {/* Version info without developer name */}
        <div className="text-xs text-muted-foreground/70 mt-2">
          <p>نسخه 1.0.0</p>
        </div>
      </div>
    </div>
  );
}