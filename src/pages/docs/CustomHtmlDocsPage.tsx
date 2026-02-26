import React from 'react';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { Code, Settings, Globe, RefreshCw } from 'lucide-react';
export function CustomHtmlDocsPage() {
  const steps = [
    { title: 'خروجی گرفتن', icon: Code, desc: '��بتدا پروژه فرانت‌اند را با دستور build بسازید و محتویات پوشه dist را آما��ه کنید.' },
    { title: 'تزریق به سرور', icon: Settings, desc: 'محتویات را در پوشه web_templates در کنار فایل اجرایی قرار دهید.' },
    { title: 'راه‌اندازی مجدد', icon: RefreshCw, desc: 'یک بار سرور را ریستارت کنید تا قالب‌های جدید شناسایی شوند.' },
    { title: 'بررسی دامنه', icon: Globe, desc: 'آدرس سرور را ��ر مرورگر باز کنید تا تغییرات را مشاهده نمایید.' }
  ];
  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-black">سفارشی‌سازی ظاهر (HTML/CSS)</h1>
          <p className="text-muted-foreground text-lg">چگونه می‌توانید این راب�� کاربری را تغییر داده و روی سرور خودتان اجرا کنید.</p>
        </header>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                <step.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </section>
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>نکات فنی مهم</h2>
          <p>
            سرور MadMail از ��تغیرهای محیطی برای تزریق داده‌ها به قالب‌های HTML استفاده می‌کند. اگر می‌��واهید از این پروژه React
            به صورت مستقیم استفاده کنید، باید موارد زیر را در نظر ب��یرید:
          </p>
          <ul>
            <li><strong>مد JIT:</strong> اگر JIT فعال باشد، کلاینت به هیچ API خاصی نیاز ندارد و تمامی مراحل در مرورگر انجام می‌شود.</li>
            <li><strong>API Endpoints:</strong> تمامی درخواست‌ها باید به مسیر <code>/api/*</code> ارسال شوند.</li>
          </ul>
          <div className="mt-8 p-6 bg-zinc-900 text-zinc-100 rounded-2xl overflow-hidden shadow-xl" dir="ltr">
            <p className="text-xs text-zinc-500 mb-2 font-mono uppercase tracking-widest">Build Command</p>
            <code className="text-primary font-bold">npm run build && cp -r dist/* ../madmail-server/static/</code>
          </div>
        </article>
      </div>
    </DocsLayout>
  );
}