import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css";

// Load the Inter font
const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
    return (
        <main className={inter.className}>
            <Component {...pageProps} />
        </main>
    );
}
