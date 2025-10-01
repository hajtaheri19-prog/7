"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Copy, FileCog } from 'lucide-react';
import { Switch } from '../ui/switch';

type Rule = {
  id: number;
  userAgent: string;
  allow: string[];
  disallow: string[];
};

const RulePaths = ({ type, rule, onPathChange, onAddPath, onRemovePath }: {
    type: 'allow' | 'disallow',
    rule: Rule,
    onPathChange: (id: number, field: 'allow' | 'disallow', value: string, index: number) => void,
    onAddPath: (id: number, type: 'allow' | 'disallow') => void,
    onRemovePath: (id: number, type: 'allow' | 'disallow', index: number) => void
}) => {
    const label = type === 'allow' ? 'مسیرهای مجاز (Allow)' : 'مسیرهای مسدود (Disallow)';
    return (
        <div className="space-y-2">
            <Label className={type === 'allow' ? 'text-green-600' : 'text-red-600'}>{label}</Label>
            {rule[type].map((path, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Input value={path} onChange={(e) => onPathChange(rule.id, type, e.target.value, index)} placeholder="/path/" dir="ltr"/>
                    <Button variant="ghost" size="icon" onClick={() => onRemovePath(rule.id, type, index)} className="text-destructive shrink-0"><Trash2 className="w-4 h-4"/></Button>
                </div>
            ))}
             <Button variant="outline" size="sm" onClick={() => onAddPath(rule.id, type)} className="w-full text-xs h-8"><Plus className="w-3 h-3 ml-1"/> افزودن مسیر</Button>
        </div>
    )
}

export default function RobotsTxtGenerator() {
  const [defaultPolicy, setDefaultPolicy] = useState<'allow' | 'disallow'>('allow');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, userAgent: '*', allow: [], disallow: ['/admin/', '/private/'] },
  ]);
  const { toast } = useToast();

  const handleAddRule = () => {
    setRules([...rules, { id: Date.now(), userAgent: '', allow: [], disallow: [] }]);
  };

  const handleRemoveRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleRuleChange = (id: number, field: 'userAgent' | 'allow' | 'disallow', value: string, index?: number) => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        if (field === 'userAgent') {
          return { ...rule, userAgent: value };
        }
        const newArr = [...rule[field]];
        if (typeof index !== 'undefined') {
          newArr[index] = value;
        }
        return { ...rule, [field]: newArr };
      }
      return rule;
    }));
  };

  const addPath = (id: number, type: 'allow' | 'disallow') => {
    setRules(rules.map(rule => {
      if (rule.id === id) {
        return { ...rule, [type]: [...rule[type], ''] };
      }
      return rule;
    }));
  };
  
  const removePath = (id: number, type: 'allow' | 'disallow', index: number) => {
    setRules(rules.map(rule => {
        if (rule.id === id) {
            const newArr = [...rule[type]];
            newArr.splice(index, 1);
            return { ...rule, [type]: newArr };
        }
        return rule;
    }));
  };

  const generatedRobotsTxt = useMemo(() => {
    let content = '';

    rules.forEach(rule => {
      content += `User-agent: ${rule.userAgent || '*'}\n`;
      rule.allow.forEach(path => {
        if(path) content += `Allow: ${path}\n`;
      });
      rule.disallow.forEach(path => {
        if(path) content += `Disallow: ${path}\n`;
      });
      content += '\n';
    });
    
    if (defaultPolicy === 'disallow' && !rules.some(r => r.userAgent === '*')) {
      content = `User-agent: *\nDisallow: /\n\n` + content;
    }

    if (sitemapUrl) {
      content += `Sitemap: ${sitemapUrl}\n`;
    }

    return content;
  }, [rules, defaultPolicy, sitemapUrl]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRobotsTxt);
    toast({ title: 'کپی شد!', description: 'محتوای فایل robots.txt کپی شد.' });
  };
  
   const downloadFile = () => {
    const blob = new Blob([generatedRobotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
         <div className="space-y-2">
            <Label>سیاست پیش‌فرض برای همه ربات‌ها</Label>
             <Select value={defaultPolicy} onValueChange={(val: 'allow' | 'disallow') => setDefaultPolicy(val)}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="allow">اجازه دسترسی به همه چیز</SelectItem>
                    <SelectItem value="disallow">مسدود کردن همه چیز</SelectItem>
                </SelectContent>
            </Select>
         </div>
         <div className="space-y-2">
            <Label htmlFor="sitemap-url">آدرس سایت‌مپ (اختیاری)</Label>
            <Input id="sitemap-url" value={sitemapUrl} onChange={e => setSitemapUrl(e.target.value)} placeholder="https://example.com/sitemap.xml" dir="ltr" className="h-12"/>
         </div>
      </div>
      
      <div className="space-y-4">
        <Label>قوانین خاص برای ربات‌ها</Label>
        {rules.map((rule) => (
          <div key={rule.id} className="p-4 border rounded-lg space-y-3 bg-muted/20">
            <div className="flex justify-between items-center">
              <Input value={rule.userAgent} onChange={(e) => handleRuleChange(rule.id, 'userAgent', e.target.value)} placeholder="User-agent (e.g., * or Googlebot)" dir="ltr" className="flex-grow"/>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveRule(rule.id)} className="text-destructive"><Trash2 className="w-5 h-5"/></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RulePaths type="disallow" rule={rule} onPathChange={handleRuleChange} onAddPath={addPath} onRemovePath={removePath} />
                <RulePaths type="allow" rule={rule} onPathChange={handleRuleChange} onAddPath={addPath} onRemovePath={removePath} />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={handleAddRule} className="w-full"><Plus className="w-4 h-4 ml-2"/> افزودن قانون جدید</Button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
            <Label htmlFor="robots-output">خروجی robots.txt</Label>
            <div className='flex gap-2'>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}><Copy className="w-5 h-5"/></Button>
                <Button variant="ghost" size="icon" onClick={downloadFile}><FileCog className="w-5 h-5"/></Button>
            </div>
        </div>
        <Textarea id="robots-output" readOnly value={generatedRobotsTxt} className="min-h-[200px] font-mono bg-muted" dir="ltr"/>
      </div>
    </CardContent>
  );
}