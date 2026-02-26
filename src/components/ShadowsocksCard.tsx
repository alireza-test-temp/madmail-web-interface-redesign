import React from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface ShadowsocksCardProps {
  url: string;
}
export function ShadowsocksCard({ url }: ShadowsocksCardProps) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('لینک کپی شد');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('خطا در کپی لینک');
    }
  };
  return (
    <Card className="border-dashed border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          تنظیمات پروکسی Shadowsocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            از این لینک برای دور زدن محدودیت‌ها و اتصال امن‌تر در DeltaChat استفاده کنید.
          </p>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md overflow-hidden">
            <code className="text-xs truncate flex-1 font-mono text-left" dir="ltr">
              {url}
            </code>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}