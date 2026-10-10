import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const globalStyles = `
html, body {
  background-color: #E6F4FE;
  overflow-x: hidden;
  overscroll-behavior: none;
  touch-action: manipulation;
  -webkit-text-size-adjust: 100%;
}
`;

const blockPinchZoom = `
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="description" content="WeatherFlow : prévisions météo et cartes interactives." />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/pwa-64x64.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="WeatherFlow" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#208AEF" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        <script dangerouslySetInnerHTML={{ __html: blockPinchZoom }} />
      </head>
      <body>{children}</body>
    </html>
  );
}