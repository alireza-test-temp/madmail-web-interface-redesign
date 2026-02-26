import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Info, Home, Shield, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
export function Header() {
  const location = useLocation();
  const navItems = [
    { name: 'خانه', path: '/', icon: Home },
    { name: 'اطلاعات', path: '/info', icon: Info },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <span className="font-bold text-xl tracking-tight text-primary">MadMail</span>
          </Link>
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
        </div>
      </div>
    </header>
  );
}