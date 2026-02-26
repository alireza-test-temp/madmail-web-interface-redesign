import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, RefreshCw, Copy, Check, ExternalLink, Link as LinkIcon, Info, ShieldCheck } from 'lucide-react';
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
      toast.error('لینک دعوت باید با https://i.delta.chat/# شروع شود');
      return;
    }
    const hasFingerprint = trimmedUrl.includes('openpgp4fpr=');
    if (!hasFingerprint) {
      toast.warning('هشدار: این لینک فاقد اثر انگشت امنیتی (OpenPGP) است.');
    }
    const sanitizedSlug = formData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    setState('submitting');
    try {
      const data = await api<{ slug: string }>('/share', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          url: trimmedUrl,
          slug: sanitizedSlug
        })
      });
      setShareResult(data);
      setState('success');
      toast.success('لینک اشتر��ک با موفقیت ایجاد شد');
    } catch (err) {
      setState('idle');
      toast.error('خ��ا در ایجاد لینک. احتمالاً این نام کوتاه قبلاً گرفته شده است.');
    }
  };
  const shareUrl = shareResult ? `${window.location.origin}/${shareResult.slug}` : '';
  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('کپی شد!');
    }
  };
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8 px-4">
        <header className="text-center space-y-3">
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary"
          >
            <Share2 className="w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-black">اشتراک ��ماس</h1>
          <p className="text-muted-foreground">لینک دعوت DeltaChat خود را به یک آدرس کوتاه و زیبا تبدیل کنید.</p>
        </header>
        <AnimatePresence mode="wait">
          {state !== 'success' ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Card className="border-2">
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>ساخت لینک جدید</CardTitle>
                    <CardDescription>اطلاعات تماس خود را وارد کنید تا لینک کوتاه ساخته شود.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">نام نمایشی (اختیاری)</Label>
                      <Input
                        id="name"
                        placeholder="مثلاً: محمد علی"
                        className="h-12"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">نام کوتاه دلخواه (اختیاری)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="slug"
                          dir="ltr"
                          placeholder="my-contact"
                          className="h-12 font-mono"
                          value={formData.slug}
                          onChange={e => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                        />
                        <Button type="button" variant="outline" className="h-12 px-4 gap-2" onClick={handleRandomSlug}>
                          <RefreshCw className="w-4 h-4" />
                          تصادفی
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">لینک دعوت DeltaChat (الزامی)</Label>
                      <div className="relative">
                        <Input
                          id="url"
                          dir="ltr"
                          required
                          placeholder="https://i.delta.chat/#..."
                          className="h-12 font-mono text-sm pl-10"
                          value={formData.url}
                          onChange={e => setFormData(p => ({ ...p, url: e.target.value }))}
                        />
                        {formData.url.includes('openpgp4fpr=') && (
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed text-xs text-muted-foreground space-y-2">
                        <p className="font-bold flex items-center gap-1"><Info className="w-3 h-3" /> مراحل دریافت لینک:</p>
                        <ol className="list-decimal list-inside space-y-1 pr-1">
                          <li>تنظیمات (Settings) → آیکون QR.</li>
                          <li>گزینه اشتراک (Share) → کپی (Copy).</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full h-12 text-lg gap-2" disabled={state === 'submitting'}>
                      {state === 'submitting' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <LinkIcon className="w-5 h-5" />}
                      ایجاد لینک اشتراک
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <Card className="border-green-500/30 bg-green-500/5 shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl">لینک شما آماده است!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-background rounded-xl border-2 border-green-500/20 shadow-inner overflow-hidden">
                    <code className="text-sm md:text-base truncate flex-1 font-mono text-left font-bold" dir="ltr">
                      {shareUrl}
                    </code>
                    <Button size="icon" variant="ghost" className="h-10 w-10 shrink-0" onClick={handleCopy}>
                      {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-primary" />}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 h-12 gap-2" onClick={() => navigate(`/${shareResult?.slug}`)}>
                    <ExternalLink className="w-5 h-5" />
                    مشاهده صفحه تماس
                  </Button>
                  <Button variant="outline" className="flex-1 h-12" onClick={() => setState('idle')}>
                    ایجاد لینک جدید
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