import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal, Download, Copy, Check, Zap, ArrowRight, HelpCircle } from 'lucide-react';
import { madConfig } from '@/lib/config';
import { ShadowsocksCard } from '@/components/ShadowsocksCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
export function DeployPage() {
  const [copiedInstall, setCopiedInstall] = React.useState(false);
  const [copiedUpdate, setCopiedUpdate] = React.useState(false);
  const installCmd = `wget http://${madConfig.publicIP}/madmail && chmod +x madmail && ./madmail`;
  const updateCmd = `./madmail update`;
  const handleCopy = async (text: string, setFn: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setFn(true);
      toast.success('دستور کپی شد');
      setTimeout(() => setFn(false), 2000);
    } catch (err) {
      toast.error('خطا در کپی');
    }
  };
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-2"
          >
            <Terminal className="w-12 h-12" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">راه‌اندازی سرور MadMail</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            با استفاده از دستورات ��یر می‌توانید در کمتر از یک دقیقه سرور اختصاصی خود را نصب و راه‌اندازی کنید.
          </p>
        </header>
        <div className="grid gap-6">
          <Card className="border-2 shadow-sm overflow-hidden group">
            <div className="h-1 bg-primary w-full" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-primary" />
                <CardTitle>نصب و اجرای ا��لیه</CardTitle>
              </div>
              <CardDescription>این دستور فایل اجرایی را دریافت کرده و سرویس را استارت می‌کند.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative group">
                <pre className="p-5 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner" dir="ltr">
                  {installCmd}
                </pre>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-3 right-3 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(installCmd, setCopiedInstall)}
                >
                  {copiedInstall ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 shadow-sm border-dashed">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-amber-500" />
                <CardTitle>به‌روزرسانی سریع</CardTitle>
              </div>
              <CardDescription>برای دریافت آخرین نسخه‌ها و پچ‌های امنیتی از این دستور استفاده کنید.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative group">
                <pre className="p-4 bg-zinc-100 dark:bg-zinc-900 border text-foreground rounded-lg font-mono text-sm overflow-x-auto" dir="ltr">
                  {updateCmd}
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => handleCopy(updateCmd, setCopiedUpdate)}
                >
                  {copiedUpdate ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {madConfig.ssURL && (
          <div className="pt-4">
            <ShadowsocksCard url={madConfig.ssURL} />
          </div>
        )}
        <footer className="flex flex-col sm:flex-row gap-4 justify-between items-center p-6 bg-accent/30 rounded-2xl border border-dashed">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">نیاز به راهنمایی بیشتر دارید؟</p>
          </div>
          <Button variant="link" asChild className="gap-2 font-bold group">
            <Link to="/docs">
              فهرست مستندات
              <ArrowRight className="w-4 h-4 group-hover:translate-x-[-4px] transition-transform" />
            </Link>
          </Button>
        </footer>
      </div>
    </AppLayout>
  );
}