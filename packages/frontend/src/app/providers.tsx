'use client';

import { Toaster } from 'sonner';

export function Providers() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        classNames: {
          toast: 'font-sans',
        },
      }}
      closeButton
      richColors
    />
  );
}
