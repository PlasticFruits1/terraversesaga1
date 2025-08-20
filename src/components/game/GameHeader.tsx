'use client';

import { Button } from '@/components/ui/button';
import { Save, Download, Trash2, Swords } from 'lucide-react';

interface GameHeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
}

export default function GameHeader({ onSave, onLoad, onReset }: GameHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Swords className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">Terraverse Saga</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button variant="outline" size="sm" onClick={onLoad}>
            <Download className="mr-2 h-4 w-4" /> Load
          </Button>
           <Button variant="destructive" size="sm" onClick={onReset}>
            <Trash2 className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>
    </header>
  );
}
