
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import NetworkStatusDetector from '@/components/layout/network-status-detector';

const APP_NAME = "تبدیلا";
const APP_DEFAULT_TITLE = "تبدیلا | دستیار هوشمند ابزارهای آنلاین";
const APP_TITLE_TEMPLATE = "%s | تبدیلا";
const APP_DESCRIPTION = "تبدیلا، دستیار هوشمند شما برای انواع محاسبات و تبدیلات روزمره است. مجموعه‌ای از ابزارهای آنلاین، رایگان و هوشمند شامل تبدیل تاریخ، مبدل ارز، محاسبه درصد، BMI و ده‌ها ابزار کاربردی دیگر.";
const APP_URL = "https://tabdila.com";
const APP_THEME_COLOR = "#6A3EAB";
const APP_ICON = "https://uploadkon.ir/uploads/cf7220_252fb04e3a-9e9c-44da-8d7e-7a0345be973aa4-copy.png";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  keywords: [
      "تبدیلا", "دستیار هوشمند", "ابزار آنلاین", "محاسبات آنلاین", "تبدیل واحد",
      "تبدیل تاریخ", "مبدل ارز", "کرونومتر", "محاسبه درصد", "محاسبه سن", 
      "محاسبه BMI", "کد ملی", "شماره شبا", "قیمت طلا", "قیمت دلار", "ماشین حساب", 
      "خلاصه ساز متن", "تولید رمز", "QR Code"
  ],
  authors: [{ name: "حسین طاهری", url: "https://www.hosseintaheri.org/"}],
  creator: "حسین طاهری",
  publisher: "حسین طاهری",
  metadataBase: new URL(APP_URL),
  alternates: {
      canonical: '/',
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: [
      {
        url: APP_ICON,
        width: 1200,
        height: 630,
        alt: 'لوگوی اپلیکیشن تبدیلا',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [APP_ICON],
    creator: '@HoseinTaheri',
  },

  // Icons
  icons: {
    icon: [{ url: APP_ICON, type: 'image/png' }],
    apple: [{ url: APP_ICON, type: 'image/png' }],
  },
};


export const viewport: Viewport = {
  themeColor: APP_THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
         <link rel="icon" href={APP_ICON} type="image/png" />
         <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
      </head>
      <body className="font-body">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="gradient-bg antialiased">
                {children}
                <Toaster />
                <NetworkStatusDetector />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
