import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
interface DocsLayoutProps {
  children: React.ReactNode;
}
export function DocsLayout({ children }: DocsLayoutProps) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans" dir="rtl">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/docs" className="flex items-center gap-2">
              <Book className="h-6 w-6 text-primary" />
              <span className="font-black text-xl tracking-tight">مستندات MadMail</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Home className="h-4 w-4" />
                بازگشت ب�� سایت
              </Link>
              <Link
                to="/docs"
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === "/docs" ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                شاخص مستندات
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            {children}
          </div>
        </div>
      </main>
      <footer className="border-t py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-right flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MadMail Project. متن‌باز و آزاد.</p>
          <div className="flex gap-4">
            <Link to="/docs/general" className="hover:underline">راهنمای عمومی</Link>
            <Link to="/docs/admin" className="hover:underline">پنل مدیریت</Link>
          </div>
        </div>
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  );
}