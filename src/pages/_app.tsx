import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
