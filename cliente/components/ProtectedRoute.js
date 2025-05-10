import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContexto } from '../pages/contexto/auth';

export default function ProtectedRoute({ children }) {
    const { usuarioLoggeado, cargando, verificarToken } = useContext(AuthContexto);
    const router = useRouter();

    useEffect(() => {
        verificarToken();
    }, []);

    if (cargando) {
        return <div>Cargando...</div>;
    }

    if (!usuarioLoggeado) {
        router.push('/login');
        return null;
    }

    return children;
} 