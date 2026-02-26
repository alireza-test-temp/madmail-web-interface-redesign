import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, RefreshCw, Copy, Check, ExternalLink, Link as LinkIcon, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { generateRandomString, copyToClipboard } from '@/lib/account-utils';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
type FormState = 'idle' | 'submitting' | 'success';
export function ShareContactPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<FormState>('idle');
  const [formData, setFormData] = useState({ name: '', slug: '', url: '' });
  const [shareResult, setShareResult] = useState<{ slug: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const handleRandomSlug = () => {
    setFormData(prev => ({ ...prev, slug: generateRandomString(8) }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = formData.url.trim();
    if (!trimmedUrl.startsWith('https://i.delta.chat/#')) {
      toast.error('��ینک دعوت معتبر نیست');
      return;
    }
    setState('submitting');
    try {
      const data = await api<{ slug: string }>('/share', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          url: trimmedUrl,
          slug: formData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
        })
      });
      setShareResult(data);
      setState('success');
      toast.success('لینک شما با موفقیت ساخته شد');
    } catch (err) {
      setState('idle');
      toast.error('خطا در ساخت لینک. ممکن است این نام کوتاه قبلاً رزرو شده باشد.');
    }
  };
  const shareUrl = shareResult ? `${window.location.origin}/${shareResult.slug}` : '';
  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('در حافظه کپی شد');
    }
  };
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-10 px-4">
        <header className="text-center space-y-4">
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary shadow-inner"
          >
            <Share2 className="w-10 h-10" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black">اشتراک تماس</h1>
            <p className="text-muted-foreground text-lg">آدرس‌های طولانی DeltaChat را به لینک‌های کوتاه و به‌یادماندنی تبدیل کنید.</p>
          </div>
        </header>
        <AnimatePresence mode="wait">
          {state !== 'success' ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Card className="border-2 shadow-xl">
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>ایجاد لینک کوتاه</CardTitle>
                    <CardDescription>اطلاعات زیر را برای شخصی‌سازی صفحه تماس خود وارد کنید.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-bold">نام شما (برای نمایش در صفحه)</Label>
                      <Input
                        id="name"
                        placeholder="مثلاً: آرش پیرزاده"
                        className="h-14 text-lg bg-muted/50"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="slug" className="text-sm font-bold">آدرس دلخواه (Slug)</Label>
                      <div className="flex gap-3">
                        <Input
                          id="slug"
                          dir="ltr"
                          placeholder="my-link"
                          className="h-14 text-lg font-mono bg-muted/50"
                          value={formData.slug}
                          onChange={e => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                        />
                        <Button type="button" variant="outline" className="h-14 px-6 gap-2" onClick={handleRandomSlug}>
                          <RefreshCw className="w-5 h-5" />
                          تصادفی
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="url" className="text-sm font-bold">لینک کامل دعوت DeltaChat</Label>
                      <div className="relative">
                        <Input
                          id="url"
                          dir="ltr"
                          required
                          placeholder="https://i.delta.chat/#..."
                          className="h-14 text-base font-mono pl-12 bg-muted/50"
                          value={formData.url}
                          onChange={e => setFormData(p => ({ ...p, url: e.target.value }))}
                        />
                        {formData.url.includes('openpgp4fpr=') && (
                          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500" />
                        )}
                      </div>
                      <div className="p-5 bg-primary/5 rounded-2xl border border-dashed border-primary/20 space-y-3">
                        <p className="font-bold flex items-center gap-2 text-primary text-sm">
                          <Info className="w-4 h-4" /> 
                          راهنمای دریافت لینک از برنامه:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground pr-1 leading-relaxed">
                          <li>در DeltaChat به منوی <strong>تنظیمات</strong> بروید.</li>
                          <li>روی آیکون <strong>QR کد</strong> در بالای صفحه ��زنید.</li>
                          <li>گزینه <strong>اشتراک‌گذاری (Share)</strong> را انتخاب و آدرس را کپی کنید.</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full h-16 text-xl font-bold gap-3 shadow-lg" disabled={state === 'submitting'}>
                      {state === 'submitting' ? <RefreshCw className="w-6 h-6 animate-spin" /> : <LinkIcon className="w-6 h-6" />}
                      ساخت لینک اشتراک اختصاصی
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <Card className="border-green-500/30 bg-green-500/5 shadow-2xl overflow-hidden">
                <div className="h-2 bg-green-500 w-full" />
                <CardHeader className="text-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <CardTitle className="text-3xl font-black">لینک شما آماده شد!</CardTitle>
                  <CardDescription>حالا می‌توانید این آدرس را در شبکه‌های اجتما��ی یا بیوگرافی خود قرار دهید.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-5 bg-background rounded-2xl border-2 border-green-500/20 shadow-inner overflow-hidden">
                    <code className="text-lg truncate flex-1 font-mono text-left font-bold text-primary" dir="ltr">
                      {shareUrl}
                    </code>
                    <Button size="icon" variant="ghost" className="h-12 w-12 shrink-0 hover:bg-green-500/10 transition-colors" onClick={handleCopy}>
                      {copied ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6 text-primary" />}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 h-14 text-lg gap-2 shadow-lg" onClick={() => navigate(`/${shareResult?.slug}`)}>
                    <ExternalLink className="w-5 h-5" />
                    مشاهده صفحه تماس
                  </Button>
                  <Button variant="outline" className="flex-1 h-14 text-lg border-2" onClick={() => setState('idle')}>
                    ساخت یکی دیگر
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}