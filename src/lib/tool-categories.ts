import React from 'react';
import { 
  Calculator, 
  Calendar, 
  DollarSign, 
  Clock, 
  Hash, 
  CreditCard, 
  FileText, 
  TrendingDown,
  Zap,
  Globe,
  Timer,
  Shield,
  Key,
  QrCode,
  Palette,
  Code,
  Image,
  BookOpen,
  Eye,
  Volume2,
  Share2,
  Heart,
  BrainCircuit,
  Scale,
  Landmark,
  CalendarDays,
  Repeat,
  SpellCheck,
  Binary,
  CalendarClock,
  Gift,
  Hourglass,
  Wallet,
  Bitcoin,
  Banknote,
  PiggyBank,
  Percent,
  HeartPulse,
  Dumbbell,
  User,
  ShieldCheck,
  Fingerprint,
  RectangleEllipsis,
  Dices,
  KeyRound,
  Scan,
  LocateFixed,
  Map,
  PenLine,
  Link as LinkIcon,
  Search,
  MessageSquare,
  Brain,
  Smile,
  Gem,
  FileSignature,
  Sigma,
  Square,
  FlaskConical,
  Gamepad2,
  Puzzle,
  Bot,
  Mailbox,
  ReceiptText,
  CalendarCheck,
  Eraser,
  FileCog,
  Monitor,
  BookText,
  TrendingUp
} from 'lucide-react';

// Import components
import AgeCalculator from '@/components/features/age-calculator';
import CurrencyConverter from '@/components/features/currency-converter';
import InflationCalculator from '@/components/features/inflation-calculator';
import ReadingTimeCalculator from '@/components/features/reading-time-calculator';
import PersianKeyboard from '@/components/features/persian-keyboard';
import ColorVisionTest from '@/components/features/color-vision-test';
import HearingTest from '@/components/features/hearing-test';
import VisionTestHub from '@/components/features/vision-test-hub';
import TimestampConverter from '@/components/features/timestamp-converter';
import DateDifferenceCalculator from '@/components/features/date-difference-calculator';
import SocialMediaSharing from '@/components/features/social-media-sharing';
import HafezFortune from '@/components/features/hafez-fortune';

