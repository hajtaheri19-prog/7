"use client";
import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '../ui/button';
import { ArrowRightLeft, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const bases = [
    { value: '2', label: 'باینری (مبنای ۲)' },
    { value: '8', label: 'اوکتال (مبنای ۸)' },
    { value: '10', label: 'دسیمال (مبنای ۱۰)' },
    { value: '16', label: 'هگزادسیمال (مبنای ۱۶)' },
]

export default function BaseConverter() {
    const [inputValue, setInputValue] = useState('');
    const [fromBase, setFromBase] = useState('10');
    const [toBase, setToBase] = useState('2');
    const [result, setResult] = useState('');
    const { toast } = useToast();

    const convertBase = () => {
        if (!inputValue.trim()) {
            setResult('');
            return;
        }

        try {
            const decimalValue = parseInt(inputValue, parseInt(fromBase, 10));
            if (isNaN(decimalValue)) {
                setResult('ورودی نامعتبر');
                return;
            }
            const convertedValue = decimalValue.toString(parseInt(toBase, 10)).toUpperCase();
            setResult(convertedValue);
        } catch (error) {
            setResult('خطا در تبدیل');
        }
    };
    
    const swapBases = () => {
        setFromBase(toBase);
        setToBase(fromBase);
        setInputValue(result);
        convertBase();
    }
    
    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        toast({ title: 'کپی شد!', description: `مقدار "${result}" در کلیپ‌بورد کپی شد.` });
    };

    return (
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="from-base-select">از مبنای</Label>
                    <Select value={fromBase} onValueChange={setFromBase}>
                        <SelectTrigger id="from-base-select" className="h-12"><SelectValue /></SelectTrigger>
                        <SelectContent>{bases.map(b => <SelectItem key={`from-${b.value}`} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="to-base-select">به مبنای</Label>
                    <Select value={toBase} onValueChange={setToBase}>
                        <SelectTrigger id="to-base-select" className="h-12"><SelectValue /></SelectTrigger>
                        <SelectContent>{bases.map(b => <SelectItem key={`to-${b.value}`} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="base-input">مقدار ورودی</Label>
                <Input
                    id="base-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`عددی در مبنای ${fromBase} وارد کنید`}
                    className="h-12 text-center font-mono text-lg"
                    dir="ltr"
                />
            </div>
            
            <Button onClick={convertBase} className="w-full h-12">
                <ArrowRightLeft className="w-5 h-5 ml-2" />
                تبدیل کن
            </Button>

            <div className="relative p-4 bg-muted/50 rounded-lg shadow-inner text-center min-h-[6rem]">
                <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={copyToClipboard} disabled={!result || result.includes('خطا')}>
                    <Clipboard className="w-5 h-5" />
                </Button>
                <p className="text-sm text-muted-foreground">نتیجه</p>
                <p className="text-2xl font-bold text-primary mt-1 font-mono">{result || '...'}</p>
            </div>
        </CardContent>
    );
}