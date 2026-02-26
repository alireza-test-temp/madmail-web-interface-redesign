import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShadowsocksCard } from '@/components/ShadowsocksCard';
import { madConfig } from '@/lib/config';
import { Info, Database, Clock, Globe, FileUp, ShieldCheck } from 'lucide-react';
function formatBytes(bytes: string) {
  const b = parseInt(bytes);
  if (isNaN(b) || b < 0) return 'نامحدود';
  if (b === 0) return '0 بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلو��ایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
export function InfoPage() {
  const stats = [
    { label: 'دامنه ایمیل', value: madConfig.mailDomain, icon: Globe, color: 'text-blue-500' },
    { label: 'سهمیه ف��ا', value: formatBytes(madConfig.defaultQuota), icon: Database, color: 'text-indigo-500' },
    { label: 'حداکثر حجم پیام', value: formatBytes("26214400"), icon: FileUp, color: 'text-purple-500' },
    { label: 'مدت نگهداری', value: `${madConfig.retentionDays} روز`, icon: Clock, color: 'text-amber-500' },
  ];
  return (
    <AppLayout>
      <div className="space-y-10 max-w-4xl mx-auto">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Info className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black">اطلاعات و راهنما</h1>
              <p className="text-muted-foreground text-lg">جزئیات فنی و سیاست‌های اجرایی سرور MadMail.</p>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-2 shadow-sm">
                <CardContent className="pt-6 flex flex-col items-center text-center gap-4">
                  <div className={`p-4 bg-muted rounded-2xl ${stat.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                    <p className="font-black text-xl tracking-tight">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                امنیت داده‌ها
              </CardTitle>
              <CardDescription>چگونه از حریم خصوصی شما محافظت می‌کنیم.</CardDescription>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground leading-relaxed space-y-4">
              <p>
                سرور MadMail یک <strong>میل‌سرور متمرکز بر حریم خصوصی</strong> است. ما محتوای پیام‌های شما را بررسی نمی‌کنیم و تمامی ارتباطات به صورت خودکار با PGP رمزنگاری می‌شوند.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>عدم ذخی��ه‌سازی آدرس‌های IP و متادیتا.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>پشتیبانی کامل از پروتکل Autocrypt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>حذف خودکار و دائمی ��اده‌ها پس از انقضا.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <div className="space-y-6">
            {madConfig.ssURL && <ShadowsocksCard url={madConfig.ssURL} />}
            <Card className="bg-primary/5 border-dashed border-2 border-primary/20">
              <CardContent className="pt-6">
                <h4 className="font-bold mb-2">نیاز به تماس صوتی/تصویری؟</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  این سرور مجهز به پروتکل‌های STUN و TURN است که به شما اجازه می‌دهد تماس‌های باکیفیت و پایداری را در شرایط سخت شبکه تجربه کنید.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <footer className="text-center pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            نسخه سیستم: {madConfig.version} | وضعیت سرور: عملیاتی و پایدار
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}