// Import all existing components
import UnitConverter from '@/components/features/unit-converter';
import DateConverter from '@/components/features/date-converter';
import CryptoConverter from '@/components/features/crypto-converter';
import BmiCalculator from '@/components/features/bmi-calculator';
import PercentageCalculator from '@/components/features/percentage-calculator';
import WomenHealthCalculator from '@/components/features/women-health-calculator';
import VatCalculator from '@/components/features/vat-calculator';
import LoanCalculator from '@/components/features/loan-calculator';
import GpaCalculator from '@/components/features/gpa-calculator';
import Stopwatch from '@/components/features/stopwatch';
import CountdownTimer from '@/components/features/countdown-timer';
import DepositCalculator from '@/components/features/deposit-calculator';
import NumberToWordsConverter from '@/components/features/number-to-words-converter';
import NumberSystemConverter from '@/components/features/number-system-converter';
import PasswordGenerator from '@/components/features/password-generator';
import RandomNumberGenerator from '@/components/features/random-number-generator';
import BinaryConverter from '@/components/features/binary-converter';
import DistanceCalculator from '@/components/features/distance-calculator';
import VehiclePlateIdentifier from '@/components/features/vehicle-plate-identifier';
import TextAnalyzer from '@/components/features/text-analyzer';
import ImageOptimizer from '@/components/features/image-optimizer';
import TextSummarizer from '@/components/features/text-summarizer';
import RialTomanConverter from '@/components/features/rial-toman-converter';
import SavingsCalculator from '@/components/features/savings-calculator';
import NationalIdValidator from '@/components/features/national-id-validator';
import WorkoutTimer from '@/components/features/workout-timer';
import ShebaConverter from '@/components/features/sheba-converter';
import QrCodeGenerator from '@/components/features/qr-code-generator';
import QrCodeReader from '@/components/features/qr-code-reader';
import TicTacToe from '@/components/features/tic-tac-toe';
import LegalFinancialChatbot from '@/components/features/legal-financial-chatbot';
import SignatureGenerator from '@/components/features/signature-generator';
import MemoryGame from '@/components/features/memory-game';
import GuessTheNumber from '@/components/features/guess-the-number';
import Game2048 from '@/components/features/game-2048';
import LotteryTool from '@/components/features/lottery-tool';
import InvoiceGenerator from '@/components/features/invoice-generator';
import ColorConverter from '@/components/features/color-converter';
import Base64Converter from '@/components/features/base64-converter';
import BaseConverter from '@/components/features/base-converter';
import LinkShortener from '@/components/features/link-shortener';
import SocialPostGenerator from '@/components/features/social-post-generator';
import OcrExtractor from '@/components/features/ocr-extractor';
import EventsCalendar from '@/components/features/events-calendar';
import MorseConverter from '@/components/features/morse-converter';
import IpDetector from '@/components/features/ip-detector';
import PdfWordConverter from '@/components/features/pdf-word-converter';
import PdfImageConverter from '@/components/features/pdf-image-converter';
import GoldCoinCalculator from '@/components/features/gold-coin-calculator';
import RobotsTxtGenerator from '@/components/features/robots-txt-generator';
import SpaceRemover from '@/components/features/space-remover';
import FactorialCalculator from '@/components/features/factorial-calculator';
import SquareRootCalculator from '@/components/features/square-root-calculator';
import FaviconGenerator from '@/components/features/favicon-generator';
import UTMBuilder from '@/components/features/utm-builder';
import WhatsAppLink from '@/components/features/whatsapp-link';
import LoremIpsum from '@/components/features/lorem-ipsum';
import IranTime from '@/components/features/iran-time';
import OnlineAlarm from '@/components/features/online-alarm';
import BeckDepressionTest from '@/components/features/beck-depression-test';
import HappinessTest from '@/components/features/happiness-test';
import SelfConfidenceTest from '@/components/features/self-confidence-test';
import MehriehCalculator from '@/components/features/mehrieh-calculator';
import ExecutionFee from '@/components/features/execution-fee';
import AttorneyFee from '@/components/features/attorney-fee';

export interface ToolItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  component?: React.ComponentType;
  mode?: string;
  isWip?: boolean;
  isExternal?: boolean;
  href?: string;
  externalUrl?: string;
  color?: string;
}

export interface ToolCategory {
  title: string;
  slug: string;
  icon: React.ReactNode;
  color?: string;
  tools: ToolItem[];
}

