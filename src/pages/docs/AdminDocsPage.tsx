import React from 'react';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { Terminal, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export function AdminDocsPage() {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);
  const commands = [
    { cmd: './madmail stats', desc: '��مایش وضعیت فعلی سرور و تعداد کاربران آنلاین.' },
    { cmd: './madmail user add user@domain pass', desc: 'ساخت دستی یک حساب کاربری جدید.' },
    { cmd: './madmail quota set user@domain 500MB', desc: 'تغییر سهمیه فضای دیسک برای یک کاربر خاص.' },
    { cmd: './madmail reg open', desc: 'باز کردن ثبت‌نام عمومی برای همه.' },
    { cmd: './madmail reg close', desc: 'بستن ثبت‌نام (فقط مدیریت ��ی‌تواند کاربر بسازد).' },
    { cmd: './madmail jit on', desc: 'فعال‌سازی تولید حساب ��نی (JIT).' },
    { cmd: './madmail turn on', desc: 'فعال‌سازی سرور TURN برای تماس‌های تصویری/صوتی بهتر.' },
    { cmd: './madmail stealth on', desc: 'حالت مخفی؛ سرور به درخو��ست‌های پینگ پاسخ نمی‌دهد.' },
    { cmd: './madmail purge all', desc: 'پاکسازی تمامی ��یام‌های منقضی شده از دیتابیس.' },
  ];
  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('دستور کپی شد');
    setTimeout(() => setCopiedIdx(null), 2000);
  };
  return (
    <DocsLayout>
      <div className="space-y-10">
        <header className="space-y-4">
          <h1 className="text-4xl font-black">مدیریت از طریق خط فرمان (CLI)</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            تمامی تنظیمات سرور MadMail از طریق فایل اجرایی آن و با استفاده از دستورات زیر قابل کنترل است.
          </p>
        </header>
        <div className="space-y-4">
          {commands.map((item, i) => (
            <div key={i} className="group border rounded-2xl p-4 hover:border-primary/50 transition-colors bg-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{item.desc}</p>
                  <code className="block text-primary font-mono text-lg font-bold" dir="ltr">
                    {item.cmd}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-2"
                  onClick={() => handleCopy(item.cmd, i)}
                >
                  {copiedIdx === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  کپی دستور
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
          <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-2">نکته مهم در مورد دسترسی</h3>
          <p className="text-sm text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
            تمامی این دستورات باید در پوشه‌ای که فایل اجرایی `madmail` قرار دارد اجرا شوند. اگر از Docker استفاده می‌کنید،
            باید ابتدا با دستور `docker exec` وارد کانتینر شوید.
          </p>
        </div>
      </div>
    </DocsLayout>
  );
}