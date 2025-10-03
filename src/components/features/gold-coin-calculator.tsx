
"use client";

import { useState, useMemo, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gem, Calculator, RefreshCw, AlertCircle, Weight, Percent, Wrench, Banknote, DollarSign, Globe, Coins } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';
import { mockExchangeRates, DEFAULT_USD_RATE } from '@/lib/constants';

const formatNumber = (value: string | number): string => {
  const numStr = String(value).replace(/,/g, '');
  if (numStr === '' || isNaN(parseFloat(numStr))) return '';
  const num = parseFloat(numStr);
  return num.toLocaleString('en-US');
};

const unformatNumber = (value: string): number => {
  return parseFloat(String(value).replace(/,/g, ''));
};

const coinDetails: Record<string, { weight: number; karat: number }> = {
  emami: { weight: 8.133, karat: 900 },
  azadi: { weight: 8.133, karat: 900 },
  half: { weight: 4.0665, karat: 900 },
  quarter: { weight: 2.03325, karat: 900 },
  gerami: { weight: 1.01, karat: 900 },
};

const OUNCE_TO_GRAM = 31.1035;

// Helpers
const parseNumeric = (text: string | number): number => {
  const s = String(text || '').replace(/[^0-9.]/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

type LivePricesResponse = {
  success: boolean;
  data?: Record<string, { price: string; change: string | null }>;
};

const fetchLivePrices = async (): Promise<Record<string, { price: string; change: string | null }>> => {
  try {
    const res = await fetch('/api/live-prices', { cache: 'no-store' });
    const json = (await res.json()) as LivePricesResponse;
    if (!json.success || !json.data) return {};
    return json.data;
  } catch {
    return {};
  }
};


export default function GoldCoinCalculator() {
  // Gold Price State
  const [goldType, setGoldType] = useState('18');
  const [goldPricePerGram, setGoldPricePerGram] = useState('');
  const [craftingFee, setCraftingFee] = useState('');
  const [weight, setWeight] = useState('');
  const [sellerProfit, setSellerProfit] = useState('7');
  const [vat, setVat] = useState('10');
  const [finalGoldPrice, setFinalGoldPrice] = useState<number | null>(null);

  // Coin Bubble State
  const [coinType, setCoinType] = useState('emami');
  const [coinMarketPrice, setCoinMarketPrice] = useState('');
  const [ouncePrice, setOuncePrice] = useState('');
  const [dollarPrice, setDollarPrice] = useState('');
  const [coinBubble, setCoinBubble] = useState<number | null>(null);

  // Invoice-based workmanship (اجرت) calculator state
  const [invWeight, setInvWeight] = useState('');
  const [invGramPrice, setInvGramPrice] = useState('');
  const [invTotalPaid, setInvTotalPaid] = useState('');
  const [invTax, setInvTax] = useState('');
  const [invProfit, setInvProfit] = useState('');
  const [invWage, setInvWage] = useState<number | null>(null);

  // Set initial live prices on mount
  useEffect(() => {
    (async () => {
      const data = await fetchLivePrices();
      const emami = parseNumeric(data?.EmamiCoin?.price);
      const ounce = parseNumeric(data?.GoldOunce?.price);
      const dollar = parseNumeric(data?.Dollar?.price);
      const gold18 = parseNumeric(data?.Gold18K?.price);
      if (emami > 0) setCoinMarketPrice(formatNumber(emami));
      if (ounce > 0) setOuncePrice(formatNumber(ounce));
      else setOuncePrice(formatNumber(2320));
      if (dollar > 0) setDollarPrice(formatNumber(dollar));
      else setDollarPrice(formatNumber(DEFAULT_USD_RATE / 10));
      // Pre-fill "قیمت هر گرم طلا" from بازار طلا ۱۸
      if (gold18 > 0) setGoldPricePerGram(formatNumber(gold18));
    })();
  }, []);

  const handleCalculateGoldPrice = () => {
    const priceGram = unformatNumber(goldPricePerGram);
    const fee = unformatNumber(craftingFee);
    const w = unformatNumber(weight);
    const profit = unformatNumber(sellerProfit);
    const tax = unformatNumber(vat);

    if (isNaN(priceGram) || isNaN(w) || priceGram <= 0 || w <= 0) {
      setFinalGoldPrice(null);
      return;
    }

    const total = (priceGram * w + (fee || 0)) * (1 + (profit || 0) / 100) * (1 + (tax || 0) / 100);
    setFinalGoldPrice(total);
  };

  const handleResetGoldForm = () => {
    setGoldType('18');
    setGoldPricePerGram('');
    setCraftingFee('');
    setWeight('');
    setSellerProfit('7');
    setVat('10');
    setFinalGoldPrice(null);
  };
  
  const handleCalculateCoinBubble = () => {
    const marketPrice = unformatNumber(coinMarketPrice);
    const ounce = unformatNumber(ouncePrice);
    const dollar = unformatNumber(dollarPrice);
    const details = coinDetails[coinType];

    if (isNaN(marketPrice) || isNaN(ounce) || isNaN(dollar) || !details || marketPrice <= 0 || ounce <= 0 || dollar <= 0) {
      setCoinBubble(null);
      return;
    }
    
    const intrinsicValue = (ounce * dollar / OUNCE_TO_GRAM) * details.weight * (details.karat / 1000);
    const bubble = marketPrice - intrinsicValue;
    setCoinBubble(bubble);
  }
  
  const handleResetCoinForm = () => {
    setCoinType('emami');
    setCoinMarketPrice('');
    setOuncePrice('');
    setDollarPrice('');
    setCoinBubble(null);
  }

  const FancyInput = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="glass-effect p-3 rounded-xl flex items-center gap-3 h-[72px]">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">
            {icon}
        </div>
        <div className="flex-grow">
            <Label className="text-xs text-muted-foreground">{title}</Label>
            {children}
        </div>
    </div>
  );

  const handleCalculateInvoiceWage = () => {
    const w = unformatNumber(invWeight);
    const gram = unformatNumber(invGramPrice);
    const total = unformatNumber(invTotalPaid);
    const tax = unformatNumber(invTax) || 0;
    const profit = unformatNumber(invProfit) || 0;
    if (isNaN(w) || isNaN(gram) || isNaN(total) || w <= 0 || gram <= 0 || total <= 0) {
      setInvWage(null);
      return;
    }
    const rawGold = w * gram;
    const wage = total - rawGold - tax - profit;
    setInvWage(wage);
  };

  const handleResetInvoiceWage = () => {
    setInvWeight('');
    setInvGramPrice('');
    setInvTotalPaid('');
    setInvTax('');
    setInvProfit('');
    setInvWage(null);
  };

  const LivePriceInput = ({ icon, title, value, onValueChange, onRefresh, placeholder, unit }: {
    icon: React.ReactNode,
    title: string,
    value: string,
    onValueChange: (val: string) => void,
    onRefresh: () => void,
    placeholder: string,
    unit: string,
  }) => (
      <div className="glass-effect p-3 rounded-xl flex items-center gap-3 h-[72px]">
          <div className="bg-primary/10 text-primary p-3 rounded-lg">
              {icon}
          </div>
          <div className="flex-grow">
              <Label className="text-xs text-muted-foreground">{title}</Label>
              <div className="flex items-baseline gap-2">
                  <Input type="text" value={formatNumber(value)} onChange={(e) => onValueChange(e.target.value.replace(/[^0-9,]/g, ''))} placeholder={placeholder} dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                  <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onRefresh} className="text-muted-foreground self-center">
              <RefreshCw className="w-5 h-5"/>
          </Button>
      </div>
  );

  return (
    <Tabs defaultValue="gold-price" className="w-full pt-6">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
        <TabsTrigger value="gold-price">محاسبه قیمت طلا</TabsTrigger>
        <TabsTrigger value="coin-bubble">محاسبه حباب سکه</TabsTrigger>
        <TabsTrigger value="invoice-wage">محاسبه اجرت از فاکتور</TabsTrigger>
      </TabsList>
      
      {/* Gold Price Calculator Tab */}
      <TabsContent value="gold-price" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FancyInput icon={<Gem className="w-5 h-5"/>} title="نوع طلا">
                <Select value={goldType} onValueChange={setGoldType}>
                    <SelectTrigger className="h-9 border-0 bg-transparent p-0 focus:ring-0 focus:ring-offset-0 font-display text-base"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="18">۱۸ عیار</SelectItem>
                        <SelectItem value="17">۱۷ عیار</SelectItem>
                        <SelectItem value="24">۲۴ عیار (شِمش)</SelectItem>
                    </SelectContent>
                </Select>
            </FancyInput>
             <FancyInput icon={<Banknote className="w-5 h-5"/>} title="قیمت هر گرم طلا">
                <div className="flex items-baseline gap-2">
                    <Input type="text" value={formatNumber(goldPricePerGram)} onChange={(e) => setGoldPricePerGram(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="۳,۳۰۰,۰۰۰" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                    <span className="text-sm text-muted-foreground">تومان</span>
                </div>
             </FancyInput>
             <FancyInput icon={<Wrench className="w-5 h-5"/>} title="اجرت ساخت">
                 <div className="flex items-baseline gap-2">
                    <Input type="text" value={formatNumber(craftingFee)} onChange={(e) => setCraftingFee(e.target.value.replace(/[^0-9,]/g, ''))} placeholder="۲۰۰,۰۰۰" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                    <span className="text-sm text-muted-foreground">تومان</span>
                </div>
            </FancyInput>
             <FancyInput icon={<Weight className="w-5 h-5"/>} title="وزن کل">
                 <div className="flex items-baseline gap-2">
                    <Input type="text" value={formatNumber(weight)} onChange={(e) => setWeight(e.target.value.replace(/[^0-9,.]/g, ''))} placeholder="۵.۲۵" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                    <span className="text-sm text-muted-foreground">گرم</span>
                 </div>
            </FancyInput>
             <FancyInput icon={<Percent className="w-5 h-5"/>} title="سود فروشنده">
                 <div className="flex items-baseline gap-2">
                    <Input type="text" value={formatNumber(sellerProfit)} onChange={(e) => setSellerProfit(e.target.value.replace(/[^0-9,.]/g, ''))} placeholder="۷" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                    <span className="text-sm text-muted-foreground">%</span>
                 </div>
            </FancyInput>
             <FancyInput icon={<Percent className="w-5 h-5"/>} title="مالیات بر ارزش افزوده">
                 <div className="flex items-baseline gap-2">
                    <Input type="text" value={formatNumber(vat)} onChange={(e) => setVat(e.target.value.replace(/[^0-9,.]/g, ''))} placeholder="۱۰" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                    <span className="text-sm text-muted-foreground">%</span>
                 </div>
            </FancyInput>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleResetGoldForm} variant="outline" className="w-full h-12"><RefreshCw className="ml-2 w-4 h-4"/> پاک کردن فرم</Button>
            <Button onClick={handleCalculateGoldPrice} className="w-full h-12"><Calculator className="ml-2 w-4 h-4"/> محاسبه کن</Button>
        </div>
        {finalGoldPrice !== null && (
            <Alert className="bg-green-500/10 border-green-500/20 text-center">
              <Gem className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700 dark:text-green-400 text-lg">قیمت نهایی طلا</AlertTitle>
              <AlertDescription className="font-display text-4xl font-bold text-primary mt-2">
                {formatNumber(Math.round(finalGoldPrice))}
                <span className="text-lg font-normal"> تومان</span>
              </AlertDescription>
            </Alert>
        )}
      </TabsContent>
      
      {/* Coin Bubble Calculator Tab */}
      <TabsContent value="coin-bubble" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FancyInput icon={<Coins className="w-5 h-5"/>} title="نوع سکه">
                <Select value={coinType} onValueChange={setCoinType}>
                    <SelectTrigger className="h-9 border-0 bg-transparent p-0 focus:ring-0 focus:ring-offset-0 font-display text-base"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="emami">سکه امامی</SelectItem>
                        <SelectItem value="azadi">بهار آزادی</SelectItem>
                        <SelectItem value="half">نیم سکه</SelectItem>
                        <SelectItem value="quarter">ربع سکه</SelectItem>
                        <SelectItem value="gerami">سکه گرمی</SelectItem>
                    </SelectContent>
                </Select>
            </FancyInput>
            <LivePriceInput
              icon={<Banknote className="w-5 h-5"/>}
              title="قیمت روز سکه"
              value={coinMarketPrice}
              onValueChange={setCoinMarketPrice}
              onRefresh={async () => {
                const data = await fetchLivePrices();
                const emami = parseNumeric(data?.EmamiCoin?.price);
                if (emami > 0) setCoinMarketPrice(formatNumber(emami));
              }}
              placeholder="۴۰,۸۰۰,۰۰۰"
              unit="تومان"
            />
            <LivePriceInput
              icon={<Globe className="w-5 h-5"/>}
              title="قیمت انس جهانی طلا"
              value={ouncePrice}
              onValueChange={setOuncePrice}
              onRefresh={async () => {
                const data = await fetchLivePrices();
                const ounce = parseNumeric(data?.GoldOunce?.price);
                if (ounce > 0) setOuncePrice(formatNumber(ounce));
              }}
              placeholder="۲,۳۲۰"
              unit="دلار"
            />
            <LivePriceInput
              icon={<DollarSign className="w-5 h-5"/>}
              title="قیمت دلار"
              value={dollarPrice}
              onValueChange={setDollarPrice}
              onRefresh={async () => {
                const data = await fetchLivePrices();
                const dollar = parseNumeric(data?.Dollar?.price);
                if (dollar > 0) setDollarPrice(formatNumber(dollar));
              }}
              placeholder="۵۹,۵۰۰"
              unit="تومان"
            />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleResetCoinForm} variant="outline" className="w-full h-12"><RefreshCw className="ml-2 w-4 h-4"/> پاک کردن فرم</Button>
            <Button onClick={handleCalculateCoinBubble} className="w-full h-12"><Calculator className="ml-2 w-4 h-4"/> محاسبه کن</Button>
        </div>
         {coinBubble !== null && (
            <Alert className={cn("text-center", coinBubble > 0 ? "bg-red-500/10 border-red-500/20" : "bg-green-500/10 border-green-500/20")}>
              <AlertCircle className={cn(coinBubble > 0 ? "text-red-600" : "text-green-600")} />
              <AlertTitle className={cn("text-lg", coinBubble > 0 ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400")}>
                {coinBubble > 0 ? "حباب مثبت سکه" : "حباب منفی (زیر قیمت ذاتی)"}
              </AlertTitle>
              <AlertDescription className="font-display text-4xl font-bold text-primary mt-2">
                {formatNumber(Math.abs(Math.round(coinBubble)))}
                <span className="text-lg font-normal"> تومان</span>
              </AlertDescription>
            </Alert>
        )}
      </TabsContent>

      {/* Invoice Wage Calculator Tab */}
      <TabsContent value="invoice-wage" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FancyInput icon={<Weight className="w-5 h-5"/>} title="وزن طلا (گرم)">
            <div className="flex items-baseline gap-2">
              <Input type="text" value={formatNumber(invWeight)} onChange={(e)=>setInvWeight(e.target.value.replace(/[^0-9,.]/g,''))} placeholder="۵" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
              <span className="text-sm text-muted-foreground">گرم</span>
            </div>
          </FancyInput>
          <FancyInput icon={<Banknote className="w-5 h-5"/>} title="قیمت هر گرم طلا (زمان خرید)">
            <div className="flex items-baseline gap-2">
              <Input type="text" value={formatNumber(invGramPrice)} onChange={(e)=>setInvGramPrice(e.target.value.replace(/[^0-9,]/g,''))} placeholder="۳,۰۰۰,۰۰۰" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
              <span className="text-sm text-muted-foreground">تومان</span>
            </div>
          </FancyInput>
          <FancyInput icon={<Calculator className="w-5 h-5"/>} title="قیمت کل پرداختی">
            <div className="flex items-baseline gap-2">
              <Input type="text" value={formatNumber(invTotalPaid)} onChange={(e)=>setInvTotalPaid(e.target.value.replace(/[^0-9,]/g,''))} placeholder="۱۷,۵۰۰,۰۰۰" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
              <span className="text-sm text-muted-foreground">تومان</span>
            </div>
          </FancyInput>
          <FancyInput icon={<Percent className="w-5 h-5"/>} title="مالیات و سود (اختیاری)">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-baseline gap-2">
                <Input type="text" value={formatNumber(invTax)} onChange={(e)=>setInvTax(e.target.value.replace(/[^0-9,]/g,''))} placeholder="۰" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                <span className="text-sm text-muted-foreground">مالیات (تومان)</span>
              </div>
              <div className="flex items-baseline gap-2">
                <Input type="text" value={formatNumber(invProfit)} onChange={(e)=>setInvProfit(e.target.value.replace(/[^0-9,]/g,''))} placeholder="۰" dir="ltr" className="h-9 text-base font-display border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"/>
                <span className="text-sm text-muted-foreground">سود (تومان)</span>
              </div>
            </div>
          </FancyInput>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleResetInvoiceWage} variant="outline" className="w-full h-12"><RefreshCw className="ml-2 w-4 h-4"/> پاک کردن فرم</Button>
          <Button onClick={handleCalculateInvoiceWage} className="w-full h-12"><Calculator className="ml-2 w-4 h-4"/> محاسبه اجرت</Button>
        </div>
        {invWage !== null && (
          <Alert className="bg-blue-500/10 border-blue-500/20 text-center">
            <AlertTitle className="text-blue-700 dark:text-blue-400 text-lg">اجرت ساخت</AlertTitle>
            <AlertDescription className="font-display text-4xl font-bold text-primary mt-2">
              {formatNumber(Math.round(invWage))}
              <span className="text-lg font-normal"> تومان</span>
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </Tabs>
  );
}
