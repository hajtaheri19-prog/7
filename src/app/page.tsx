"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollToTop from '@/components/layout/scroll-to-top';
import type { LivePrice, PriceData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sword, Brain, ArrowLeft, BrainCircuit, BookText, FlaskConical, Scale, Landmark, CalendarDays, Repeat, SpellCheck, Binary, CalendarClock, Gift, Clock, Hourglass, Wallet, Bitcoin, Banknote, PiggyBank, TrendingUp, Percent, HeartPulse, Dumbbell, User, ShieldCheck, Fingerprint, RectangleEllipsis, Dices, KeyRound, QrCode, Scan, LocateFixed, Image, Monitor, FileText, Map, Info, HeartHandshake, Globe, Wrench, ArrowUp, ArrowDown, RefreshCw, Timer, CandlestickChart, ExternalLink, Construction, Calculator, Gamepad2, Puzzle, Bot, Mailbox, ReceiptText, CalendarCheck, PenLine, Hash, Link as LinkIcon, Users, Ghost, CircleDot, Castle, Rocket, Target, Ship, ArrowDownRight, Square, Search, Shield, MessageSquareHeart, Bomb, Crown, Palette, Loader2, FileSignature, Gem, FileCog, Eraser, Sigma, Smile, MessageSquare } from 'lucide-react';
import ImageNext from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import PWAInstallPrompt from '@/components/layout/pwa-install-prompt';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import QuotesRotator from '@/components/layout/quotes-rotator';
import Link from 'next/link';
import { ModeBadge } from '@/components/shared/mode-badge';
import { ScrollArea } from '@/components/ui/scroll-area';
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const LoadingComponent = () => (
    <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>در حال بارگذاری ابزار...</span>
    </div>
);

