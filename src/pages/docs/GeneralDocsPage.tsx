import React from 'react';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Zap, Info } from 'lucide-react';
export function GeneralDocsPage() {
  return (
    <DocsLayout>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <header className="mb-10 space-y-4">
          <h1 className="text-4xl font-black mb-2">راهنمای عمومی و فنی</h1>
          <p className="text-muted-foreground text-lg">درک مفاهیم اصلی MadMail و نحوه تعامل ��ن با اکوسیستم DeltaChat.</p>
        </header>
        <section className="space-y-12">
          <article className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary" />
              مفهوم Just-In-Time (JIT)
            </h2>
            <p className="leading-relaxed">
              قابلیت JIT به شما اجازه می‌دهد بدون ��بت‌نام قبلی در پایگاه داده، حساب‌های موقت بسازید. در این حالت، کلاینت یک جف��
              نام کاربری و رمز عبور تصادفی تولید کرده و مستقیماً وارد می‌شود. ��رور در همان اولین ورود، حساب را ایجاد می‌کند.
            </p>
            <div className="p-4 bg-primary/5 border-r-4 border-primary rounded-l-lg">
              <strong>نکته:</strong> برای استفاده از JIT، باید این قابلیت در تنظیمات سرور فعال باشد.
            </div>
          </article>
          <article className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              امنیت و رمزنگاری
            </h2>
            <p>
              MadMail به عنوان یک میل‌سرور تخصصی برای DeltaChat، از استانداردهای <strong>Autocrypt</strong> پشتیبانی می‌کند.
              پیام‌ها قبل از خروج از دستگاه شما رمزنگاری می‌شوند.
            </p>
            <Card className="bg-zinc-900 border-none text-zinc-100 p-6">
              <h3 className="text-zinc-100 mt-0 font-bold mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                توصیه امنیتی مهم
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-0">
                اگرچه سرور MadMail پیام‌ها را ذخیره نمی‌کند، اما توصیه می‌شود برای ارتباطات بسیار حساس از قابلیت "حذف خودکار پیام"
                در تنظیمات DeltaChat استفاده کنید تا ردپایی در دستگاه خودتان هم باقی نماند.
              </p>
            </Card>
          </article>
          <article className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Info className="w-6 h-6 text-primary" />
              سهمیه فضا (Quotas)
            </h2>
            <p>
              به صورت پیش‌فرض، هر حساب کاربری در MadMail ��ارای ۱۰۰ مگابایت فضا است. با توجه به اینکه DeltaChat پیام‌ها را به صورت
              ایمیل منتقل می‌کند، این فضا برای هزاران پیام متنی کافی است. فایل‌های چندرسانه‌ای حجم بیشتری مصرف می‌کنند.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>حذف خودکار لاگ‌ها و متادیتا.</li>
              <li>پاکسازی خودکار پیام‌های قدیمی (پیش‌فرض ۳۰ روز).</li>
              <li>امکان تغییر سهمیه برای هر دامنه یا کاربر خاص از طریق CLI.</li>
            </ul>
          </article>
        </section>
      </div>
    </DocsLayout>
  );
}