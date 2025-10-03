"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Sunrise, Sun, Sunset, Moon, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Major Iranian cities with coordinates
const IRANIAN_CITIES = [
  { name: "تهران", lat: 35.6892, lng: 51.3890, timezone: "Asia/Tehran" },
  { name: "مشهد", lat: 36.2605, lng: 59.6168, timezone: "Asia/Tehran" },
  { name: "اصفهان", lat: 32.6546, lng: 51.6680, timezone: "Asia/Tehran" },
  { name: "شیراز", lat: 29.5918, lng: 52.5837, timezone: "Asia/Tehran" },
  { name: "تبریز", lat: 38.0962, lng: 46.2738, timezone: "Asia/Tehran" },
  { name: "کرج", lat: 35.8327, lng: 50.9916, timezone: "Asia/Tehran" },
  { name: "اهواز", lat: 31.3183, lng: 48.6706, timezone: "Asia/Tehran" },
  { name: "قم", lat: 34.6401, lng: 50.8764, timezone: "Asia/Tehran" },
  { name: "کرمانشاه", lat: 34.3142, lng: 47.0650, timezone: "Asia/Tehran" },
  { name: "ارومیه", lat: 37.5527, lng: 45.0761, timezone: "Asia/Tehran" }
];

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export default function PrayerTimes() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [customLat, setCustomLat] = useState<string>("");
  const [customLng, setCustomLng] = useState<string>("");
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Calculate prayer times using astronomical calculations
  const calculatePrayerTimes = (lat: number, lng: number, date: Date = new Date()) => {
    const times = calculateIslamicPrayerTimes(lat, lng, date);
    
    const prayerData: PrayerTime[] = [
      {
        name: "اذان صبح",
        time: times.fajr,
        icon: <Sunrise className="w-5 h-5" />,
        description: "طلوع فجر",
        color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30"
      },
      {
        name: "طلوع آفتاب",
        time: times.sunrise,
        icon: <Sun className="w-5 h-5" />,
        description: "شروق خورشید",
        color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
      },
      {
        name: "اذان ظهر",
        time: times.dhuhr,
        icon: <Sun className="w-5 h-5" />,
        description: "زوال آفتاب",
        color: "from-orange-500/20 to-red-500/20 border-orange-500/30"
      },
      {
        name: "اذان عصر",
        time: times.asr,
        icon: <Sunset className="w-5 h-5" />,
        description: "عصر",
        color: "from-amber-500/20 to-yellow-500/20 border-amber-500/30"
      },
      {
        name: "اذان مغرب",
        time: times.maghrib,
        icon: <Sunset className="w-5 h-5" />,
        description: "غروب آفتاب",
        color: "from-red-500/20 to-pink-500/20 border-red-500/30"
      },
      {
        name: "اذان عشا",
        time: times.isha,
        icon: <Moon className="w-5 h-5" />,
        description: "فرو رفتن شفق",
        color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30"
      }
    ];

    return prayerData;
  };

  // Simplified Islamic prayer time calculation
  const calculateIslamicPrayerTimes = (lat: number, lng: number, date: Date) => {
    const julianDay = getJulianDay(date);
    const declinationAngle = getSunDeclination(julianDay);
    const equationOfTime = getEquationOfTime(julianDay);
    
    // Convert longitude to time zone offset (approximate)
    const timeZoneOffset = 3.5; // Iran Standard Time (UTC+3:30)
    
    // Calculate prayer times
    const fajrAngle = -18; // Fajr angle
    const ishaAngle = -17; // Isha angle
    
    const fajrTime = calculatePrayerTime(lat, declinationAngle, fajrAngle, equationOfTime, lng, timeZoneOffset);
    const sunriseTime = calculatePrayerTime(lat, declinationAngle, -0.833, equationOfTime, lng, timeZoneOffset);
    const dhuhrTime = 12 + (lng / 15) - timeZoneOffset - (equationOfTime / 60);
    const asrTime = calculateAsrTime(lat, declinationAngle, equationOfTime, lng, timeZoneOffset);
    const maghribTime = calculatePrayerTime(lat, declinationAngle, -0.833, equationOfTime, lng, timeZoneOffset, true);
    const ishaTime = calculatePrayerTime(lat, declinationAngle, ishaAngle, equationOfTime, lng, timeZoneOffset, true);
    
    return {
      fajr: formatTime(fajrTime),
      sunrise: formatTime(sunriseTime),
      dhuhr: formatTime(dhuhrTime),
      asr: formatTime(asrTime),
      maghrib: formatTime(maghribTime),
      isha: formatTime(ishaTime)
    };
  };

  const getJulianDay = (date: Date): number => {
    return date.getTime() / 86400000 + 2440587.5;
  };

  const getSunDeclination = (julianDay: number): number => {
    const n = julianDay - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
    const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
    return Math.asin(Math.sin(lambda) * Math.sin(23.439 * Math.PI / 180)) * 180 / Math.PI;
  };

  const getEquationOfTime = (julianDay: number): number => {
    const n = julianDay - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
    const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
    const alpha = Math.atan2(Math.cos(23.439 * Math.PI / 180) * Math.sin(lambda), Math.cos(lambda)) * 180 / Math.PI;
    return 4 * (L - alpha);
  };

  const calculatePrayerTime = (
    lat: number, 
    declination: number, 
    angle: number, 
    equationOfTime: number, 
    lng: number, 
    timeZone: number, 
    isEvening: boolean = false
  ): number => {
    const latRad = lat * Math.PI / 180;
    const decRad = declination * Math.PI / 180;
    const angleRad = angle * Math.PI / 180;
    
    const cosH = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    
    if (Math.abs(cosH) > 1) return NaN; // No sunrise/sunset at this location and date
    
    const H = Math.acos(cosH) * 180 / Math.PI;
    const time = 12 + (isEvening ? H : -H) / 15 + (lng / 15) - timeZone - (equationOfTime / 60);
    
    return time;
  };

  const calculateAsrTime = (lat: number, declination: number, equationOfTime: number, lng: number, timeZone: number): number => {
    const latRad = lat * Math.PI / 180;
    const decRad = declination * Math.PI / 180;
    
    // Hanafi method: shadow length = object length + noon shadow length
    const shadowRatio = 2 + Math.tan(Math.abs(lat - declination) * Math.PI / 180);
    const angle = Math.atan(1 / shadowRatio) * 180 / Math.PI;
    
    return calculatePrayerTime(lat, declination, -angle, equationOfTime, lng, timeZone, true);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "--:--";
    
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleCalculate = () => {
    setIsLoading(true);
    
    try {
      let lat: number, lng: number;
      
      if (useCustomLocation) {
        lat = parseFloat(customLat);
        lng = parseFloat(customLng);
        
        if (isNaN(lat) || isNaN(lng)) {
          toast({
            title: "خطا در مختصات",
            description: "لطفاً مختصات صحیح وارد کنید",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      } else {
        const city = IRANIAN_CITIES.find(c => c.name === selectedCity);
        if (!city) {
          toast({
            title: "شهر انتخاب نشده",
            description: "لطفاً شهری را انتخاب کنید",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        lat = city.lat;
        lng = city.lng;
      }
      
      const times = calculatePrayerTimes(lat, lng);
      setPrayerTimes(times);
      
      // Find next prayer
      const now = new Date();
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      for (const prayer of times) {
        if (prayer.time > currentTimeStr) {
          setNextPrayer(prayer.name);
          break;
        }
      }
      
      if (!nextPrayer) {
        setNextPrayer(times[0].name); // Next day's first prayer
      }
      
      toast({
        title: "محاسبه انجام شد",
        description: "اوقات شرعی محاسبه شد",
      });
      
    } catch (error) {
      toast({
        title: "خطا در محاسبه",
        description: "امکان محاسبه اوقات شرعی وجود ندارد",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "موقعیت یابی پشتیبانی نمی‌شود",
        description: "مرورگر شما از موقعیت یابی پشتیبانی نمی‌کند",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomLat(position.coords.latitude.toFixed(6));
        setCustomLng(position.coords.longitude.toFixed(6));
        setUseCustomLocation(true);
        toast({
          title: "موقعیت دریافت شد",
          description: "موقعیت جغرافیایی شما تشخیص داده شد",
        });
      },
      (error) => {
        toast({
          title: "خطا در دریافت موقعیت",
          description: "امکان دریافت موقعیت جغرافیایی وجود ندارد",
          variant: "destructive"
        });
      }
    );
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/40 to-emerald-500/20 shadow-[0_0_18px_#10b98155] flex items-center justify-center">
            <Star className="w-5 h-5 text-green-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">اوقات شرعی</div>
            <div className="text-sm text-foreground/70">محاسبه دقیق اذان و طلوع و غروب</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Time Display */}
        <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-300" />
            <span className="text-sm text-blue-300">زمان فعلی</span>
          </div>
          <div className="text-3xl font-bold text-foreground font-mono">
            {currentTime.toLocaleTimeString('fa-IR', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="text-sm text-foreground/70 mt-1">
            {currentTime.toLocaleDateString('fa-IR', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Location Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setUseCustomLocation(!useCustomLocation)}
              variant={useCustomLocation ? "default" : "outline"}
              size="sm"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {useCustomLocation ? 'مختصات دستی' : 'انتخاب شهر'}
            </Button>
            
            {!useCustomLocation && (
              <Button onClick={getCurrentLocation} variant="outline" size="sm">
                موقعیت فعلی
              </Button>
            )}
          </div>

          {useCustomLocation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عرض جغرافیایی</Label>
                <Input
                  type="number"
                  step="0.000001"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  placeholder="35.6892"
                />
              </div>
              <div className="space-y-2">
                <Label>طول جغرافیایی</Label>
                <Input
                  type="number"
                  step="0.000001"
                  value={customLng}
                  onChange={(e) => setCustomLng(e.target.value)}
                  placeholder="51.3890"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>انتخاب شهر</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="شهر خود را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {IRANIAN_CITIES.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleCalculate}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Star className="w-5 h-5 mr-2" />
            )}
            محاسبه اوقات شرعی
          </Button>
        </div>

        {/* Prayer Times Display */}
        <AnimatePresence>
          {prayerTimes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-300 mb-2">اوقات شرعی امروز</h3>
                {nextPrayer && (
                  <div className="text-sm text-foreground/70">
                    اذان بعدی: <span className="text-green-300 font-medium">{nextPrayer}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prayerTimes.map((prayer, index) => (
                  <motion.div
                    key={prayer.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl bg-gradient-to-r ${prayer.color} backdrop-blur-sm`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-foreground/80">
                        {prayer.icon}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{prayer.name}</div>
                        <div className="text-xs text-foreground/70">{prayer.description}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground font-mono text-center">
                      {prayer.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {prayerTimes.length === 0 && (
          <div className="text-center py-8 text-foreground/60 space-y-2">
            <Star className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <p>موقعیت جغرافیایی خود را انتخاب کنید تا اوقات شرعی محاسبه شود</p>
            <p className="text-sm">محاسبات بر اساس روش‌های معتبر اسلامی انجام می‌شود</p>
          </div>
        )}

        {/* Information */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
          <h4 className="text-sm font-bold text-yellow-300 mb-2">توضیحات:</h4>
          <ul className="text-xs text-foreground/70 space-y-1">
            <li>• محاسبات بر اساس روش‌های معتبر نجومی اسلامی</li>
            <li>• زاویه فجر: 18 درجه، زاویه عشا: 17 درجه</li>
            <li>• عصر بر اساس مذهب حنفی (سایه = طول + سایه ظهر)</li>
            <li>• برای دقت بیشتر از تقویم محلی استفاده کنید</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
