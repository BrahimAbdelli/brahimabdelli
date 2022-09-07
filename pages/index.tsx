import type { NextPage } from 'next';
import Head from 'next/head';

import { LoginPage } from '../components';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-purple-200">
      <Head>
        <title>Slider Login / Signup</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoginPage />
    </div>
  );
};

export default Home;
