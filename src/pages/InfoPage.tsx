import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShadowsocksCard } from '@/components/ShadowsocksCard';
import { madConfig } from '@/lib/config';
import { Info, Database, Clock, Server, Globe, FileUp } from 'lucide-react';
function formatBytes(bytes: string) {
  const b = parseInt(bytes);
  if (isNaN(b)) return bytes;
  if (b === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(0)) + ' ' + sizes[i];
}
export function InfoPage() {
  const stats = [
    { label: 'دامنه ایمیل', value: madConfig.mailDomain, icon: Globe },
    { label: 'فضای ذخیره‌سازی', value: formatBytes(madConfig.defaultQuota), icon: Database },
    { label: 'حداکثر حجم پیام', value: formatBytes("26214400"), icon: FileUp }, // Simulated MaxMessageSize
    { label: 'مدت نگهداری', value: `${madConfig.retentionDays} ر��ز`, icon: Clock },
  ];
  return (
    <AppLayout>
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Info className="w-8 h-8 text-primary" />
            راهنمای سرور MadMail
          </h1>
          <p className="text-muted-foreground">
            اطلاعات فنی و سیاست‌های نگهداری داده‌ها در این سرور.
          </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-full">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-lg">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {madConfig.ssURL && (
          <div className="mt-8">
            <ShadowsocksCard url={madConfig.ssURL} />
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>پروتکل‌های مورد است��اده</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>
              این سرور از استانداردهای <strong>Autocrypt</strong> و <strong>OpenPGP</strong> برای رمزنگاری دوطرفه استفاده می‌کند.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>اتصال امن از طریق TLS/SSL.</li>
              <li>پشتیبانی از ALPN برای پورت‌های اشتراکی.</li>
              <li>سرویس STUN/TURN برای تماس‌های صوتی و تصویری.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}