export const toolCategories: ToolCategory[] = [
  {
    title: 'ابزارهای هوش مصنوعی',
    slug: 'ai-tools',
    icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }),
    color: '#22c55e',
    tools: [
      {
        id: 'text-summarizer',
        title: 'خلاصه‌ساز هوشمند متن',
        icon: React.createElement(BookText, { className: "w-5 h-5" }),
        component: TextSummarizer,
        mode: 'client',
        color: '#f59e0b'
      },
      {
        id: 'legal-financial-chatbot',
        title: 'چت‌بات حقوقی و مالی',
        icon: React.createElement(Bot, { className: "w-5 h-5" }),
        component: LegalFinancialChatbot,
        mode: 'client',
        color: '#06b6d4'
      },
      {
        id: 'social-post-generator',
        title: 'تولید پست شبکه‌های اجتماعی',
        icon: React.createElement(RectangleEllipsis, { className: "w-5 h-5" }),
        component: SocialPostGenerator,
        mode: 'client',
        color: '#a855f7'
      },
      {
        id: 'ocr-extractor',
        title: 'استخراج متن از تصویر و PDF',
        icon: React.createElement(Scan, { className: "w-5 h-5" }),
        component: OcrExtractor,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'pdf-word-converter',
        title: 'تبدیل PDF به Word (و بالعکس)',
        icon: React.createElement(RectangleEllipsis, { className: "w-5 h-5" }),
        component: PdfWordConverter,
        mode: 'client',
        color: '#ef4444'
      },
      {
        id: 'pdf-image-converter',
        title: 'تبدیل PDF به عکس (و برعکس)',
        icon: React.createElement(RectangleEllipsis, { className: "w-5 h-5" }),
        component: PdfImageConverter,
        mode: 'client',
        color: '#3b82f6'
      }
    ]
  },
  {
    title: 'مبدل‌ها',
    slug: 'converters',
    icon: React.createElement(FlaskConical, { className: "w-5 h-5" }),
    color: '#38bdf8',
    tools: [
      {
        id: 'unit-converter',
        title: 'تبدیل واحد (طول، وزن، دما)',
        icon: React.createElement(Scale, { className: "w-5 h-5" }),
        component: UnitConverter,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'currency-converter',
        title: 'تبدیل ارزهای رایج',
        icon: React.createElement(Landmark, { className: "w-5 h-5" }),
        component: CurrencyConverter,
        mode: 'client',
        color: '#0ea5e9'
      },
      {
        id: 'date-converter',
        title: 'تبدیل تاریخ شمسی و میلادی',
        icon: React.createElement(CalendarDays, { className: "w-5 h-5" }),
        component: DateConverter,
        mode: 'client',
        color: '#a855f7'
      },
      {
        id: 'rial-toman-converter',
        title: 'تبدیل ریال و تومان',
        icon: React.createElement(Repeat, { className: "w-5 h-5" }),
        component: RialTomanConverter,
        mode: 'client',
        color: '#10b981'
      },
      {
        id: 'number-to-words',
        title: 'تبدیل عدد به حروف',
        icon: React.createElement(SpellCheck, { className: "w-5 h-5" }),
        component: NumberToWordsConverter,
        mode: 'client',
        color: '#f59e0b'
      },
      {
        id: 'number-system',
        title: 'تبدیل ارقام فارسی و انگلیسی',
        icon: React.createElement(Binary, { className: "w-5 h-5" }),
        component: NumberSystemConverter,
        mode: 'client',
        color: '#38bdf8'
      },
      {
        id: 'binary-converter',
        title: 'تبدیل متن و باینری',
        icon: React.createElement(Binary, { className: "w-5 h-5" }),
        component: BinaryConverter,
        mode: 'client',
        color: '#fb7185'
      },
      {
        id: 'base-converter',
        title: 'مبدل مبنای اعداد',
        icon: React.createElement(Binary, { className: "w-5 h-5" }),
        component: BaseConverter,
        mode: 'client',
        color: '#f97316'
      },
      {
        id: 'color-converter',
        title: 'مبدل رنگ (HEX, RGB, HSL)',
        icon: React.createElement(Palette, { className: "w-5 h-5" }),
        component: ColorConverter,
        mode: 'client',
        color: '#ef4444'
      },
      {
        id: 'base64-converter',
        title: 'تبدیل متن و فایل به Base64',
        icon: React.createElement(Hash, { className: "w-5 h-5" }),
        component: Base64Converter,
        mode: 'client',
        color: '#a78bfa'
      },
      {
        id: 'persian-keyboard',
        title: 'کیبورد فارسی آنلاین',
        icon: React.createElement(Key, { className: "w-5 h-5" }),
        component: PersianKeyboard,
        mode: 'client',
        color: '#22d3ee'
      },
      {
        id: 'timestamp-converter',
        title: 'مبدل تایم‌استمپ',
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
        component: TimestampConverter,
        mode: 'client',
        color: '#60a5fa'
      }
    ]
  },
  {
    title: 'ابزارهای زمان و تاریخ',
    slug: 'time-date',
    icon: React.createElement(CalendarClock, { className: "w-5 h-5" }),
    color: '#f472b6',
    tools: [
      {
        id: 'age-calculator',
        title: 'محاسبه دقیق سن',
        icon: React.createElement(Gift, { className: "w-5 h-5" }),
        component: AgeCalculator,
        mode: 'client',
        color: '#f59e0b'
      },
      {
        id: 'stopwatch',
        title: 'کرونومتر حرفه‌ای',
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
        component: Stopwatch,
        mode: 'client',
        color: '#60a5fa'
      },
      {
        id: 'countdown-timer',
        title: 'تایمر شمارش معکوس',
        icon: React.createElement(Hourglass, { className: "w-5 h-5" }),
        component: CountdownTimer,
        mode: 'client',
        color: '#06b6d4'
      },
      {
        id: 'events-calendar',
        title: 'تقویم مناسبت‌های ایران',
        icon: React.createElement(CalendarCheck, { className: "w-5 h-5" }),
        component: EventsCalendar,
        mode: 'client',
        color: '#a78bfa'
      },
      {
        id: 'iran-time',
        title: 'ساعت و تاریخ ایران',
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
        component: IranTime,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'online-alarm',
        title: 'تنظیم زنگ هشدار آنلاین',
        icon: React.createElement(Timer, { className: "w-5 h-5" }),
        component: OnlineAlarm,
        mode: 'client',
        color: '#f472b6'
      },
      {
        id: 'date-difference-calculator',
        title: 'محاسبه اختلاف دو تاریخ',
        icon: React.createElement(Calendar, { className: "w-5 h-5" }),
        component: DateDifferenceCalculator,
        mode: 'client',
        color: '#94a3b8'
      }
    ]
  },
  {
    title: 'محاسبات عمومی و مالی',
    slug: 'calculations',
    icon: React.createElement(Wallet, { className: "w-5 h-5" }),
    color: '#34d399',
    tools: [
      {
        id: 'gpa-calculator',
        title: 'معدل‌سنج هوشمند',
        icon: React.createElement(Calculator, { className: "w-5 h-5" }),
        component: GpaCalculator,
        mode: 'client',
        color: '#a78bfa'
      },
      {
        id: 'crypto-converter',
        title: 'نرخ لحظه‌ای ارز دیجیتال',
        icon: React.createElement(Bitcoin, { className: "w-5 h-5" }),
        component: CryptoConverter,
        mode: 'client',
        color: '#f59e0b'
      },
      {
        id: 'loan-calculator',
        title: 'محاسبه اقساط وام',
        icon: React.createElement(Banknote, { className: "w-5 h-5" }),
        component: LoanCalculator,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'deposit-calculator',
        title: 'محاسبه سود سپرده',
        icon: React.createElement(PiggyBank, { className: "w-5 h-5" }),
        component: DepositCalculator,
        mode: 'client',
        color: '#f472b6'
      },
      {
        id: 'savings-calculator',
        title: 'محاسبه‌گر پس‌انداز',
        icon: React.createElement(TrendingUp, { className: "w-5 h-5" }),
        component: SavingsCalculator,
        mode: 'client',
        color: '#06b6d4'
      },
      {
        id: 'percentage-calculator',
        title: 'محاسبه درصد',
        icon: React.createElement(Percent, { className: "w-5 h-5" }),
        component: PercentageCalculator,
        mode: 'client',
        color: '#fb7185'
      },
      {
        id: 'vat-calculator',
        title: 'محاسبه ارزش افزوده',
        icon: React.createElement(Percent, { className: "w-5 h-5" }),
        component: VatCalculator,
        mode: 'client',
        color: '#22d3ee'
      },
      {
        id: 'inflation-calculator',
        title: 'ماشین شهودی تبدیل ارزش پول',
        icon: React.createElement(TrendingDown, { className: "w-5 h-5" }),
        component: InflationCalculator,
        mode: 'client',
        color: '#ef4444'
      },
      {
        id: 'reading-time-calculator',
        title: 'محاسبه زمان خواندن متن',
        icon: React.createElement(BookOpen, { className: "w-5 h-5" }),
        component: ReadingTimeCalculator,
        mode: 'client',
        color: '#60a5fa'
      },
      {
        id: 'morse-converter',
        title: 'مبدل متن ↔ مورس',
        icon: React.createElement(Binary, { className: "w-5 h-5" }),
        component: MorseConverter,
        mode: 'client',
        color: '#f97316'
      },
      {
        id: 'invoice-generator',
        title: 'فاکتورساز حرفه‌ای',
        icon: React.createElement(ReceiptText, { className: "w-5 h-5" }),
        component: InvoiceGenerator,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'gold-coin-calculator',
        title: 'محاسبه‌گر طلا و سکه',
        icon: React.createElement(Gem, { className: "w-5 h-5" }),
        component: GoldCoinCalculator,
        mode: 'client',
        color: '#a78bfa'
      },
      {
        id: 'factorial-calculator',
        title: 'محاسبه فاکتوریل (!n)',
        icon: React.createElement(Sigma, { className: "w-5 h-5" }),
        component: FactorialCalculator,
        mode: 'client',
        color: '#06b6d4'
      },
      {
        id: 'square-root-calculator',
        title: 'محاسبه جذر (√n)',
        icon: React.createElement(Square, { className: "w-5 h-5" }),
        component: SquareRootCalculator,
        mode: 'client',
        color: '#94a3b8'
      },
      {
        id: 'mehrieh-calculator',
        title: 'محاسبه مهریه به نرخ روز',
        icon: React.createElement(Gem, { className: "w-5 h-5" }),
        component: MehriehCalculator,
        mode: 'client',
        color: '#f472b6'
      },
      {
        id: 'execution-fee',
        title: 'محاسبه نیم عشر دولتی',
        icon: React.createElement(Scale, { className: "w-5 h-5" }),
        component: ExecutionFee,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'attorney-fee',
        title: 'محاسبه حق‌الوکاله',
        icon: React.createElement(FileSignature, { className: "w-5 h-5" }),
        component: AttorneyFee,
        mode: 'client',
        color: '#0ea5e9'
      }
    ]
  },
  {
    title: 'ورزش و سلامت',
    slug: 'health-fitness',
    icon: React.createElement(HeartPulse, { className: "w-5 h-5" }),
    color: '#ef4444',
    tools: [
      {
        id: 'workout-timer',
        title: 'زمان‌سنج حرفه‌ای تمرین',
        icon: React.createElement(Dumbbell, { className: "w-5 h-5" }),
        component: WorkoutTimer,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'bmi-calculator',
        title: 'محاسبه شاخص توده بدنی (BMI)',
        icon: React.createElement(HeartPulse, { className: "w-5 h-5" }),
        component: BmiCalculator,
        mode: 'client',
        color: '#ef4444'
      },
      {
        id: 'beck-depression-test',
        title: 'تست افسردگی بک',
        icon: React.createElement(Brain, { className: "w-5 h-5" }),
        component: BeckDepressionTest,
        mode: 'client',
        color: '#a78bfa'
      },
      {
        id: 'happiness-test',
        title: 'تست میزان خوشبختی',
        icon: React.createElement(Smile, { className: "w-5 h-5" }),
        component: HappinessTest,
        mode: 'client',
        color: '#f59e0b'
      },
      {
        id: 'self-confidence-test',
        title: 'تست اعتماد به نفس',
        icon: React.createElement(Shield, { className: "w-5 h-5" }),
        component: SelfConfidenceTest,
        mode: 'client',
        color: '#06b6d4'
      },
      {
        id: 'color-vision-test',
        title: 'تست بینایی و رنگ‌بینی',
        icon: React.createElement(Eye, { className: "w-5 h-5" }),
        component: ColorVisionTest,
        mode: 'client',
        color: '#22d3ee'
      },
      {
        id: 'hearing-test',
        title: 'تست شنوایی',
        icon: React.createElement(Volume2, { className: "w-5 h-5" }),
        component: HearingTest,
        mode: 'client',
        color: '#60a5fa'
      }
      ,
      {
        id: 'vision-test-hub',
        title: 'مرکز تست بینایی (استاندارد/VIP)',
        icon: React.createElement(Eye, { className: "w-5 h-5" }),
        component: VisionTestHub,
        mode: 'client',
        color: '#f59e0b'
      }
    ]
  },
  {
    title: 'سرگرمی و بازی',
    slug: 'games',
    icon: React.createElement(Gamepad2, { className: "w-5 h-5" }),
    color: '#f59e0b',
    tools: [
      {
        id: 'tic-tac-toe',
        title: 'بازی دوز (Tic-Tac-Toe)',
        icon: React.createElement(Puzzle, { className: "w-5 h-5" }),
        component: TicTacToe,
        mode: 'دو حالته',
        color: '#f59e0b'
      },
      {
        id: 'guess-the-number',
        title: 'حدس عدد',
        icon: React.createElement(Hash, { className: "w-5 h-5" }),
        component: GuessTheNumber,
        mode: 'مقابل سیستم',
        color: '#60a5fa'
      },
      {
        id: 'memory-game',
        title: 'بازی حافظه',
        icon: React.createElement(BrainCircuit, { className: "w-5 h-5" }),
        component: MemoryGame,
        mode: 'تک نفره',
        color: '#a78bfa'
      },
      {
        id: '2048',
        title: 'بازی 2048',
        icon: React.createElement(RectangleEllipsis, { className: "w-5 h-5" }),
        component: Game2048,
        mode: 'تک نفره',
        color: '#22c55e'
      }
    ]
  },
  {
    title: 'ابزارهای کاربردی',
    slug: 'utilities',
    icon: React.createElement(User, { className: "w-5 h-5" }),
    color: '#60a5fa',
    tools: [
      {
        id: 'sheba-converter',
        title: 'تبدیل شماره حساب/شبا',
        icon: React.createElement(ShieldCheck, { className: "w-5 h-5" }),
        component: ShebaConverter,
        mode: 'client',
        color: '#06b6d4'
      },
      {
        id: 'national-id-validator',
        title: 'اعتبارسنجی کد ملی',
        icon: React.createElement(Fingerprint, { className: "w-5 h-5" }),
        component: NationalIdValidator,
        mode: 'client',
        color: '#ef4444'
      },
      {
        id: 'link-shortener',
        title: 'کوتاه کننده لینک',
        icon: React.createElement(LinkIcon, { className: "w-5 h-5" }),
        component: LinkShortener,
        mode: 'client',
        color: '#0ea5e9'
      },
      {
        id: 'vehicle-plate-identifier',
        title: 'پلاک‌یاب خودرو',
        icon: React.createElement(RectangleEllipsis, { className: "w-5 h-5" }),
        component: VehiclePlateIdentifier,
        mode: 'client',
        color: '#a78bfa'
      },
      {
        id: 'random-number',
        title: 'تولید عدد تصادفی',
        icon: React.createElement(Dices, { className: "w-5 h-5" }),
        component: RandomNumberGenerator,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'password-generator',
        title: 'تولید رمز عبور قوی',
        icon: React.createElement(KeyRound, { className: "w-5 h-5" }),
        component: PasswordGenerator,
        mode: 'client',
        color: '#f59e0b'
      },
      {
        id: 'qr-code-generator',
        title: 'ساخت کد QR',
        icon: React.createElement(QrCode, { className: "w-5 h-5" }),
        component: QrCodeGenerator,
        mode: 'client',
        color: '#06b6d4'
      },
      {
        id: 'qr-code-reader',
        title: 'خواندن کد QR',
        icon: React.createElement(Scan, { className: "w-5 h-5" }),
        component: QrCodeReader,
        mode: 'client',
        color: '#22d3ee'
      },
      {
        id: 'image-optimizer',
        title: 'کاهش حجم تصویر',
        icon: React.createElement(Image, { className: "w-5 h-5" }),
        component: ImageOptimizer,
        mode: 'client',
        color: '#60a5fa'
      },
      {
        id: 'text-analyzer',
        title: 'تحلیلگر متن آنلاین',
        icon: React.createElement(FileText, { className: "w-5 h-5" }),
        component: TextAnalyzer,
        mode: 'client'
      },
      {
        id: 'space-remover',
        title: 'حذف فواصل اضافه',
        icon: React.createElement(Eraser, { className: "w-5 h-5" }),
        component: SpaceRemover,
        mode: 'client'
      },
      {
        id: 'distance-calculator',
        title: 'محاسبه مسافت بین شهرها',
        icon: React.createElement(Map, { className: "w-5 h-5" }),
        component: DistanceCalculator,
        mode: 'client'
      },
      {
        id: 'signature-generator',
        title: 'تولید امضای دیجیتال',
        icon: React.createElement(PenLine, { className: "w-5 h-5" }),
        component: SignatureGenerator,
        mode: 'client'
      },
      {
        id: 'robots-txt-generator',
        title: 'Robots.txt ساز',
        icon: React.createElement(FileCog, { className: "w-5 h-5" }),
        component: RobotsTxtGenerator,
        mode: 'client'
      },
      {
        id: 'ip-detector',
        title: 'تشخیص IP و موقعیت',
        icon: React.createElement(LocateFixed, { className: "w-5 h-5" }),
        component: IpDetector,
        mode: 'client'
      },
      {
        id: 'lottery-tool',
        title: 'ابزار قرعه کشی آنلاین',
        icon: React.createElement(Dices, { className: "w-5 h-5" }),
        component: LotteryTool,
        mode: 'client'
      },
      {
        id: 'post-tracker',
        title: 'پیگیری مرسوله پستی',
        icon: React.createElement(Mailbox, { className: "w-5 h-5" }),
        isExternal: true,
        href: 'https://tracking.post.ir/'
      },
      {
        id: 'favicon-generator',
        title: 'سازنده فاوآیکن',
        icon: React.createElement(Image, { className: "w-5 h-5" }),
        component: FaviconGenerator,
        mode: 'client',
        color: '#a78bfa'
      },
      {
        id: 'utm-builder',
        title: 'سازنده لینک UTM',
        icon: React.createElement(LinkIcon, { className: "w-5 h-5" }),
        component: UTMBuilder,
        mode: 'client',
        color: '#22c55e'
      },
      {
        id: 'whatsapp-link',
        title: 'سازنده لینک واتساپ',
        icon: React.createElement(MessageSquare, { className: "w-5 h-5" }),
        component: WhatsAppLink,
        mode: 'client',
        color: '#f59e0b'
      },
      {
        id: 'lorem-ipsum',
        title: 'تولید متن لورم ایپسوم',
        icon: React.createElement(FileText, { className: "w-5 h-5" }),
        component: LoremIpsum,
        mode: 'client'
      },
      {
        id: 'social-media-sharing',
        title: 'اشتراک‌گذاری شبکه‌های اجتماعی',
        icon: React.createElement(Share2, { className: "w-5 h-5" }),
        component: SocialMediaSharing,
        mode: 'client',
        color: '#06b6d4'
      }
    ]
  },
  {
    title: 'فال و طالع‌بینی',
    slug: 'fortune',
    icon: React.createElement(Heart, { className: "w-5 h-5" }),
    color: '#f59e0b',
    tools: [
      {
        id: 'hafez-fortune',
        title: 'فال حافظ',
        icon: React.createElement(Heart, { className: "w-5 h-5" }),
        component: HafezFortune,
        mode: 'client',
        color: '#ef4444'
      }
    ]
  }
];