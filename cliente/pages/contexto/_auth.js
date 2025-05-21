import { useRouter } from "next/router";
import { createContext, useCallback, useMemo, useState } from "react";
import { toast } from 'react-hot-toast';

export const AuthContexto = createContext(null);

const ProveedorDeLogin = ({ children }) => {
    // Estados de autenticación
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);

    const router = useRouter();

    // Función para desloguear al usuario
    const desloguear = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUsuario(null);
        router.replace('/login');
    }, [router]);

    // Función para verificar el token de autenticación
    const verificarToken = useCallback(async () => {
        const tokenAlmacenado = localStorage.getItem("token");
        // console.log(`tokenAlmacenado: ${tokenAlmacenado}`);

        if (tokenAlmacenado) {
            // Decodifica la parte del payload del token (segunda parte del JWT)
            const tokenDecodificado = atob(tokenAlmacenado.split(".")[1]);
            const payload = JSON.parse(tokenDecodificado);
            // console.log(`payload: ${payload}`);
            // Verifica si el token ha expirado comparando con la fecha actual
            const tokenEstaExpirado = payload.exp < Date.now() / 1000;
            // console.log(`tokenEstaExpirado: ${tokenEstaExpirado}`);

            if (tokenEstaExpirado) {
                //console.log("token esta expirado");
                desloguear();
            } else {
                // token es valido
                //console.log("token es valido");
                setUsuario(payload.usuario);
            }
        } else {
            // Si no hay token, se lleva al usuario a la página de login
            desloguear();
        }
    }, [router, desloguear]);

    // Función para iniciar sesión
    const login = useCallback(async (usuario, contrasena) => {
        try {
            const peticion = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contrasena }),
            });

            const data = await peticion.json();

            // Si la petición es exitosa, se guarda el token en el localStorage
            if (peticion.ok) {
                localStorage.setItem('token', data.token);
                setUsuario(data.payload);
                setToken(data.token);
                router.replace('/');
            } else {
                // Si la petición no es exitosa, se muestra un mensaje de error
                toast.error(data.error || 'Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al conectar con el servidor');
        }
    }, [router]);

    // Estados a compartir con los componentes que usan el contexto
    const contextValue = useMemo(() => ({
        usuario,
        login,
        desloguear,
        verificarToken,
        token
    }), [usuario, login, desloguear, verificarToken, token]);

    // Proveedor del contexto
    return (
        <AuthContexto.Provider value={contextValue}>
            {children}
        </AuthContexto.Provider>
    );
};

export default ProveedorDeLogin;