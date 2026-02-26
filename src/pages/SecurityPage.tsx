import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Lock, EyeOff, ShieldCheck, Zap, ShieldOff, AlertTriangle } from 'lucide-react';
import { madConfig } from '@/lib/config';
import { ShadowsocksCard } from '@/components/ShadowsocksCard';
import { motion } from 'framer-motion';
export function SecurityPage() {
  const securityTips = [
    "اثر انگشت (Fingerprint) مخاطب را حتماً به صورت حضوری یا از طریق کانال امن چک کنید.",
    "در صورت وجود اختلال در شبکه، حتماً پروکسی Shadowsocks را در تنظیمات DeltaChat فعال کنید.",
    "از باز کردن فایل‌های مشکوک و لینک‌های ناشناخته اکیداً خودداری نمایید.",
    "قابلیت 'حذف خودکار پیام' (Burn-on-read) را برای گفتگوهای حساس فعال کنید.",
    "اپلیکیشن DeltaChat را همیشه از منابع رسمی به‌روز نگه دارید."
  ];
  const features = [
    { label: 'رمزنگاری دوطرفه', desc: 'تمامی پیام‌ها با استاندارده��ی نظامی رمزنگاری می‌شوند.', icon: Lock },
    { label: 'حذف خودکار', desc: 'داده‌ها پس از ۲۰ روز به طور کامل از هسته سرور حذف می‌شوند.', icon: EyeOff },
    { label: 'پروتکل امن', desc: '��ستفاده از TLS 1.3 برای تمامی تبادلات داده‌ای سرور.', icon: ShieldCheck },
  ];
  return (
    <AppLayout>
      <div className="space-y-12 max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-primary/10 text-primary shadow-sm mb-2">
            <Shield className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">امنیت و حریم خصوصی</h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            MadMail با هدف ایجاد بستری امن برای ارتباطات آزاد طراحی شده است. 
            در اینجا امنیت یک انتخاب نیست، بلکه یک استاندارد اجباری است.
          </p>
        </motion.header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="border-none bg-muted/40 hover:bg-muted/60 transition-colors">
              <CardContent className="pt-8 text-center space-y-3">
                <div className="p-3 bg-background rounded-2xl w-fit mx-auto shadow-sm">
                  <f.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-black text-lg">{f.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary" />
                توصیه‌های کلیدی برای کاربران
              </CardTitle>
              <CardDescription>رعایت این موارد امنیت شما را چندین برابر می‌کند.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {securityTips.map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-accent/30 border border-transparent hover:border-primary/10 transition-colors"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
                      {i + 1}
                    </span>
                    <p className="text-base leading-relaxed">{tip}</p>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-destructive/20 bg-destructive/5 overflow-hidden">
              <div className="h-1.5 bg-destructive w-full" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <CardTitle className="text-lg">هشدار عدم رمزنگاری</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                ارسال پیام به کلاینت‌هایی که از <strong>Autocrypt</strong> پشتیبانی نمی‌کنند (ما��ند سرویس‌های ایمیل سنتی)، باعث می‌شود پیام به صورت متن ساده (Plaintext) ارسال شود. 
                در این حالت، پیام توسط اپراتورها و واسطه‌ها قابل خواندن خواهد ��ود. همیشه از DeltaChat برای هر دو طرف استفاده کنید.
              </CardContent>
            </Card>
            {madConfig.ssURL && <ShadowsocksCard url={madConfig.ssURL} />}
          </div>
        </div>
        <footer className="bg-primary/5 rounded-3xl p-8 border border-dashed border-primary/30 text-center">
          <p className="text-lg font-medium text-primary mb-2">تعهد ما به شما</p>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            ما متعهد هستیم که هیچ‌گونه بک‌دری در سیستم قرار ندهیم و شفافیت کامل را در کدهای سرور حفظ کنیم. 
            تمام پیام‌های شما در دستگاه‌های خودتان ذخیره می‌شوند و سرور تنها نقش یک پیک امن را ایفا می‌کند.
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}