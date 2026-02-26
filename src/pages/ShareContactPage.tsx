import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, RefreshCw, Copy, Check, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { generateRandomSlug } from '@/lib/account-utils';
import { madConfig } from '@/lib/config';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ShadowsocksCard } from '@/components/ShadowsocksCard';
import { useNavigate } from 'react-router-dom';
type FormState = 'idle' | 'submitting' | 'success';
export function ShareContactPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<FormState>('idle');
  const [formData, setFormData] = useState({ name: '', slug: '', url: '' });
  const [shareResult, setShareResult] = useState<{ slug: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const handleRandomSlug = () => {
    setFormData(prev => ({ ...prev, slug: generateRandomSlug(8) }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = formData.url.trim();
    if (!trimmedUrl.startsWith('https://i.delta.chat/#')) {
      toast.error('لینک دعوت باید با https://i.delta.chat/# شروع شود');
      return;
    }
    const sanitizedSlug = formData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    setState('submitting');
    try {
      const data = await api<{ slug: string }>('/api/share', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          url: trimmedUrl,
          slug: sanitizedSlug
        })
      });
      setShareResult(data);
      setState('success');
      toast.success('لینک اشتراک با موفقیت ایجاد شد');
    } catch (err) {
      setState('idle');
      toast.error('خطا در ایجاد لینک. احتمالاً این نام کوتاه قبلاً گرفته شده است.');
    }
  };
  const shareUrl = shareResult ? `${window.location.origin}/${shareResult.slug}` : '';
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('کپی شد!');
    } catch (err) {
      toast.error('خطا در کپی');
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
          <h1 className="text-3xl font-black">اشتراک‌گذاری تماس</h1>
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
                  <CardContent className="space-y-5">
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
                        <Button type="button" variant="outline" className="h-12 w-12" size="icon" onClick={handleRandomSlug}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                        {window.location.host}/{formData.slug || '...'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">لینک دعوت DeltaChat (الزامی)</Label>
                      <Input
                        id="url"
                        dir="ltr"
                        required
                        placeholder="https://i.delta.chat/#..."
                        className="h-12 font-mono text-sm"
                        value={formData.url}
                        onChange={e => setFormData(p => ({ ...p, url: e.target.value }))}
                      />
                      <p className="text-[10px] text-muted-foreground">لینک دعوت را از تنظیمات DeltaChat کپی کنید.</p>
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
                    <Button size="icon" variant="ghost" className="h-10 w-10 shrink-0 hover:bg-green-500/10" onClick={handleCopy}>
                      {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-primary" />}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 h-12 gap-2" onClick={() => navigate(`/${shareResult?.slug}`)}>
                    <ExternalLink className="w-5 h-5" />
                    مشاهده صفحه ��ماس
                  </Button>
                  <Button variant="outline" className="flex-1 h-12" onClick={() => { setState('idle'); setFormData({ name: '', slug: '', url: '' }); }}>
                    ایجاد لینک جدید
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        {madConfig.ssURL && (
          <div className="pt-4">
             <ShadowsocksCard url={madConfig.ssURL} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}