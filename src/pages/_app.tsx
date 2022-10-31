import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextSeo
        title="Brahim Abdelli"
        titleTemplate="Brahim Abdelli"
        defaultTitle="Brahim Abdelli"
        description="A software engineer who loves to build solutions. I have been coding for over almost three years now. I love to document my journey by writing blog posts and also teach others through them."
        canonical="https://www.brahimabdelli.com/"
        openGraph={{
          url: 'https://www.brahimabdelli.com/',
          title: 'Brahim Abdelli',
          description:
            'A software engineer who loves to build solutions. I have been coding for over almost three years now. I love to document my journey by writing blog posts and also teach others through them.',
          images: [
            {
              url: '/android-chrome-192x192.png',
              width: 800,
              height: 420,
              alt: 'Brahim Abdelli',
            },
          ],
        }}
      />
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
