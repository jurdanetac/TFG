import '@/styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './contexto/auth';

// Load the Inter font
const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            {/* Sistema de notificaciones para feedback al usuario */}
            <Toaster />

            {/* Renderiza el componente principal de la aplicación (index.js) */}
            <div className={inter.className}>
                <Component {...pageProps} />
            </div>
        </AuthProvider>
    );
}
