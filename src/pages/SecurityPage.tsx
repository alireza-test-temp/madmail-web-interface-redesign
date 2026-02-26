import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, EyeOff, ShieldCheck, Zap, ShieldOff } from 'lucide-react';
import { madConfig } from '@/lib/config';
import { ShadowsocksCard } from '@/components/ShadowsocksCard';
import { motion } from 'framer-motion';
export function SecurityPage() {
  const securityTips = [
    "همیشه اثر انگشت PGP را با گیرنده به صورت حضوری یا کانال امن تأیید کنید.",
    "از پروکسی Shadowsocks برای مخفی کردن ترافیک استفاده کنید.",
    "هرگز لینک‌های ناشناخته را بدون بررسی باز نکنید.",
    "DeltaChat را همیشه ��ه‌روز نگه دارید.",
    "از WiFi عمومی برای ارتباطات حساس اجتناب کنید."
  ];
  const features = [
    { label: 'رمزنگاری دوطرفه', desc: '��مامی پیام‌ها با استاندارد Autocrypt رمزنگاری می‌شوند.', icon: Lock },
    { label: 'بدون ردپا', desc: '��ی‌پی و متادیتای حساس شما در سرور ذخیره نمی‌شود.', icon: EyeOff },
    { label: 'پروکسی داخلی', desc: 'استفاده از Shadowsocks برای دو�� زدن فیلترینگ.', icon: Zap },
  ];
  return (
    <AppLayout>
      <div className="space-y-8 max-w-3xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary">
            <Shield className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">امنیت و حریم خصوصی</h1>
          <p className="text-muted-foreground text-lg">
            ارتباطات شما در MadMail تحت بالاترین استانداردهای امنیتی محافظت می‌شود.
          </p>
        </motion.header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Card key={i} className="border-none bg-muted/30">
              <CardContent className="pt-6 text-center space-y-2">
                <f.icon className="w-8 h-8 mx-auto text-primary" />
                <h3 className="font-bold">{f.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              توصیه‌های امنیتی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {securityTips.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-accent/30"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm md:text-md leading-relaxed">{tip}</p>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/5">
          <CardContent className="pt-6 flex gap-4 items-start">
            <ShieldOff className="w-8 h-8 text-muted-foreground shrink-0" />
            <div className="space-y-1">
              <h3 className="font-bold">غیرفعال‌سازی رمزنگاری</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ارسال پیام به کلاینت‌هایی که از Autocrypt پشتیبانی نمی‌کنند، امنیت شما را به خطر می‌اندازد. در این شرایط پیام‌ها به صورت متن ساده (Plaintext) ارسال شده و ت��سط واسطه‌ها قابل شنود هستند.
              </p>
            </div>
          </CardContent>
        </Card>
        {madConfig.ssURL && (
          <div className="mt-8">
            <ShadowsocksCard url={madConfig.ssURL} />
          </div>
        )}
        <footer className="text-center p-6 bg-primary/5 rounded-xl border border-dashed border-primary/20">
          <p className="text-sm text-muted-foreground leading-relaxed">
            ما هیچ‌گونه اطلاعات شخصی یا محتوای پیام‌های شما را ذخیره نمی‌کنیم.
            پیام‌ها پس از ۲۰ روز به طور کامل از سرور حذف خواهند شد.
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}