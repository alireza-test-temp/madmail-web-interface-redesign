import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ExternalLink, Copy, Check, MessageSquare, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { ShadowsocksCard } from '@/components/ShadowsocksCard';
import { madConfig } from '@/lib/config';
import { toast } from 'sonner';
interface Contact {
  id: string;
  name: string;
  url: string;
}
export function ContactViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    async function fetchContact() {
      try {
        const data = await api<Contact>(`/api/contact/${slug}`);
        setContact(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchContact();
  }, [slug]);
  const handleCopy = async () => {
    if (!contact) return;
    try {
      await navigator.clipboard.writeText(contact.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('خطا در کپی');
    }
  };
  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <MessageSquare className="w-10 h-10 text-primary/50" />
          </motion.div>
          <p className="text-muted-foreground animate-pulse">در حال دریافت اطلاعات تماس...</p>
        </div>
      </AppLayout>
    );
  }
  if (error || !contact) {
    return (
      <AppLayout>
        <Card className="max-w-md mx-auto text-center py-10">
          <CardContent className="space-y-4">
            <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">تماس یافت نشد</h1>
            <p className="text-muted-foreground">متأسفانه این لینک اشتراک وجود ندارد یا منقضی شده است.</p>
            <Button asChild className="w-full">
              <Link to="/">بازگشت به خانه</Link>
            </Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }
  const initials = contact.name ? contact.name.trim().charAt(0).toUpperCase() : '?';
  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-black mx-auto shadow-xl ring-4 ring-background">
            {initials}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black">{contact.name || 'تماس ناشناس'}</h1>
            <p className="text-muted-foreground">می‌خواهید با این شخص در DeltaChat گفتگو کنید��</p>
          </div>
          <Button asChild size="lg" className="h-16 px-8 text-xl font-bold gap-3 shadow-lg hover:scale-105 transition-transform">
            <a href={contact.url}>
              <ExternalLink className="w-6 h-6" />
              باز کردن در DeltaChat
            </a>
          </Button>
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">لینک دعوت مستقیم</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md overflow-hidden">
                <code className="text-xs truncate flex-1 font-mono text-left" dir="ltr">
                  {contact.url}
                </code>
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="pt-6 flex gap-4 items-start text-right">
              <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
              <div className="space-y-1">
                <p className="font-bold text-amber-900 dark:text-amber-200">هشدار امنیت��</p>
                <p className="text-sm text-amber-800/70 dark:text-amber-300/70 leading-relaxed">
                  هویت این تماس را با اثر انگشت PGP تأیید کنید قبل از اعتماد کامل. هرگز تنها به صرف داشتن لینک اعتماد نکنید.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {madConfig.ssURL && <ShadowsocksCard url={madConfig.ssURL} />}
        <div className="text-center">
          <Button variant="link" asChild className="text-muted-foreground gap-2">
            <Link to="/">
              <ArrowRight className="w-4 h-4" />
              ساخت آدرس مشابه برای خودتان
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}