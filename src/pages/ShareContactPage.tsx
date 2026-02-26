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
    if (!formData.url.startsWith('https://i.delta.chat/#')) {
      toast.error('لینک دعوت باید با https://i.delta.chat/# شروع شود');
      return;
    }
    setState('submitting');
    try {
      const data = await api<{ slug: string }>('/api/share', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setShareResult(data);
      setState('success');
      toast.success('لینک اشتراک با مو��قیت ایجاد شد');
    } catch (err) {
      setState('idle');
      toast.error('خطا در ایجاد لینک');
    }
  };
  const shareUrl = shareResult ? `${window.location.origin}/${shareResult.slug}` : '';
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('خطا در کپی');
    }
  };
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary">
            <Share2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black">اشتراک‌گذاری ��ماس</h1>
          <p className="text-muted-foreground">لینک دعوت DeltaChat خود را به یک آدرس کوتاه و زیبا تبدیل کنید.</p>
        </header>
        <AnimatePresence mode="wait">
          {state !== 'success' ? (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>ساخت لینک جدید</CardTitle>
                    <CardDescription>اطلاعات تماس خود را وارد کنید.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">نام نمایشی (اختیاری)</Label>
                      <Input 
                        id="name" 
                        placeholder="مثلاً: محمد" 
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
                          value={formData.slug} 
                          onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={handleRandomSlug}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground" dir="ltr">
                        {window.location.host}/{formData.slug || '[slug]'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">لینک دعوت DeltaChat (الزامی)</Label>
                      <Input 
                        id="url" 
                        dir="ltr"
                        required
                        placeholder="https://i.delta.chat/#..." 
                        value={formData.url} 
                        onChange={e => setFormData(p => ({ ...p, url: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full gap-2" disabled={state === 'submitting'}>
                      {state === 'submitting' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                      ایجاد لینک اشتراک
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <Card className="border-green-500/30 bg-green-500/5">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-6 h-6" />
                  </div>
                  <CardTitle>لینک شما آماده است!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-background rounded-md border overflow-hidden">
                    <code className="text-sm truncate flex-1 font-mono text-left" dir="ltr">
                      {shareUrl}
                    </code>
                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full gap-2" onClick={() => navigate(`/${shareResult?.slug}`)}>
                    <ExternalLink className="w-4 h-4" />
                    مشاهده صفحه ��ماس
                  </Button>
                  <Button variant="ghost" onClick={() => { setState('idle'); setFormData({ name: '', slug: '', url: '' }); }}>
                    ایجاد لینک جدید
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        {madConfig.ssURL && <ShadowsocksCard url={madConfig.ssURL} />}
      </div>
    </AppLayout>
  );
}