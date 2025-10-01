
"use client";

import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Copy, Download, Eye, File as FileIcon, RefreshCcw, Upload, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const toBase64 = (str: string) => {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        console.error('Failed to encode to Base64:', e);
        return 'خطا در انکود کردن متن. ممکن است شامل کاراکترهای نامعتبر باشد.';
    }
};

const fromBase64 = (str: string) => {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        console.error('Failed to decode from Base64:', e);
        return 'رشته Base64 نامعتبر است.';
    }
};


export default function Base64Converter() {
  const [text, setText] = useState('');
  const [base64Text, setBase64Text] = useState('');
  
  const [fileToEncode, setFileToEncode] = useState<File | null>(null);
  const [encodedFileContent, setEncodedFileContent] = useState('');
  const [base64ToDecode, setBase64ToDecode] = useState('');

  const { toast } = useToast();

  const textBytes = useMemo(() => new Blob([text || '']).size, [text]);
  const base64Bytes = useMemo(() => (base64Text ? new Blob([base64Text]).size : 0), [base64Text]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setBase64Text(newText ? toBase64(newText) : '');
  };

  const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBase64 = e.target.value;
    setBase64Text(newBase64);
    setText(newBase64 ? fromBase64(newBase64) : '');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFileToEncode(selectedFile);
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            // The result includes the full data URI, so we split it to get only the Base64 part.
            const base64Data = result.split(',')[1];
            setEncodedFileContent(base64Data);
        };
        reader.onerror = () => {
             toast({ title: 'خطا', description: 'خطا در خواندن فایل.', variant: 'destructive'});
        }
        reader.readAsDataURL(selectedFile);
    }
  };

  const onDropEncode = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    const syntheticEvent = { target: { files: [f] } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(syntheticEvent);
  };

  const preventDefault = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDownload = () => {
    if (!base64ToDecode.trim()) {
      toast({ title: 'خطا', description: 'هیچ داده Base64 برای دانلود وجود ندارد.', variant: 'destructive'});
      return;
    }
    try {
        const byteCharacters = atob(base64ToDecode.trim());
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        // Simple MIME type detection
        let mime = 'application/octet-stream';
        let extension = 'bin';
        
        // Check for common file signatures
        if (byteArray.length > 3 && byteArray[0] === 0x89 && byteArray[1] === 0x50 && byteArray[2] === 0x4E && byteArray[3] === 0x47) {
            mime = 'image/png';
            extension = 'png';
        } else if (byteArray.length > 1 && byteArray[0] === 0xFF && byteArray[1] === 0xD8) {
            mime = 'image/jpeg';
            extension = 'jpg';
        } else if (byteArray.length > 3 && byteArray[0] === 0x25 && byteArray[1] === 0x50 && byteArray[2] === 0x44 && byteArray[3] === 0x46) {
            mime = 'application/pdf';
            extension = 'pdf';
        }

        const blob = new Blob([byteArray], { type: mime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `decoded-file.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        toast({ title: 'خطا', description: 'رشته Base64 نامعتبر است و قابل تبدیل به فایل نیست.', variant: 'destructive'});
    }
  };
  
  const copyToClipboard = (content: string) => {
      if (!content) return;
      navigator.clipboard.writeText(content);
      toast({ title: 'کپی شد', description: 'محتوا در کلیپ‌بورد کپی شد.' });
  }

  const downloadText = (name: string, content: string) => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <Tabs defaultValue="text" className="w-full pt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">متن ↔ Base64</TabsTrigger>
          <TabsTrigger value="file">فایل ↔ Base64</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="space-y-4">
            <div className="space-y-2 relative">
                <Label htmlFor="text-input" className="text-muted-foreground">متن اصلی</Label>
                <Textarea id="text-input" value={text} onChange={handleTextChange} placeholder="متن خود را اینجا وارد کنید..." className="min-h-[140px]"/>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>حجم: {textBytes.toLocaleString('fa-IR')} بایت</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setText('')} title="پاک‌کردن">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => downloadText('text', text)} title="دانلود متن">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
            </div>
            <div className="flex justify-center">
                <Button variant="ghost" size="icon" title="جابجایی رمزگذاری/رمزگشایی" onClick={() => {
                  if (text) {
                    const b = toBase64(text);
                    setBase64Text(b);
                  } else if (base64Text) {
                    const t = fromBase64(base64Text);
                    setText(t);
                  }
                }}>
                  <ArrowRightLeft className="h-6 w-6 text-muted-foreground"/>
                </Button>
            </div>
            <div className="space-y-2 relative">
                <Label htmlFor="base64-output" className="text-muted-foreground">خروجی Base64</Label>
                <Textarea id="base64-output" value={base64Text} onChange={handleBase64Change} placeholder="خروجی Base64..." className="min-h-[140px] font-mono" dir="ltr"/>
                <div className="absolute top-9 left-2 flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(base64Text)} title="کپی">
                    <Copy className="w-5 h-5 text-muted-foreground"/>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setBase64Text('')} title="پاک‌کردن">
                    <X className="w-5 h-5"/>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => downloadText('base64', base64Text)} title="دانلود Base64">
                    <Download className="w-5 h-5"/>
                  </Button>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">حجم Base64: {base64Bytes.toLocaleString('fa-IR')} بایت</div>
            </div>
        </TabsContent>
        <TabsContent value="file" className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">انکود فایل به Base64</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!fileToEncode ? (
                         <div 
                            className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => document.getElementById('file-upload-encode')?.click()}
                            onDragOver={preventDefault}
                            onDragEnter={preventDefault}
                            onDrop={onDropEncode}
                          >
                            <Upload className="w-12 h-12 text-muted-foreground/60 mb-3" />
                            <p className="text-muted-foreground text-center font-semibold">فایل را بکشید یا برای انتخاب کلیک کنید</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">پشتیبانی: تصویر، PDF و سایر فایل‌ها</p>
                            <input id="file-upload-encode" type="file" onChange={handleFileChange} className="hidden"/>
                         </div>
                    ) : (
                        <div className="flex items-center gap-3 bg-muted p-3 rounded-lg w-full">
                            <FileIcon className="w-6 h-6 text-primary"/>
                            <div className="flex-grow">
                                <p className="font-semibold text-sm">{fileToEncode.name}</p>
                                <p className="text-xs text-muted-foreground">{(fileToEncode.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(encodedFileContent)} title="کپی Base64">
                                <Copy className="w-5 h-5"/>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => downloadText('file-base64', encodedFileContent)} title="دانلود Base64">
                                <Download className="w-5 h-5"/>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => { setFileToEncode(null); setEncodedFileContent(''); }} title="پاک‌کردن">
                                <X className="w-5 h-5"/>
                              </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 relative">
                        <Label htmlFor="file-base64-output" className="text-muted-foreground">خروجی Base64</Label>
                        <Textarea id="file-base64-output" value={encodedFileContent} readOnly placeholder="رشته Base64 فایل اینجا نمایش داده می‌شود." className="min-h-[150px] font-mono bg-muted/50" dir="ltr"/>
                        <div className="absolute top-9 left-2 flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(encodedFileContent)} title="کپی">
                            <Copy className="w-5 h-5 text-muted-foreground"/>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => downloadText('file-base64', encodedFileContent)} title="دانلود Base64">
                            <Download className="w-5 h-5"/>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEncodedFileContent('')} title="پاک‌کردن">
                            <RefreshCcw className="w-5 h-5"/>
                          </Button>
                        </div>
                    </div>

                    {encodedFileContent && (
                      <div className="rounded-lg border p-3 bg-muted/30">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <Eye className="w-4 h-4" /> پیش‌نمایش (درصورت پشتیبانی مرورگر)
                        </div>
                        <div className="flex items-center justify-center overflow-hidden rounded-md bg-background p-3">
                          <img
                            src={`data:;base64,${encodedFileContent}`}
                            alt="preview"
                            className="max-h-64 object-contain"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                          <iframe
                            className="w-full h-64"
                            src={`data:application/pdf;base64,${encodedFileContent}`}
                            title="preview"
                            onError={(e) => { (e.currentTarget as HTMLIFrameElement).style.display = 'none'; }}
                          />
                        </div>
                      </div>
                    )}
                </CardContent>
             </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">دیکود Base64 به فایل</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="space-y-2 relative">
                        <Label htmlFor="base64-to-decode-input" className="text-muted-foreground">رشته Base64 را وارد کنید</Label>
                        <Textarea id="base64-to-decode-input" value={base64ToDecode} onChange={(e) => setBase64ToDecode(e.target.value)} placeholder="رشته Base64 را اینجا بچسبانید..." className="min-h-[150px] font-mono" dir="ltr"/>
                     </div>
                     <Button onClick={handleDownload} disabled={!base64ToDecode} className="w-full">
                         <Download className="w-4 h-4 ml-2"/>
                         دانلود فایل دیکود شده
                     </Button>
                     {base64ToDecode && (
                       <div className="rounded-lg border p-3 bg-muted/30">
                         <div className="flex items-center gap-2 text-sm font-medium mb-2">
                           <Eye className="w-4 h-4" /> پیش‌نمایش (درصورت پشتیبانی)
                         </div>
                         <div className="flex items-center justify-center overflow-hidden rounded-md bg-background p-3">
                           <img
                             src={`data:;base64,${base64ToDecode}`}
                             alt="preview"
                             className="max-h-64 object-contain"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                           />
                           <iframe
                             className="w-full h-64"
                             src={`data:application/pdf;base64,${base64ToDecode}`}
                             title="preview"
                             onError={(e) => { (e.currentTarget as HTMLIFrameElement).style.display = 'none'; }}
                           />
                         </div>
                       </div>
                     )}
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
  );
}
