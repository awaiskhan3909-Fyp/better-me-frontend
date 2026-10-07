import { useEffect } from 'react';
import faviconUrl from '../../imports/Favicon_Better_me.png';

export default function Favicon() {
  useEffect(() => {
    // Update favicon
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconUrl;
    if (!document.querySelector("link[rel~='icon']")) {
      document.head.appendChild(link);
    }

    // Update page title
    document.title = 'Better me - AI-Powered CBT Therapy';
  }, []);

  return null;
}
