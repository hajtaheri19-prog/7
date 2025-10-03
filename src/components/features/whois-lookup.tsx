"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Copy, Download, Globe, Calendar, Building, Server, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface WhoisData {
  domain: string;
  asciiDomain: string;
  owner: string;
  registrar: string;
  registered: string;
  expires: string;
  updated: string;
  nameServers: string[];
  status: string;
  rawData: any;
}

export default function WhoisLookup() {
  const [domain, setDomain] = useState('');
  const [whoisData, setWhoisData] = useState<WhoisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const { toast } = useToast();

  const run = async () => {
    if (!domain.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً نام دامنه را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setWhoisData(null);
    
    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`, { 
        cache: 'no-store' 
      });
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setWhoisData(data);
      toast({
        title: "موفق",
        description: "اطلاعات WHOIS دریافت شد",
      });
    } catch (e: any) {
      toast({
        title: "خطا",
        description: e?.message || 'خطا در دریافت اطلاعات WHOIS',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "کپی شد",
        description: "اطلاعات کپی شد",
      });
    } catch (error) {
      toast({
        title: "خطا در کپی",
        description: "امکان کپی وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const downloadData = () => {
    if (!whoisData) return;
    
    const data = JSON.stringify(whoisData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whois-${domain}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "دانلود شد",
      description: "فایل JSON دانلود شد",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'نامشخص') return 'نامشخص';
    try {
      return new Date(dateString).toLocaleDateString('fa-IR');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/40 to-amber-500/20 shadow-[0_0_18px_#eab30855] flex items-center justify-center">
            <Globe className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">WHOIS دامنه</div>
            <div className="text-sm text-foreground/70">استعلام اطلاعات کامل دامنه</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label className="text-yellow-300 font-semibold">نام دامنه</Label>
              <Input 
                value={domain} 
                onChange={e => setDomain(e.target.value)} 
                dir="ltr" 
                placeholder="مثلاً: google.com یا تبدیللا.ir"
                className="vip-input"
                onKeyPress={(e) => e.key === 'Enter' && run()}
              />
            </div>
            <Button 
              onClick={run} 
              disabled={loading}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold h-10 px-6"
            >
              {loading ? (
                <>
                  <Search className="ml-2 h-4 w-4 animate-spin" />
                  در حال جستجو...
                </>
              ) : (
                <>
                  <Search className="ml-2 h-4 w-4" />
                  جستجو
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {whoisData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(whoisData, null, 2))}
                  variant="outline"
                  className="border-yellow-500/30 hover:bg-yellow-500/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  کپی اطلاعات
                </Button>
                <Button
                  onClick={downloadData}
                  variant="outline"
                  className="border-amber-500/30 hover:bg-amber-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  دانلود JSON
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-purple-500/30 hover:bg-purple-500/20"
                    >
                      {showRawData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {showRawData ? 'مخفی کردن' : 'نمایش کامل'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl glass-effect">
                    <DialogHeader>
                      <DialogTitle>اطلاعات کامل WHOIS</DialogTitle>
                    </DialogHeader>
                    <Textarea 
                      readOnly 
                      dir="ltr" 
                      className="min-h-[400px] font-mono text-sm" 
                      value={JSON.stringify(whoisData.rawData, null, 2)} 
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Domain Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30">
                  <h3 className="text-lg font-bold text-yellow-300 flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5" />
                    اطلاعات پایه
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-yellow-200 font-semibold">دامنه:</span>
                      <span className="text-foreground mr-2">{whoisData.domain}</span>
                    </div>
                    <div>
                      <span className="text-yellow-200 font-semibold">ASCII:</span>
                      <span className="text-foreground mr-2">{whoisData.asciiDomain}</span>
                    </div>
                    <div>
                      <span className="text-yellow-200 font-semibold">وضعیت:</span>
                      <Badge variant="secondary" className="mr-2 bg-green-500/20 text-green-300">
                        {whoisData.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/30">
                  <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2 mb-4">
                    <Building className="w-5 h-5" />
                    اطلاعات مالک
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-200 font-semibold">مالک:</span>
                      <span className="text-foreground mr-2">{whoisData.owner}</span>
                    </div>
                    <div>
                      <span className="text-blue-200 font-semibold">ثبت‌کننده:</span>
                      <span className="text-foreground mr-2">{whoisData.registrar}</span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30">
                  <h3 className="text-lg font-bold text-green-300 flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5" />
                    تاریخ‌ها
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-green-200 font-semibold">تاریخ ثبت:</span>
                      <span className="text-foreground mr-2">{formatDate(whoisData.registered)}</span>
                    </div>
                    <div>
                      <span className="text-green-200 font-semibold">تاریخ انقضا:</span>
                      <span className="text-foreground mr-2">{formatDate(whoisData.expires)}</span>
                    </div>
                    <div>
                      <span className="text-green-200 font-semibold">آخرین بروزرسانی:</span>
                      <span className="text-foreground mr-2">{formatDate(whoisData.updated)}</span>
                    </div>
                  </div>
                </div>

                {/* Name Servers */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-500/30">
                  <h3 className="text-lg font-bold text-purple-300 flex items-center gap-2 mb-4">
                    <Server className="w-5 h-5" />
                    سرورهای نام
                  </h3>
                  <div className="space-y-2">
                    {whoisData.nameServers.length > 0 ? (
                      whoisData.nameServers.map((ns, index) => (
                        <div key={index} className="text-foreground text-sm font-mono">
                          {ns}
                        </div>
                      ))
                    ) : (
                      <span className="text-foreground/70">نامشخص</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!whoisData && !loading && (
          <div className="text-center py-8 text-foreground/60 space-y-2">
            <Globe className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <p>برای دریافت اطلاعات WHOIS نام دامنه را وارد کنید</p>
            <p className="text-sm">مثال: google.com, تبدیللا.ir, github.com</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


