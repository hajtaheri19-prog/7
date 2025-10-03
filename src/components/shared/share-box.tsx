"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  FaFacebookF, 
  FaTumblr, 
  FaRedditAlien, 
  FaPinterestP, 
  FaLinkedinIn, 
  FaTelegram, 
  FaWhatsapp, 
  FaXTwitter 
} from 'react-icons/fa6';
import { Copy, Share2, ExternalLink } from 'lucide-react';

interface ShareBoxProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function ShareBox({ 
  title = "این ابزار را با دوستان خود به اشتراک بگذارید", 
  description = "",
  className = "" 
}: ShareBoxProps) {
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Get current URL on client side
    const fullLink = window.location.href;
    setCurrentUrl(fullLink);
    
    const fetchShortLink = async () => {
      try {
        // Try multiple URL shortening services
        const services = [
          `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(fullLink)}`,
          `https://is.gd/create.php?format=simple&url=${encodeURIComponent(fullLink)}`,
        ];

        for (const serviceUrl of services) {
          try {
            const res = await fetch(serviceUrl);
            
            if (serviceUrl.includes('shrtco.de')) {
              const data = await res.json();
              if (data.ok && data.result?.full_short_link) {
                setShortUrl(data.result.full_short_link);
                setIsLoading(false);
                return;
              }
            } else if (serviceUrl.includes('is.gd')) {
              const shortLink = await res.text();
              if (shortLink.startsWith('https://is.gd/')) {
                setShortUrl(shortLink);
                setIsLoading(false);
                return;
              }
            }
          } catch (error) {
            continue; // Try next service
          }
        }
        
        // If all services fail, use original URL
        setShortUrl(fullLink);
        setIsLoading(false);
      } catch (error) {
        setShortUrl(fullLink);
        setIsLoading(false);
      }
    };

    fetchShortLink();
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl || currentUrl);
      toast({
        title: "✨ لینک کپی شد!",
        description: "لینک در کلیپ‌بورد قرار گرفت",
      });
    } catch (error) {
      toast({
        title: "خطا در کپی",
        description: "امکان کپی لینک وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const shareUrl = shortUrl || currentUrl;
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-600 hover:text-white",
      bgColor: "from-blue-500/20 to-blue-600/20 border-blue-500/30"
    },
    {
      name: "X (Twitter)",
      icon: <FaXTwitter />,
      url: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`,
      color: "hover:bg-black hover:text-white",
      bgColor: "from-gray-500/20 to-black/20 border-gray-500/30"
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-700 hover:text-white",
      bgColor: "from-blue-600/20 to-blue-700/20 border-blue-600/30"
    },
    {
      name: "Telegram",
      icon: <FaTelegram />,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`,
      color: "hover:bg-blue-500 hover:text-white",
      bgColor: "from-blue-400/20 to-blue-500/20 border-blue-400/30"
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-green-500 hover:text-white",
      bgColor: "from-green-400/20 to-green-500/20 border-green-400/30"
    },
    {
      name: "Reddit",
      icon: <FaRedditAlien />,
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${shareTitle}`,
      color: "hover:bg-orange-600 hover:text-white",
      bgColor: "from-orange-500/20 to-orange-600/20 border-orange-500/30"
    },
    {
      name: "Pinterest",
      icon: <FaPinterestP />,
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${shareTitle}`,
      color: "hover:bg-red-600 hover:text-white",
      bgColor: "from-red-500/20 to-red-600/20 border-red-500/30"
    },
    {
      name: "Tumblr",
      icon: <FaTumblr />,
      url: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(shareUrl)}&title=${shareTitle}`,
      color: "hover:bg-indigo-600 hover:text-white",
      bgColor: "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`glass-effect rounded-3xl p-6 md:p-8 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border border-yellow-500/20 shadow-[0_0_30px_#eab30822] relative overflow-hidden ${className}`}
    >
      {/* Golden glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5 animate-pulse" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500/50 to-amber-500/30 rounded-full flex items-center justify-center shadow-[0_0_25px_#eab30866] border border-yellow-400/30"
          >
            <Share2 className="w-8 h-8 text-yellow-200 drop-shadow-lg" />
          </motion.div>
          
          <h3 className="text-xl font-bold text-yellow-300 mb-2 text-glow">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-foreground/70 max-w-md mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* URL Display */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-black/30 to-zinc-900/30 border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-yellow-300">لینک اشتراک‌گذاری:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-black/20 rounded-lg border border-yellow-500/10">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-foreground/60"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full"
                    />
                    <span className="text-sm">در حال کوتاه کردن لینک...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-mono text-foreground/90 truncate"
                  >
                    {shareUrl}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Button
              onClick={copyLink}
              size="sm"
              className="bg-gradient-to-r from-yellow-500/80 to-amber-500/80 hover:from-yellow-600 hover:to-amber-600 text-black font-bold shadow-[0_0_15px_#eab30844] border border-yellow-400/30"
            >
              <Copy className="w-4 h-4 mr-1" />
              کپی
            </Button>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {socialPlatforms.map((platform, index) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.15,
                boxShadow: "0 0 20px rgba(234, 179, 8, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center text-lg
                bg-gradient-to-br ${platform.bgColor} backdrop-blur-sm
                transition-all duration-300 ${platform.color}
                border hover:border-yellow-400/50
                shadow-lg hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]
              `}
              title={`اشتراک در ${platform.name}`}
            >
              {platform.icon}
            </motion.a>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-foreground/50">
            با اشتراک‌گذاری این ابزار، به گسترش دانش و کمک به دیگران کمک می‌کنید ✨
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
