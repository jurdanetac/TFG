import { useContext, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { AuthContexto } from '../contexto/_auth';

export default function RutaProtegida({ children }) {
    const { verificarToken } = useContext(AuthContexto);

    // Efecto que se ejecuta al entrar a una ruta protegida,
    // para verificar si el usuario está logueado
    useEffect(() => {
        verificarToken();
    }, []);

    // Muestra un spinner durante la verificación del token
    // if (cargando) {
    //     return (
    //         <div className="d-flex justify-content-center align-items-center vh-100">
    //             <Spinner animation="border" role="status">
    //                 <span className="visually-hidden">Cargando...</span>
    //             </Spinner>
    //         </div>
    //     )
    // }

    // Si el usuario está logueado, muestra el contenido
    return children;
}