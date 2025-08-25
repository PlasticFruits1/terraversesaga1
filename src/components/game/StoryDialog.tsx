'use client';

import type { StoryChapter } from '@/lib/story';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface StoryDialogProps {
  chapter: StoryChapter;
  onNext: () => void;
}

export default function StoryDialog({ chapter, onNext }: StoryDialogProps) {
  const { character, dialogue, isBattle, imageUrl } = chapter;

  if (isBattle) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => { /* Controlled externally */ }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{character}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
            {imageUrl && (
                 <div className="relative aspect-video w-full rounded-md overflow-hidden mb-4">
                    <Image
                        src={imageUrl}
                        alt={`Image of ${character}`}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            )}
          <p className="text-base leading-relaxed">{dialogue}</p>
        </div>
        <DialogFooter>
          <Button onClick={onNext}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
