import React from 'react';
import { Header } from './Header';
import { Toaster } from '@/components/ui/sonner';
interface AppLayoutProps {
  children: React.ReactNode;
}
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            {children}
          </div>
        </div>
      </main>
      <footer className="border-t py-6 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MadMail. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  );
}