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
        toast.success("Sesión cerrada correctamente", {
            icon: '👋',
        });
    }, [router]);

    // Función para verificar el token de autenticación
    const verificarToken = useCallback(async () => {
        console.info("AUTH: Verificando token de autenticación...");
        const tokenAlmacenado = localStorage.getItem("token");

        if (tokenAlmacenado) {
            console.info("AUTH: Token encontrado");

            // Decodifica la parte del payload del token (segunda parte del JWT)
            const tokenDecodificado = atob(tokenAlmacenado.split(".")[1]);
            const payload = JSON.parse(tokenDecodificado);

            // Verifica si el token ha expirado comparando con la fecha actual
            const tokenEstaExpirado = payload.exp < Date.now() / 1000;

            if (tokenEstaExpirado) {
                console.warn("AUTH: Token expirado, deslogueando...");
                desloguear();
            } else {
                console.info("AUTH: Consultando si la sesión es válida en el servidor...");

                const peticion = await fetch(process.env.URL_BACKEND + '/login', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenAlmacenado}`
                    },
                });

                // Si la petición no es exitosa, desloguea al usuario porque
                // el token no es válido o la sesión ha expirado en el servidor
                if (!peticion.ok) {
                    console.error("AUTH: Token inválido, deslogueando...");
                    desloguear();
                } else {
                    console.info("AUTH: Token válido, utilizando esa sesión");
                    setUsuario(payload.usuario);
                    setToken(tokenAlmacenado);
                }
            }
        } else {
            console.warn("AUTH: No se encontró token, deslogueando...");
            desloguear();
        }
    }, [router, desloguear]);

    // Función para iniciar sesión
    const login = useCallback(async (usuario, contrasena) => {
        try {
            console.info("AUTH: Iniciando sesión con usuario:", usuario);
            const peticion = await fetch(process.env.URL_BACKEND + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contrasena }),
            });

            const data = await peticion.json();

            // Si la petición es exitosa, se guarda el token en el localStorage
            if (peticion.ok) {
                console.info("AUTH: Inicio de sesión exitoso, guardando token y usuario");
                localStorage.setItem('token', data.token);
                setUsuario(data.payload);
                setToken(data.token);
                router.replace('/');
                toast.success("Sesión iniciada correctamente");
            } else {
                console.error("AUTH: Error al iniciar sesión:", data.error);
                toast.error(data.error || 'Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('AUTH: Error al conectar con el servidor:', error);
            toast.error('Error al conectar con el servidor');
        }
    }, [router]);

    const registro = useCallback(async (usuario, contrasena, nombre) => {
        try {
            console.info("AUTH: Iniciando sesión con usuario:", usuario);
            const peticion = await fetch(process.env.URL_BACKEND + '/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contrasena, nombre }),
            });

            const data = await peticion.json();

            // Si la petición es exitosa, se redirecciona al inicio de sesión
            if (peticion.ok) {
                console.info("AUTH: Registro exitoso, guardando usuario y redirigiendo a inicio de sesión");
                router.replace('/login');
                toast.success("Registro exitoso, por favor inicia sesión");
            } else {
                console.error("AUTH: Error al registrar usuario:", data.error);
                toast.error(data.error || 'Registro fallido, por favor intenta de nuevo');
            }
        } catch (error) {
            console.error('AUTH: Error al conectar con el servidor:', error);
            toast.error('Error al conectar con el servidor');
        }
    }, [router]);

    // Estados a compartir con los componentes que usan el contexto
    const contextValue = useMemo(() => ({
        usuario,
        login,
        desloguear,
        verificarToken,
        token,
        registro
    }), [usuario, login, desloguear, verificarToken, token, registro]);

    // Proveedor del contexto
    return (
        <AuthContexto.Provider value={contextValue}>
            {children}
        </AuthContexto.Provider>
    );
};

export default ProveedorDeLogin;