import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/card';
interface QRCodeDisplayProps {
  value: string;
  label?: string;
}
export function QRCodeDisplay({ value, label }: QRCodeDisplayProps) {
  if (!value) return null;
  return (
    <Card className="p-6 flex flex-col items-center gap-4 bg-white dark:bg-zinc-900 border-2 border-primary/10 shadow-lg">
      <div className="p-3 bg-white rounded-xl">
        <QRCodeSVG 
          value={value} 
          size={220}
          level="H"
          includeMargin={false}
          className="w-full h-auto max-w-[220px]"
        />
      </div>
      {label && (
        <p className="text-sm font-medium text-center text-muted-foreground">
          {label}
        </p>
      )}
    </Card>
  );
}