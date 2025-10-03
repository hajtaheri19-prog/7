"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Share2, Copy, ExternalLink, MessageCircle, Send, Link2, Image, Video, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Social media platforms
const SOCIAL_PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'واتساپ',
    icon: '📱',
    color: 'from-green-500 to-emerald-500',
    url: 'https://wa.me/?text=',
    maxLength: 4096
  },
  {
    id: 'telegram',
    name: 'تلگرام',
    icon: '✈️',
    color: 'from-blue-500 to-cyan-500',
    url: 'https://t.me/share/url?url=',
    maxLength: 4096
  },
  {
    id: 'instagram',
    name: 'اینستاگرام',
    icon: '📸',
    color: 'from-pink-500 to-purple-500',
    url: 'https://www.instagram.com/',
    maxLength: 2200
  },
  {
    id: 'twitter',
    name: 'توییتر',
    icon: '🐦',
    color: 'from-blue-400 to-blue-600',
    url: 'https://twitter.com/intent/tweet?text=',
    maxLength: 280
  },
  {
    id: 'facebook',
    name: 'فیس‌بوک',
    icon: '👥',
    color: 'from-blue-600 to-blue-800',
    url: 'https://www.facebook.com/sharer/sharer.php?u=',
    maxLength: 63206
  },
  {
    id: 'linkedin',
    name: 'لینکدین',
    icon: '💼',
    color: 'from-blue-700 to-blue-900',
    url: 'https://www.linkedin.com/sharing/share-offsite/?url=',
    maxLength: 3000
  },
  {
    id: 'reddit',
    name: 'ردیت',
    icon: '🤖',
    color: 'from-orange-500 to-red-500',
    url: 'https://reddit.com/submit?url=',
    maxLength: 40000
  },
  {
    id: 'pinterest',
    name: 'پینترست',
    icon: '📌',
    color: 'from-red-500 to-pink-500',
    url: 'https://pinterest.com/pin/create/button/?url=',
    maxLength: 500
  }
];