const AdvancedLivePrices = dynamic(() => import('@/components/features/advanced-live-prices'), { loading: () => <LoadingComponent /> });
const UnitConverter = dynamic(() => import('@/components/features/unit-converter'), { loading: () => <LoadingComponent /> });
const CurrencyConverter = dynamic(() => import('@/components/features/currency-converter'), { loading: () => <LoadingComponent /> });
const DateConverter = dynamic(() => import('@/components/features/date-converter'), { loading: () => <LoadingComponent /> });
const CryptoConverter = dynamic(() => import('@/components/features/crypto-converter'), { loading: () => <LoadingComponent /> });
const AgeCalculator = dynamic(() => import('@/components/features/age-calculator'), { loading: () => <LoadingComponent /> });
const BmiCalculator = dynamic(() => import('@/components/features/bmi-calculator'), { loading: () => <LoadingComponent /> });
const PercentageCalculator = dynamic(() => import('@/components/features/percentage-calculator'), { loading: () => <LoadingComponent /> });
const WomenHealthCalculator = dynamic(() => import('@/components/features/women-health-calculator'), { loading: () => <LoadingComponent /> });
const VatCalculator = dynamic(() => import('@/components/features/vat-calculator'), { loading: () => <LoadingComponent /> });
const LoanCalculator = dynamic(() => import('@/components/features/loan-calculator'), { loading: () => <LoadingComponent /> });
const GpaCalculator = dynamic(() => import('@/components/features/gpa-calculator'), { loading: () => <LoadingComponent /> });
const Stopwatch = dynamic(() => import('@/components/features/stopwatch'), { loading: () => <LoadingComponent /> });
const CountdownTimer = dynamic(() => import('@/components/features/countdown-timer'), { loading: () => <LoadingComponent /> });
const DepositCalculator = dynamic(() => import('@/components/features/deposit-calculator'), { loading: () => <LoadingComponent /> });
const NumberToWordsConverter = dynamic(() => import('@/components/features/number-to-words-converter'), { loading: () => <LoadingComponent /> });
const NumberSystemConverter = dynamic(() => import('@/components/features/number-system-converter'), { loading: () => <LoadingComponent /> });
const PasswordGenerator = dynamic(() => import('@/components/features/password-generator'), { loading: () => <LoadingComponent /> });
const RandomNumberGenerator = dynamic(() => import('@/components/features/random-number-generator'), { loading: () => <LoadingComponent /> });
const BinaryConverter = dynamic(() => import('@/components/features/binary-converter'), { loading: () => <LoadingComponent /> });
const DistanceCalculator = dynamic(() => import('@/components/features/distance-calculator'), { loading: () => <LoadingComponent /> });
const VehiclePlateIdentifier = dynamic(() => import('@/components/features/vehicle-plate-identifier'), { loading: () => <LoadingComponent /> });
const TextAnalyzer = dynamic(() => import('@/components/features/text-analyzer'), { loading: () => <LoadingComponent /> });
const ImageOptimizer = dynamic(() => import('@/components/features/image-optimizer'), { loading: () => <LoadingComponent /> });
const TextSummarizer = dynamic(() => import('@/components/features/text-summarizer'), { loading: () => <LoadingComponent /> });
const RialTomanConverter = dynamic(() => import('@/components/features/rial-toman-converter'), { loading: () => <LoadingComponent /> });
const SavingsCalculator = dynamic(() => import('@/components/features/savings-calculator'), { loading: () => <LoadingComponent /> });
const NationalIdValidator = dynamic(() => import('@/components/features/national-id-validator'), { loading: () => <LoadingComponent /> });
const WorkoutTimer = dynamic(() => import('@/components/features/workout-timer'), { loading: () => <LoadingComponent /> });
const ShebaConverter = dynamic(() => import('@/components/features/sheba-converter'), { loading: () => <LoadingComponent /> });
const QrCodeGenerator = dynamic(() => import('@/components/features/qr-code-generator'), { loading: () => <LoadingComponent /> });
const QrCodeReader = dynamic(() => import('@/components/features/qr-code-reader'), { loading: () => <LoadingComponent /> });
const TicTacToe = dynamic(() => import('@/components/features/tic-tac-toe'), { loading: () => <LoadingComponent /> });
const LegalFinancialChatbot = dynamic(() => import('@/components/features/legal-financial-chatbot'), { loading: () => <LoadingComponent /> });
const SignatureGenerator = dynamic(() => import('@/components/features/signature-generator'), { loading: () => <LoadingComponent /> });
const MemoryGame = dynamic(() => import('@/components/features/memory-game'), { loading: () => <LoadingComponent /> });
const GuessTheNumber = dynamic(() => import('@/components/features/guess-the-number'), { loading: () => <LoadingComponent /> });
const Game2048 = dynamic(() => import('@/components/features/game-2048'), { loading: () => <LoadingComponent /> });
const LotteryTool = dynamic(() => import('@/components/features/lottery-tool'), { loading: () => <LoadingComponent /> });
const InvoiceGenerator = dynamic(() => import('@/components/features/invoice-generator'), { loading: () => <LoadingComponent /> });
const ColorConverter = dynamic(() => import('@/components/features/color-converter'), { loading: () => <LoadingComponent /> });
const Base64Converter = dynamic(() => import('@/components/features/base64-converter'), { loading: () => <LoadingComponent /> });
const BaseConverter = dynamic(() => import('@/components/features/base-converter'), { loading: () => <LoadingComponent /> });
const LinkShortener = dynamic(() => import('@/components/features/link-shortener'), { loading: () => <LoadingComponent /> });
const SocialPostGenerator = dynamic(() => import('@/components/features/social-post-generator'), { loading: () => <LoadingComponent /> });
const OcrExtractor = dynamic(() => import('@/components/features/ocr-extractor'), { loading: () => <LoadingComponent /> });
const EventsCalendar = dynamic(() => import('@/components/features/events-calendar'), { loading: () => <LoadingComponent /> });
const MorseConverter = dynamic(() => import('@/components/features/morse-converter'), { loading: () => <LoadingComponent /> });
const IpDetector = dynamic(() => import('@/components/features/ip-detector'), { loading: () => <LoadingComponent /> });
const PdfWordConverter = dynamic(() => import('@/components/features/pdf-word-converter'), { loading: () => <LoadingComponent /> });
const PdfImageConverter = dynamic(() => import('@/components/features/pdf-image-converter'), { loading: () => <LoadingComponent /> });
const GoldCoinCalculator = dynamic(() => import('@/components/features/gold-coin-calculator'), { loading: () => <LoadingComponent /> });
const RobotsTxtGenerator = dynamic(() => import('@/components/features/robots-txt-generator'), { loading: () => <LoadingComponent /> });
const SpaceRemover = dynamic(() => import('@/components/features/space-remover'), { loading: () => <LoadingComponent /> });
const FactorialCalculator = dynamic(() => import('@/components/features/factorial-calculator'), { loading: () => <LoadingComponent /> });
const SquareRootCalculator = dynamic(() => import('@/components/features/square-root-calculator'), { loading: () => <LoadingComponent /> });
const WhoisLookup = dynamic(() => import('@/components/features/whois-lookup'), { loading: () => <LoadingComponent /> });
const FaviconGenerator = dynamic(() => import('@/components/features/favicon-generator'), { loading: () => <LoadingComponent /> });
const UTMBuilder = dynamic(() => import('@/components/features/utm-builder'), { loading: () => <LoadingComponent /> });
const WhatsAppLink = dynamic(() => import('@/components/features/whatsapp-link'), { loading: () => <LoadingComponent /> });
const LoremIpsum = dynamic(() => import('@/components/features/lorem-ipsum'), { loading: () => <LoadingComponent /> });
const IranTime = dynamic(() => import('@/components/features/iran-time'), { loading: () => <LoadingComponent /> });
const OnlineAlarm = dynamic(() => import('@/components/features/online-alarm'), { loading: () => <LoadingComponent /> });
const BeckDepressionTest = dynamic(() => import('@/components/features/beck-depression-test'), { loading: () => <LoadingComponent /> });
const HappinessTest = dynamic(() => import('@/components/features/happiness-test'), { loading: () => <LoadingComponent /> });
const SelfConfidenceTest = dynamic(() => import('@/components/features/self-confidence-test'), { loading: () => <LoadingComponent /> });
const MehriehCalculator = dynamic(() => import('@/components/features/mehrieh-calculator'), { loading: () => <LoadingComponent /> });
const ExecutionFee = dynamic(() => import('@/components/features/execution-fee'), { loading: () => <LoadingComponent /> });
const AttorneyFee = dynamic(() => import('@/components/features/attorney-fee'), { loading: () => <LoadingComponent /> });
const HafezFortune = dynamic(() => import('@/components/features/hafez-fortune'), { loading: () => <LoadingComponent /> });
const ColorVisionTest = dynamic(() => import('@/components/features/color-vision-test'), { loading: () => <LoadingComponent /> });
const HearingTest = dynamic(() => import('@/components/features/hearing-test'), { loading: () => <LoadingComponent /> });
const InflationCalculator = dynamic(() => import('@/components/features/inflation-calculator'), { loading: () => <LoadingComponent /> });
const ReadingTimeCalculator = dynamic(() => import('@/components/features/reading-time-calculator'), { loading: () => <LoadingComponent /> });
const TimestampConverter = dynamic(() => import('@/components/features/timestamp-converter'), { loading: () => <LoadingComponent /> });

