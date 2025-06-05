import '@/styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ProveedorDeLogin from './contexto/_auth';
import Layout from './layout';

// Load the Inter font
const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
    return (
        <ProveedorDeLogin>
            {/* Sistema de notificaciones para feedback al usuario */}
            <Toaster />

            {/* Renderiza el componente principal de la aplicación (index.js) */}
            <div className={`${inter.className} d-flex flex-column min-vh-100`}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </div>
        </ProveedorDeLogin>
    );
}
