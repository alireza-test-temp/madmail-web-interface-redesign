import React from 'react';
import { DocsLayout } from '@/components/layout/DocsLayout';
import { Database, AlertTriangle, Terminal } from 'lucide-react';
export function DatabaseDocsPage() {
  return (
    <DocsLayout>
      <div className="space-y-10">
        <header className="space-y-4">
          <h1 className="text-4xl font-black">پیکربندی پایگاه داده</h1>
          <p className="text-muted-foreground text-lg">انتخاب و تنظیم موتور ذخیره‌سازی داده‌ها در MadMail.</p>
        </header>
        <section className="space-y-8">
          <div className="grid gap-6">
            <div className="border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">SQLite (پیش‌فرض)</h2>
              </div>
              <p className="text-muted-foreground text-sm">ایده‌آل برای سرورهای کوچک و تست. نیاز به نصب هیچ سرویس اضافه‌ای ندارد.</p>
              <pre className="p-4 bg-muted rounded-lg text-xs font-mono" dir="ltr">
                [database]{"\n"}
                driver = "sqlite3"{"\n"}
                dsn = "madmail.db"
              </pre>
            </div>
            <div className="border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold">PostgreSQL</h2>
              </div>
              <p className="text-muted-foreground text-sm">برای سرورهای بزرگ با تعداد کاربران بالا توصیه می‌شود.</p>
              <pre className="p-4 bg-muted rounded-lg text-xs font-mono" dir="ltr">
                [database]{"\n"}
                driver = "postgres"{"\n"}
                dsn = "host=localhost user=mad dbname=madmail sslmode=disable"
              </pre>
            </div>
          </div>
          <div className="p-6 bg-primary/5 border border-dashed border-primary/30 rounded-2xl space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              مهاجرت داده‌ها (Migrations)
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              MadMail از <strong>GORM</strong> ��رای مدیریت پایگاه داده استفاده می‌کند. تمامی جداول و تغییرات ساختاری در هنگام 
              اولین اجرا به صورت خودکار ایجاد می‌شوند. نیازی به اجرای اسکریپت‌های SQL دستی نیست.
            </p>
          </div>
          <div className="flex items-start gap-4 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-amber-900 dark:text-amber-200">هشدار نسخه پشتیبان</p>
              <p className="text-sm text-amber-800/70 dark:text-amber-300/70 leading-relaxed">
                همیشه قبل از تغییر درایور پایگاه داده، از فایل <code>madmail.db</code> یا دامپ دیتابیس فعلی خود نسخه پشتیبان تهیه کنید.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}