interface Tool {
    id: string;
    title: string;
    icon: React.ReactNode;
    component?: React.ComponentType;
    mode?: string;
    isWip?: boolean;
    isExternal?: boolean;
    href?: string;
}

interface ToolCategory {
    title: string;
    icon: React.ReactNode;
    tools: Tool[];
}


const toolCategories: ToolCategory[] = [
  {
    title: 'ابزارهای هوش مصنوعی',
    icon: <BrainCircuit className="h-6 w-6 text-primary-foreground" />,
    tools: [
       { id: 'text-summarizer', title: 'خلاصه‌ساز هوشمند متن', icon: <BookText className="h-8 w-8 text-cyan-400" />, component: TextSummarizer },
       { id: 'legal-financial-chatbot', title: 'چت‌بات حقوقی و مالی', icon: <Bot className="h-8 w-8 text-blue-400" />, component: LegalFinancialChatbot },
       { id: 'social-post-generator', title: 'تولید پست شبکه‌های اجتماعی', icon: <RectangleEllipsis className="h-8 w-8 text-rose-400" />, component: SocialPostGenerator },
       { id: 'ocr-extractor', title: 'استخراج متن از تصویر و PDF', icon: <Scan className="h-8 w-8 text-indigo-400" />, component: OcrExtractor },
       { id: 'contract-generator', title: 'مولد قرارداد هوشمند', icon: <FileSignature className="h-8 w-8 text-emerald-400" />, isWip: true },
       { id: 'pdf-word-converter', title: 'تبدیل PDF به Word (و بالعکس)', icon: <RectangleEllipsis className="h-8 w-8 text-blue-400" />, component: PdfWordConverter },
       { id: 'pdf-image-converter', title: 'تبدیل PDF به عکس (و برعکس)', icon: <RectangleEllipsis className="h-8 w-8 text-green-400" />, component: PdfImageConverter },
    ]
  },
  {
    title: 'مبدل‌ها',
    icon: <FlaskConical className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'unit-converter', title: 'تبدیل واحد (طول، وزن، دما)', icon: <Scale className="h-8 w-8 text-blue-400" />, component: UnitConverter },
      { id: 'currency-converter', title: 'تبدیل ارزهای رایج', icon: <Landmark className="h-8 w-8 text-green-400" />, component: CurrencyConverter },
      { id: 'date-converter', title: 'تبدیل تاریخ شمسی و میلادی', icon: <CalendarDays className="h-8 w-8 text-purple-400" />, component: DateConverter },
      { id: 'rial-toman-converter', title: 'تبدیل ریال و تومان', icon: <Repeat className="h-8 w-8 text-emerald-400" />, component: RialTomanConverter },
      { id: 'number-to-words', title: 'تبدیل عدد به حروف', icon: <SpellCheck className="h-8 w-8 text-amber-400" />, component: NumberToWordsConverter },
      { id: 'number-system', title: 'تبدیل ارقام فارسی و انگلیسی', icon: <Binary className="h-8 w-8 text-sky-400" />, component: NumberSystemConverter },
      { id: 'binary-converter', title: 'تبدیل متن و باینری', icon: <Binary className="h-8 w-8 text-cyan-400" />, component: BinaryConverter },
      { id: 'base-converter', title: 'مبدل مبنای اعداد', icon: <Binary className="h-8 w-8 text-orange-400" />, component: BaseConverter },
      { id: 'color-converter', title: 'مبدل رنگ (HEX, RGB, HSL)', icon: <Palette className="h-8 w-8 text-rose-400" />, component: ColorConverter },
      { id: 'base64-converter', title: 'تبدیل متن و فایل به Base64', icon: <Hash className="h-8 w-8 text-violet-400" />, component: Base64Converter },
      { id: 'timestamp-converter', title: 'مبدل تایم‌استمپ', icon: <Clock className="h-8 w-8 text-sky-400" />, component: TimestampConverter },
    ]
  },
  {
    title: 'ابزارهای زمان و تاریخ',
    icon: <CalendarClock className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'age-calculator', title: 'محاسبه دقیق سن', icon: <Gift className="h-8 w-8 text-pink-400" />, component: AgeCalculator },
      { id: 'stopwatch', title: 'کرونومتر حرفه‌ای', icon: <Clock className="h-8 w-8 text-indigo-400" />, component: Stopwatch },
      { id: 'countdown-timer', title: 'تایمر شمارش معکوس', icon: <Hourglass className="h-8 w-8 text-blue-400" />, component: CountdownTimer },
      { id: 'events-calendar', title: 'تقویم مناسبت‌های ایران', icon: <CalendarCheck className="h-8 w-8 text-rose-400" />, component: EventsCalendar },
      { id: 'iran-time', title: 'ساعت و تاریخ ایران', icon: <Clock className="h-8 w-8 text-emerald-400" />, component: IranTime },
      { id: 'online-alarm', title: 'تنظیم زنگ هشدار آنلاین', icon: <Timer className="h-8 w-8 text-amber-400" />, component: OnlineAlarm },
    ]
  },
    {
    title: 'محاسبات عمومی و مالی',
    icon: <Wallet className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'gpa-calculator', title: 'معدل‌سنج هوشمند', icon: <Calculator className="h-8 w-8 text-amber-400" />, component: GpaCalculator },
      { id: 'crypto-converter', title: 'نرخ لحظه‌ای ارز دیجیتال', icon: <Bitcoin className="h-8 w-8 text-orange-400" />, component: CryptoConverter },
      { id: 'loan-calculator', title: 'محاسبه اقساط وام', icon: <Banknote className="h-8 w-8 text-rose-400" />, component: LoanCalculator },
      { id: 'deposit-calculator', title: 'محاسبه سود سپرده', icon: <PiggyBank className="h-8 w-8 text-emerald-400" />, component: DepositCalculator },
      { id: 'savings-calculator', title: 'محاسبه‌گر پس‌انداز', icon: <TrendingUp className="h-8 w-8 text-lime-400" />, component: SavingsCalculator },
      { id: 'percentage-calculator', title: 'محاسبه درصد', icon: <Percent className="h-8 w-8 text-teal-400" />, component: PercentageCalculator },
      { id: 'vat-calculator', title: 'محاسبه ارزش افزوده', icon: <Percent className="h-8 w-8 text-sky-400" />, component: VatCalculator },
      { id: 'women-health', title: 'ماشین حساب سلامت بانوان', icon: <HeartPulse className="h-8 w-8 text-yellow-400" />, isWip: true },
      { id: 'inflation-calculator', title: 'ماشین شهودی تبدیل ارزش پول', icon: <TrendingUp className="h-8 w-8 text-red-400" />, component: InflationCalculator },
      { id: 'reading-time-calculator', title: 'محاسبه زمان خواندن متن', icon: <FileText className="h-8 w-8 text-indigo-400" />, component: ReadingTimeCalculator },
      { id: 'morse-converter', title: 'مبدل متن ↔ مورس', icon: <Binary className="h-8 w-8 text-amber-400" />, component: MorseConverter },
      { id: 'invoice-generator', title: 'فاکتورساز حرفه‌ای', icon: <ReceiptText className="h-8 w-8 text-indigo-400" />, component: InvoiceGenerator },
       { id: 'gold-coin-calculator', title: 'محاسبه‌گر طلا و سکه', icon: <Gem className="h-8 w-8 text-yellow-400" />, component: GoldCoinCalculator },
       { id: 'factorial-calculator', title: 'محاسبه فاکتوریل (!n)', icon: <Sigma className="h-8 w-8 text-blue-400" />, component: FactorialCalculator },
       { id: 'square-root-calculator', title: 'محاسبه جذر (√n)', icon: <Square className="h-8 w-8 text-green-400" />, component: SquareRootCalculator },
      { id: 'mehrieh-calculator', title: 'محاسبه مهریه به نرخ روز', icon: <Gem className="h-8 w-8 text-yellow-500" />, component: MehriehCalculator },
      { id: 'execution-fee', title: 'محاسبه نیم عشر دولتی', icon: <Scale className="h-8 w-8 text-emerald-500" />, component: ExecutionFee },
      { id: 'attorney-fee', title: 'محاسبه حق‌الوکاله', icon: <FileSignature className="h-8 w-8 text-indigo-500" />, component: AttorneyFee },
    ]
  },
  {
    title: 'ورزش و سلامت',
    icon: <HeartPulse className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'workout-timer', title: 'زمان‌سنج حرفه‌ای تمرین', icon: <Dumbbell className="h-8 w-8 text-orange-400" />, component: WorkoutTimer },
      { id: 'bmi-calculator', title: 'محاسبه شاخص توده بدنی (BMI)', icon: <HeartPulse className="h-8 w-8 text-red-400" />, component: BmiCalculator },
      { id: 'beck-depression-test', title: 'تست افسردگی بک', icon: <Brain className="h-8 w-8 text-rose-400" />, component: BeckDepressionTest },
      { id: 'happiness-test', title: 'تست میزان خوشبختی', icon: <Smile className="h-8 w-8 text-yellow-400" />, component: HappinessTest, isWip: undefined },
      { id: 'self-confidence-test', title: 'تست اعتماد به نفس', icon: <Shield className="h-8 w-8 text-blue-400" />, component: SelfConfidenceTest },
      { id: 'color-vision-test', title: 'تست بینایی و رنگ‌بینی', icon: <Palette className="h-8 w-8 text-rose-400" />, component: ColorVisionTest },
      { id: 'hearing-test', title: 'تست شنوایی', icon: <Smile className="h-8 w-8 text-blue-400" />, component: HearingTest },
    ]
  },
  {
    title: 'سرگرمی و بازی',
    icon: <Gamepad2 className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'tic-tac-toe', title: 'بازی دوز (Tic-Tac-Toe)', icon: <Puzzle className="h-8 w-8 text-red-400" />, component: TicTacToe, mode: 'دو حالته' },
      { id: 'guess-the-number', title: 'حدس عدد', icon: <Hash className="h-8 w-8 text-fuchsia-400" />, component: GuessTheNumber, mode: 'مقابل سیستم' },
      { id: 'memory-game', title: 'بازی حافظه', icon: <BrainCircuit className="h-8 w-8 text-sky-400" />, component: MemoryGame, mode: 'تک نفره' },
      { id: '2048', title: 'بازی 2048', icon: <RectangleEllipsis className="h-8 w-8 text-indigo-400" />, component: Game2048, mode: 'تک نفره' },
    ]
  },
  {
    title: 'فال و طالع‌بینی',
    icon: <Gem className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'hafez-fortune', title: 'فال حافظ', icon: <Gem className="h-8 w-8 text-yellow-500" />, component: HafezFortune },
    ]
  },
  {
    title: 'ابزارهای کاربردی',
    icon: <User className="h-6 w-6 text-primary-foreground" />,
    tools: [
      { id: 'sheba-converter', title: 'تبدیل شماره حساب/شبا', icon: <ShieldCheck className="h-8 w-8 text-green-500" />, component: ShebaConverter },
      { id: 'national-id-validator', title: 'اعتبارسنجی کد ملی', icon: <Fingerprint className="h-8 w-8 text-teal-400" />, component: NationalIdValidator },
      { id: 'link-shortener', title: 'کوتاه کننده لینک', icon: <LinkIcon className="h-8 w-8 text-sky-400" />, component: LinkShortener },
      { id: 'vehicle-plate-identifier', title: 'پلاک‌یاب خودرو', icon: <RectangleEllipsis className="h-8 w-8 text-indigo-400" />, component: VehiclePlateIdentifier },
      { id: 'random-number', title: 'تولید عدد تصادفی', icon: <Dices className="h-8 w-8 text-orange-400" />, component: RandomNumberGenerator },
      { id: 'password-generator', title: 'تولید رمز عبور قوی', icon: <KeyRound className="h-8 w-8 text-violet-400" />, component: PasswordGenerator },
      { id: 'qr-code-generator', title: 'ساخت کد QR', icon: <QrCode className="h-8 w-8 text-emerald-400" />, component: QrCodeGenerator },
      { id: 'qr-code-reader', title: 'خواندن کد QR', icon: <Scan className="h-8 w-8 text-blue-400" />, component: QrCodeReader },
      { id: 'image-optimizer', title: 'کاهش حجم تصویر', icon: <Image className="h-8 w-8 text-orange-400" />, component: ImageOptimizer },
      { id: 'text-analyzer', title: 'تحلیلگر متن آنلاین', icon: <FileText className="h-8 w-8 text-yellow-400" />, component: TextAnalyzer },
      { id: 'space-remover', title: 'حذف فواصل اضافه', icon: <Eraser className="h-8 w-8 text-pink-400" />, component: SpaceRemover },
      { id: 'distance-calculator', title: 'محاسبه مسافت بین شهرها', icon: <Map className="h-8 w-8 text-fuchsia-400" />, component: DistanceCalculator },
      { id: 'signature-generator', title: 'تولید امضای دیجیتال', icon: <PenLine className="h-8 w-8 text-slate-400" />, component: SignatureGenerator },
      { id: 'robots-txt-generator', title: 'Robots.txt ساز', icon: <FileCog className="h-8 w-8 text-lime-400" />, component: RobotsTxtGenerator },
      { id: 'ip-detector', title: 'تشخیص IP و موقعیت', icon: <LocateFixed className="h-8 w-8 text-sky-400" />, component: IpDetector },
      { id: 'lottery-tool', title: 'ابزار قرعه کشی آنلاین', icon: <Dices className="h-8 w-8 text-teal-400" />, component: LotteryTool },
      { id: 'post-tracker', title: 'پیگیری مرسوله پستی', icon: <Mailbox className="h-8 w-8 text-rose-400" />, isExternal: true, href: 'https://tracking.post.ir/'},
      { id: 'whois-lookup', title: 'استعلام WHOIS دامنه', icon: <Search className="h-8 w-8 text-emerald-500" />, component: WhoisLookup },
      { id: 'favicon-generator', title: 'سازنده فاوآیکن', icon: <Image className="h-8 w-8 text-orange-500" />, component: FaviconGenerator },
      { id: 'utm-builder', title: 'سازنده لینک UTM', icon: <LinkIcon className="h-8 w-8 text-indigo-500" />, component: UTMBuilder },
      { id: 'whatsapp-link', title: 'سازنده لینک واتساپ', icon: <MessageSquare className="h-8 w-8 text-green-500" />, component: WhatsAppLink },
      { id: 'lorem-ipsum', title: 'تولید متن لورم ایپسوم', icon: <FileText className="h-8 w-8 text-yellow-500" />, component: LoremIpsum },
    ]
  }
];


