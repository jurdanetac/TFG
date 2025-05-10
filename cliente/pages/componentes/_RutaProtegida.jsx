import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { AuthContexto } from '../contexto/auth';

export default function RutaProtegida({ children }) {
    const { usuarioLoggeado, cargando, verificarToken } = useContext(AuthContexto);
    const router = useRouter();

    // Efecto que se ejecuta al montar el componente para verificar el token
    useEffect(() => {
        verificarToken();
    }, []);

    // Muestra un spinner durante la verificación del token
    if (cargando) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        )
    }

    // Si el usuario no está logueado, redirige a la página de login
    if (!usuarioLoggeado) {
        router.push('/login');
        return null;
    }

    // Si el usuario está logueado, muestra el contenido
    return children;
}