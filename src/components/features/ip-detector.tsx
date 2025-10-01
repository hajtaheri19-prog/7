"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type IpInfo = {
  ip?: string; query?: string; ipAddress?: string;
  country?: string; country_name?: string; countryName?: string; location?: any;
  regionName?: string; region?: string;
  city?: string; cityName?: string;
  lat?: number; latitude?: number;
  lon?: number; longitude?: number;
  isp?: string; org?: string; company?: { name?: string };
  timezone?: string; timeZone?: string;
  postal?: string; postal_code?: string; zipCode?: string;
};

async function fetchWithFallback(urls: string[]) {
  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      return await response.json();
    } catch (e) {
      // continue
    }
  }
  throw new Error('All IP fetch attempts failed.');
}

export default function IpDetector() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    const ipApiUrls = [
      'https://my-ip-api.haj-taheri19.workers.dev/',
      'https://ip-api.com/json/?fields=status,message,country,regionName,city,lat,lon,timezone,isp,org,query,postal',
      'https://freeipapi.com/api/json/',
      'https://ipinfo.io/json',
      'https://ipapi.co/json/'
    ];
    try {
      const data: IpInfo = await fetchWithFallback(ipApiUrls);
      const ipAddress = data.ip || data.query || data.ipAddress || '---';
      let ipv4: string | null = null;
      if (ipAddress.includes(':')) {
        try {
          const r = await fetch('https://api.ipify.org?format=json');
          if (r.ok) { const j = await r.json(); ipv4 = j.ip; }
        } catch {}
      }
      const country = data.country || data.country_name || data.countryName || data.location?.country || '';
      const region = data.regionName || data.region || data.location?.state || '';
      const city = data.city || data.cityName || data.location?.city || '';
      const lat = (data.lat || data.latitude || data.location?.latitude) as number | undefined;
      const lon = (data.lon || data.longitude || data.location?.longitude) as number | undefined;
      const isp = data.isp || data.company?.name || '';
      const org = data.org || '';
      const timezone = data.timezone || data.timeZone || data.location?.timezone || '---';
      const postal = data.postal || data.postal_code || data.zipCode || data.location?.zip || '---';
      setResult({ ipAddress, ipv4, country, region, city, lat, lon, isp, org, timezone, postal });
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Card className="glass-effect border-0">
      <CardHeader>
        <CardTitle>تشخیص IP و موقعیت</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">با fallback از چند سرویس عمومی</div>
        {loading && <div className="text-sm">درحال دریافت...</div>}
        {error && <div className="text-sm text-red-400">خطا: {error}</div>}
        {result && (
          <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>IP: <b>{result.ipAddress}</b>{result.ipv4 ? ` (IPv4: ${result.ipv4})` : ''}</div>
            <div>مکان: <b>{result.city}, {result.region}, {result.country}</b></div>
            <div>مختصات: <b>{result.lat ? result.lat.toFixed(4) : '---'}, {result.lon ? result.lon.toFixed(4) : '---'}</b></div>
            <div>ISP/Org: <b>{result.isp || result.org || '---'}</b></div>
            <div>Timezone: <b>{result.timezone}</b></div>
            <div>Postal: <b>{result.postal}</b></div>
          </div>
        )}
        <div className="pt-2">
          <Button variant="secondary" onClick={load} disabled={loading}>دریافت مجدد</Button>
        </div>
      </CardContent>
    </Card>
  );
}


