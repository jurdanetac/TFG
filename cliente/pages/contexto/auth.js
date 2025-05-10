import { useRouter } from "next/router";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from 'react-hot-toast';

export const AuthContexto = createContext(null);

/**
 * Utilidad para verificar y decodificar el token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Objeto con el estado de validez del token y su payload
 * 
 * Esta función:
 * 1. Decodifica el payload del token JWT
 * 2. Verifica si el token ha expirado
 * 3. Retorna un objeto con la validez y el payload del token
 */
const verificarTokenJWT = (token) => {
    try {
        // Decodifica la parte del payload del token (segunda parte del JWT)
        const tokenDecodificado = atob(token.split(".")[1]);
        const payload = JSON.parse(tokenDecodificado);
        // Verifica si el token ha expirado comparando con la fecha actual
        const tokenEstaExpirado = payload.exp < Date.now() / 1000;

        return {
            esValido: !tokenEstaExpirado,
            payload
        };
    } catch (error) {
        // Si hay algún error en el proceso, el token se considera inválido
        console.error('Error al verificar el token:', error);
        return {
            esValido: false,
            payload: null
        };
    }
};

const AuthProvider = ({ children }) => {
    // Estados de autenticación
    const [usuarioLoggeado, setUsuarioLoggeado] = useState(false);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true);

    const router = useRouter();

    // Verifica si el usuario está autenticado al cargar la aplicación
    useEffect(() => {
        verificarToken();
    }, []);

    // Función para desloguear al usuario
    const desloguear = useCallback(() => {
        localStorage.removeItem("token");
        router.push('/login');
    }, [router]);

    // Función para verificar el token de autenticación
    const verificarToken = useCallback(async () => {
        try {
            const tokenAlmacenado = localStorage.getItem("token");

            if (!tokenAlmacenado) {
                desloguear();
                router.push('/login');
                return;
            }

            const { esValido } = verificarTokenJWT(tokenAlmacenado);

            if (!esValido) {
                desloguear();
            } else {
                setToken(tokenAlmacenado);
                setUsuarioLoggeado(true);
            }
        } catch (error) {
            console.error('Error en la verificación del token:', error);
            desloguear();
        } finally {
            setCargando(false);
        }
    }, [router, desloguear]);

    // Función para iniciar sesión
    const login = async (usuario, contrasena) => {
        try {
            setCargando(true);

            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contrasena }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setUsuarioLoggeado(true);
                toast.success('Inicio de sesión exitoso');
                router.push('/');
            } else {
                toast.error(data.mensaje || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    // Pasar los estados y funciones al contexto de la aplicación
    const props = {
        usuarioLoggeado,
        token,
        cargando,
        login,
        desloguear,
        verificarToken
    };

    return (
        <AuthContexto.Provider value={props}>
            {children}
        </AuthContexto.Provider>
    );
};

export default AuthProvider;