export default function SocialMediaSharing() {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [shareResults, setShareResults] = useState<any[]>([]);
  
  const { toast } = useToast();

  const generateShareLinks = () => {
    if (!text.trim() && !url.trim()) {
      toast({
        title: "محتوای خالی",
        description: "لطفاً متن یا لینک را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    const results = selectedPlatforms.map(platformId => {
      const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
      if (!platform) return null;

      let shareText = text;
      let shareUrl = url;

      // Add hashtags if provided
      if (hashtags.trim()) {
        const tags = hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
        const hashtagString = tags.map(tag => `#${tag.replace('#', '')}`).join(' ');
        shareText += (shareText ? ' ' : '') + hashtagString;
      }

      // Truncate text if exceeds platform limit
      if (shareText.length > platform.maxLength) {
        shareText = shareText.substring(0, platform.maxLength - 3) + '...';
      }

      // Generate share URL based on platform
      let shareLink = '';
      const encodedText = encodeURIComponent(shareText);
      const encodedUrl = encodeURIComponent(shareUrl);

      switch (platform.id) {
        case 'whatsapp':
          shareLink = `${platform.url}${encodedText}${shareUrl ? ' ' + encodedUrl : ''}`;
          break;
        case 'telegram':
          shareLink = `${platform.url}${encodedUrl}&text=${encodedText}`;
          break;
        case 'twitter':
          shareLink = `${platform.url}${encodedText}${shareUrl ? ' ' + encodedUrl : ''}`;
          break;
        case 'facebook':
          shareLink = `${platform.url}${encodedUrl}${shareText ? '&quote=' + encodedText : ''}`;
          break;
        case 'linkedin':
          shareLink = `${platform.url}${encodedUrl}${shareText ? '&summary=' + encodedText : ''}`;
          break;
        case 'reddit':
          shareLink = `${platform.url}${encodedUrl}&title=${encodedText}`;
          break;
        case 'pinterest':
          shareLink = `${platform.url}${encodedUrl}${shareText ? '&description=' + encodedText : ''}`;
          break;
        case 'instagram':
          // Instagram doesn't support direct sharing, provide copy text
          shareLink = 'copy';
          break;
        default:
          shareLink = `${platform.url}${encodedText}`;
      }

      return {
        platform,
        shareText,
        shareUrl,
        shareLink,
        characterCount: shareText.length,
        isOverLimit: shareText.length > platform.maxLength
      };
    }).filter(Boolean);

    setShareResults(results);
  };

  const copyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "کپی شد",
        description: `متن ${platform} کپی شد`,
      });
    } catch (error) {
      toast({
        title: "خطا در کپی",
        description: "امکان کپی وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const openShareLink = (shareLink: string, platform: string) => {
    if (shareLink === 'copy') {
      copyToClipboard(text + (url ? ' ' + url : ''), platform);
      return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const selectAllPlatforms = () => {
    setSelectedPlatforms(SOCIAL_PLATFORMS.map(p => p.id));
  };

  const clearAllPlatforms = () => {
    setSelectedPlatforms([]);
  };

  const resetForm = () => {
    setText('');
    setUrl('');
    setHashtags('');
    setSelectedPlatforms([]);
    setShareResults([]);
  };

  const getCharacterCountColor = (count: number, maxLength: number) => {
    const percentage = (count / maxLength) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/40 to-purple-500/20 shadow-[0_0_18px_#3b82f655] flex items-center justify-center">
            <Share2 className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">اشتراک‌گذاری شبکه‌های اجتماعی</div>
            <div className="text-sm text-foreground/70">اشتراک‌گذاری محتوا در پلتفرم‌های مختلف</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Content Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>متن برای اشتراک‌گذاری</Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="متن خود را اینجا بنویسید..."
              className="min-h-[120px] resize-none"
            />
            <div className="text-xs text-foreground/60">
              تعداد کاراکترها: {text.length}
            </div>
          </div>

          <div className="space-y-2">
            <Label>لینک (اختیاری)</Label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>هشتگ‌ها (اختیاری)</Label>
            <Input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="تکنولوژی، برنامه‌نویسی، وب"
            />
            <div className="text-xs text-foreground/60">
              هشتگ‌ها را با کاما جدا کنید
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>انتخاب پلتفرم‌ها</Label>
            <div className="flex gap-2">
              <Button onClick={selectAllPlatforms} variant="outline" size="sm">
                انتخاب همه
              </Button>
              <Button onClick={clearAllPlatforms} variant="outline" size="sm">
                پاک کردن
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SOCIAL_PLATFORMS.map((platform) => (
              <motion.div
                key={platform.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? `bg-gradient-to-r ${platform.color} border-transparent text-white`
                    : 'bg-black/20 border-primary/20 hover:border-primary/40'
                }`}
                onClick={() => {
                  setSelectedPlatforms(prev => 
                    prev.includes(platform.id)
                      ? prev.filter(id => id !== platform.id)
                      : [...prev, platform.id]
                  );
                }}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{platform.icon}</div>
                  <div className="text-sm font-medium">{platform.name}</div>
                  <div className="text-xs opacity-70">
                    حداکثر {platform.maxLength} کاراکتر
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <Button 
            onClick={generateShareLinks}
            disabled={selectedPlatforms.length === 0}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold h-12 px-8"
          >
            <Share2 className="w-5 h-5 mr-2" />
            تولید لینک‌های اشتراک‌گذاری
          </Button>
        </div>

        {/* Share Results */}
        <AnimatePresence>
          {shareResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-blue-300">لینک‌های اشتراک‌گذاری</h3>
                <Button onClick={resetForm} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  پاک کردن همه
                </Button>
              </div>

              <div className="space-y-3">
                {shareResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl border ${
                      result.isOverLimit 
                        ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30'
                        : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{result.platform.icon}</div>
                        <div>
                          <div className="font-bold text-foreground">{result.platform.name}</div>
                          <div className={`text-sm ${getCharacterCountColor(result.characterCount, result.platform.maxLength)}`}>
                            {result.characterCount}/{result.platform.maxLength} کاراکتر
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(result.shareText, result.platform.name)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openShareLink(result.shareLink, result.platform.name)}
                          className={`bg-gradient-to-r ${result.platform.color}`}
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-foreground/90 bg-black/20 p-3 rounded-lg">
                        {result.shareText}
                      </div>
                      {result.shareUrl && (
                        <div className="text-xs text-blue-300 bg-blue-500/10 p-2 rounded">
                          {result.shareUrl}
                        </div>
                      )}
                    </div>

                    {result.isOverLimit && (
                      <div className="mt-2 text-xs text-red-300 bg-red-500/10 p-2 rounded">
                        ⚠️ متن از حد مجاز این پلتفرم بیشتر است
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {shareResults.length === 0 && (
          <div className="text-center py-8 text-foreground/60 space-y-2">
            <Share2 className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <p>متن و پلتفرم‌های مورد نظر را انتخاب کنید</p>
            <p className="text-sm">لینک‌های اشتراک‌گذاری برای شبکه‌های اجتماعی مختلف تولید می‌شود</p>
          </div>
        )}

        {/* Tips */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
          <h4 className="text-sm font-bold text-yellow-300 mb-2">نکات:</h4>
          <ul className="text-xs text-foreground/70 space-y-1">
            <li>• هر پلتفرم محدودیت کاراکتر خاص خود را دارد</li>
            <li>• هشتگ‌ها به صورت خودکار اضافه می‌شوند</li>
            <li>• برای اینستاگرام، متن کپی می‌شود (بدون لینک مستقیم)</li>
            <li>• لینک‌ها در پنجره جدید باز می‌شوند</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
