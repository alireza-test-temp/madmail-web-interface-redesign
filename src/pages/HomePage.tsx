import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Mail, Key, UserPlus, ExternalLink, RefreshCw } from 'lucide-react';
import { madConfig } from '@/lib/config';
import { generateRandomCredential, formatEmail, createDcLoginLink, tryOpenProtocol } from '@/lib/account-utils';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
type FlowState = 'idle' | 'generating' | 'success' | 'error';
export function HomePage() {
  const [state, setState] = useState<FlowState>('idle');
  const [creds, setCreds] = useState<{ email: string; pass: string } | null>(null);
  const handleCreateAccount = async () => {
    setState('generating');
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1200));
    try {
      if (madConfig.jitEnabled) {
        const user = generateRandomCredential(8);
        const pass = generateRandomCredential(12);
        const email = formatEmail(user, madConfig.mailDomain);
        setCreds({ email, pass });
        setState('success');
        toast.success('حساب با موفقیت ایجاد شد');
      } else {
        // Here we would call the /api/new endpoint
        // For now, we simulate a success response
        const email = formatEmail('user', madConfig.mailDomain);
        setCreds({ email, pass: 'random-pass' });
        setState('success');
      }
    } catch (error) {
      setState('error');
      toast.error('خطا در ایجاد ��ساب کاربری');
    }
  };
  const loginLink = creds ? createDcLoginLink({ 
    email: creds.email, 
    password: creds.pass, 
    ssl: !madConfig.turnOffTLS 
  }) : '';
  const handleOpenDeltaChat = async () => {
    const success = await tryOpenProtocol(loginLink);
    if (!success) {
      toast.info('DeltaChat یافت نشد. لطفاً ابتدا برنامه را نصب کنید.');
    }
  };
  return (
    <AppLayout>
      <div className="flex flex-col items-center gap-8">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            سرویس پیام‌رسان <span className="text-primary">MadMail</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            یک سرور DeltaChat امن و خصوصی برای ارتباطات آزاد شما. همین ��الا حساب کاربری خود را بسازید.
          </p>
        </header>
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <CardTitle>ایجاد حساب جدید</CardTitle>
                  <CardDescription>
                    با کلیک روی دکمه زیر، یک آدرس ایمیل اخ��صاصی برای استفاده در DeltaChat دریافت کنید.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full h-12 text-lg font-bold gap-2" 
                    onClick={handleCreateAccount}
                    disabled={!madConfig.registrationOpen}
                  >
                    <UserPlus className="w-5 h-5" />
                    ساخت اکانت در {madConfig.mailDomain}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
          {state === 'generating' && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-12"
            >
              <RefreshCw className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg font-medium">در حال پردازش...</p>
            </motion.div>
          )}
          {state === 'success' && creds && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl grid md:grid-cols-2 gap-6 items-start"
            >
              <QRCodeDisplay 
                value={loginLink} 
                label="این کد را با DeltaChat اسکن کنید"
              />
              <div className="space-y-6">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ایمیل شما</p>
                        <p className="font-mono text-sm truncate" dir="ltr">{creds.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg border">
                        <Key className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">کلمه عبور</p>
                        <p className="font-mono text-sm truncate" dir="ltr">{creds.pass}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex flex-col gap-3">
                  <Button className="h-12 text-md gap-2 shadow-lg" onClick={handleOpenDeltaChat}>
                    <ExternalLink className="w-5 h-5" />
                    ورود مستقیم به DeltaChat
                  </Button>
                  <Button variant="outline" className="h-12" onClick={() => setState('idle')}>
                    ساخت حساب دیگر
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}