export default function Home() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.startsWith('#section-')) {
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-primary/50');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-primary/50');
        }, 1200);
      }
    }
  }, [mounted]);
  const initialPrices: Omit<PriceData, 'cryptos'> = {
    GoldOunce: { price: "2320", change: "+0.2%" },
    MesghalGold: { price: "146500000", change: "-0.5%" },
    Gold18K: { price: "33850000", change: "-0.5%" },
    EmamiCoin: { price: "408000000", change: "+1.2%" },
    Dollar: { price: "595000", change: "0" },
    USDT: { price: "596500", change: "+0.1%" },
  };
    
  if (!mounted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-screen-2xl">
            <div className="glass-effect rounded-3xl p-6 mb-8 animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl">

          <div className="mt-2">
            <QuotesRotator effect="flip3d" />
          </div>

          <AdvancedLivePrices initialData={{} as any} />

          {/* دسته‌بندی‌ها حذف شد بر اساس درخواست */}


          {/* Toolbox Shortcuts */}
          <div className="glass-effect rounded-3xl p-4 md:p-8 mb-10">
             <h2 className="col-span-12 text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3 text-glow">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-accent/80 rounded-xl flex items-center justify-center animate-pulse">
                  <Wrench className="w-6 h-6 text-primary-foreground"/>
              </div>
              جعبه ابزار
            </h2>
            <div className="space-y-8">
              {toolCategories.map((category) => (
                <div key={category.title} id={`section-${slugify(category.title)}`} tabIndex={-1}>
                  <h3 className="text-lg font-semibold font-display text-foreground/90 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/70 to-accent/70 rounded-lg flex items-center justify-center">
                      {category.icon}
                    </div>
                    {category.title}
                  </h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {category.tools.map((tool) => {
                      const content = (
                        <div className="glass-effect rounded-2xl p-4 w-full h-full flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                          {tool.isWip && <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-600 border-none">بزودی</Badge>}
                           <ModeBadge mode={tool.mode} />
                          {tool.icon}
                          <span className="font-semibold text-sm text-foreground">{tool.title}</span>
                        </div>
                      );
                      if(tool.isWip) {
                          return <div key={`shortcut-${tool.id}`} className="block opacity-60 cursor-not-allowed">{content}</div>
                      }
                      
                      if (tool.isExternal) {
                        return (
                          <a href={tool.href} key={`shortcut-${tool.id}`} className="block card-hover" target="_blank" rel="noopener noreferrer">
                            {content}
                          </a>
                        )
                      }
                      
                      return (
                      <Link href={`/tool/${tool.id}?section=${encodeURIComponent(slugify(category.title))}`} key={`shortcut-${tool.id}`} className="block card-hover">
                        {content}
                      </Link>
                    )}
                    )}
                  </div>
                   {category.title === 'سرگرمی و بازی' && (
                    <div className="mt-4 text-center">
                      <Link href="/games">
                        <Button variant="secondary" className="h-12 px-6 text-base">
                          مشاهده همه بازی‌ها
                          <ArrowLeft className="mr-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          
           {/* About Us Section */}
           <div className="mt-12 glass-effect rounded-3xl p-6 md:p-8">
             <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
                <div className="p-3 bg-gradient-to-br from-primary/80 to-accent/80 rounded-2xl inline-flex animate-pulse">
                    <Info className="h-10 w-10 text-primary-foreground"/>
                </div>
               <div className='flex-grow'>
                 <h3 className="text-xl font-semibold font-display text-foreground">درباره «تبدیلا»</h3>
                 <p className="text-muted-foreground mt-2 leading-relaxed">
                  «تبدیلا» فقط یک ابزار نیست؛ یک دستیار هوشمند برای تمام لحظاتی است که به محاسبات و تبدیلات سریع، دقیق و زیبا نیاز دارید. ما با وسواس، مجموعه‌ای از بهترین ابزارهای روزمره را در یک پلتفرم مدرن و چشم‌نواز گرد هم آورده‌ایم تا کار شما را آسان‌تر کنیم.
                 </p>
               </div>
             </div>
           </div>
           
           {/* Financial Support Section */}
           <div className="mt-6 glass-effect rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-grow flex items-center gap-6 text-center sm:text-right">
                    <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl inline-flex animate-pulse">
                        <HeartHandshake className="h-10 w-10 text-white"/>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold font-display text-foreground">حمایت از توسعه «تبدیلا»</h3>
                        <p className="text-muted-foreground mt-2">
                          اگر «تبدیلا» برایتان مفید بوده، با حمایت خود به رشد و پیشرفت آن کمک کنید. هر حمایتی، انرژی ما را برای ساخت ابزارهای بهتر دوچندان می‌کند.
                        </p>
                    </div>
                </div>
                 <a href="https://idpay.ir/tbdila" target="_blank" rel="noopener noreferrer">
                    <Button className="relative h-12 px-8 text-base shrink-0 font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:from-pink-600 hover:via-rose-600 hover:to-fuchsia-700 shadow-[0_8px_30px_rgba(244,114,182,0.45)] overflow-hidden rounded-2xl">
                      <span className="relative z-10 inline-flex items-center">
                        حمایت می‌کنم
                        <ArrowLeft className="mr-2 h-5 w-5" />
                      </span>
                      <span className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_10%,white_0%,transparent_35%)]" />
                      <span className="absolute -inset-1 rounded-2xl ring-1 ring-white/10" />
                    </Button>
                 </a>
            </div>
           </div>
        </div>
      </main>
      <footer className="text-center p-6 text-muted-foreground text-sm font-body space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <div className="inline-flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                <span>
                  توسعه داده شده توسط <a href="https://www.hosseintaheri.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">حسین طاهری</a>
                </span>
            </div>
             <div className="inline-flex items-center justify-center gap-2">
                <CalendarClock className="w-5 h-5" />
                <span>
                  آخرین بروزرسانی: شهریور 1404
                </span>
            </div>
            
            <Link href="/terms" className="inline-flex items-center justify-center gap-2 cursor-pointer hover:text-foreground relative z-10" role="button" tabIndex={0}>
                <FileText className="w-5 h-5" />
                <span>قوانین و مقررات</span>
            </Link>

            <Link href="/privacy" className="inline-flex items-center justify-center gap-2 cursor-pointer hover:text-foreground relative z-10" role="button" tabIndex={0}>
                <Shield className="w-5 h-5" />
                <span>سیاست حفظ حریم خصوصی</span>
            </Link>

            <Link href="/feedback" className="inline-flex items-center justify-center gap-2 cursor-pointer hover:text-foreground relative z-10" role="button" tabIndex={0}>
                <MessageSquareHeart className="w-5 h-5" />
                <span>انتقادات و پیشنهادات</span>
            </Link>

        </div>
        <div className="inline-flex items-center justify-center gap-2 pt-2 border-t border-border/50 w-full max-w-lg mx-auto mt-4">
            <p>
              تمام حقوق مادی و معنوی این وبسایت متعلق به مجموعه تبدیلا است.
            </p>
        </div>
      </footer>
      <ScrollToTop />
      <PWAInstallPrompt />
    </div>
  );
}

    