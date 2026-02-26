import React from 'react';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Terminal, Code, Database, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export function DocsIndexPage() {
  const sections = [
    {
      title: 'راهنمای عمومی',
      desc: '��شنایی با قابلیت‌های MadMail، نحوه کارکرد JIT و سهمیه‌بندی فضا.',
      icon: BookOpen,
      href: '/docs/general',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'پنل مدیریت (CLI)',
      desc: 'مرجع کامل دستورات مدیریت کاربران، پروژه و تنظیمات لحظه‌ای سرور.',
      icon: Terminal,
      href: '/docs/admin',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      title: 'سفارشی‌سازی وب',
      desc: 'نحوه تغییر ظاهر ��ین رابط کاربری و تزریق آن به سرور MadMail.',
      icon: Code,
      href: '/docs/custom-html',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'تنظیمات پایگاه داده',
      desc: 'پیکربندی SQLite، PostgreSQL و MySQL برای ذخیره‌سازی دائمی.',
      icon: Database,
      href: '/docs/database',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    }
  ];
  return (
    <DocsLayout>
      <div className="space-y-12">
        <header className="max-w-3xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground">مرکز دانش <span className="text-primary">MadMail</span></h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            همه چیز درباره راه‌اندازی، مدیریت و شخصی‌سازی سرویس پیام‌رسان دلتا‌چت شما در یک جا.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={section.href} className="block group">
                <Card className="h-full border-2 transition-all hover:border-primary/40 hover:shadow-lg active:scale-[0.98]">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className={cn("p-3 rounded-xl transition-colors", section.bg, section.color)}>
                      <section.icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{section.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">{section.desc}</CardDescription>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-[-4px] transition-all" />
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 rounded-2xl bg-muted/30 border space-y-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h3 className="font-bold">امنیت بومی</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">استفاده از Autocrypt و PGP به صورت پیش‌فرض برای حداکثر امنیت.</p>
          </div>
          <div className="p-6 rounded-2xl bg-muted/30 border space-y-3">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="font-bold">راه‌اندازی آنی</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">نصب و اجرا با یک ��ستور بدون نیاز به پیکربندی‌های پیچیده وب‌سرور.</p>
          </div>
          <div className="p-6 rounded-2xl bg-muted/30 border space-y-3">
            <BookOpen className="w-6 h-6 text-primary" />
            <h3 className="font-bold">امکان مشارکت</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">شفافیت کامل در کدها و امکان مشارکت در توسعه پروژه.</p>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}