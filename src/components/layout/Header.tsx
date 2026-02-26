import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Info, Home, Shield, Share2, Menu, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
export function Header() {
  const location = useLocation();
  const navItems = [
    { name: 'خانه', path: '/', icon: Home },
    { name: 'اشتراک‌گذاری', path: '/share', icon: Share2 },
    { name: 'راه‌اندازی', path: '/deploy', icon: Settings },
    { name: 'اطلا��ات', path: '/info', icon: Info },
    { name: 'امنیت', path: '/security', icon: Shield },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <span className="font-bold text-xl tracking-tight text-primary">MadMail</span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent",
                    location.pathname === item.path ? "text-primary bg-accent/50" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="relative top-0 right-0" />
          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetHeader className="text-right pb-6">
                  <SheetTitle className="text-primary text-xl font-bold">منوی MadMail</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 text-base font-medium transition-colors rounded-lg",
                          location.pathname === item.path ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}