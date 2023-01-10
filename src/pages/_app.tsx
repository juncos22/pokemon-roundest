import type { AppProps } from 'next/app'
import { trpc } from '../utils/trpc';
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import '@/styles/loader.css';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default trpc.withTRPC(App);
