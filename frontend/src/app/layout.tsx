import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { theme } from '@/lib/utils/theme';
import { AppShellLayout } from '@/components/layout/app-shell';

export const metadata = {
  title: 'Jornadas',
  description: 'Aplicação para gerenciar jornadas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <AppShellLayout>
            {children}
          </AppShellLayout>
        </MantineProvider>
      </body>
    </html>
  );
}