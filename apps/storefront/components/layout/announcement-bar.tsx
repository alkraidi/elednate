'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { medusa } from '@/lib/medusa/client';
import type { AnnouncementConfig } from '@/lib/medusa/types';

export function AnnouncementBar() {
  const [config, setConfig] = useState<AnnouncementConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    medusa.config.announcement().then((r) => setConfig(r.config)).catch(() => {});
    if (typeof window !== 'undefined') {
      setDismissed(window.sessionStorage.getItem('eledante_announcement_dismissed') === '1');
    }
  }, []);

  if (!config || !config.enabled || dismissed) return null;

  return (
    <div
      className="relative w-full px-6 py-2.5 text-center text-[11px] tracking-[0.18em] uppercase font-label"
      style={{ backgroundColor: config.background_color, color: config.text_color }}
    >
      <span>{config.text}</span>
      <button
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
        onClick={() => {
          setDismissed(true);
          window.sessionStorage.setItem('eledante_announcement_dismissed', '1');
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
