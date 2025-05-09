/**
 * @fileoverview Componente principal de la aplicación que maneja la autenticación y renderizado condicional
 * de la interfaz de usuario basado en el estado de login.
 */

// Importaciones de React y hooks necesarios para el componente
import { useCallback, useEffect, useState } from "react";

// Importación del sistema de notificaciones para mostrar mensajes al usuario
import { Toaster, toast } from "react-hot-toast";

// Importación de componentes personalizados de la aplicación
import Header from "./componentes/_Encabezado";
import Home from "./componentes/_Home";
import LoginForm from "./componentes/_LoginForm";

import { verificarTokenJWT } from "./funciones";

// Importación del componente de carga de react-bootstrap para mostrar durante la verificación
import { Spinner } from "react-bootstrap";


/**
 * Componente Principal - Punto de entrada de la aplicación
 * @returns {JSX.Element} Renderiza la interfaz de usuario basada en el estado de autenticación
 * 
 * Este componente:
 * 1. Maneja el estado de autenticación del usuario
 * 2. Verifica el token al cargar la aplicación
 * 3. Renderiza diferentes vistas según el estado de autenticación
 */
export default function Principal() {
  // Estados para manejar la autenticación y la interfaz de usuario
  const [usuarioLoggeado, setUsuarioLoggeado] = useState(false); // Controla si el usuario está autenticado
  const [token, setToken] = useState(null); // Almacena el token JWT de autenticación
  const [cargando, setCargando] = useState(true); // Controla el estado de carga durante la verificación
  const [error, setError] = useState(null); // Maneja los errores que puedan ocurrir

  /**
   * Función para verificar el token de autenticación
   * Utiliza useCallback para memoizar la función y evitar recreaciones innecesarias
   * 
   * Esta función:
   * 1. Obtiene el token del localStorage
   * 2. Verifica su validez
   * 3. Actualiza el estado de autenticación
   * 4. Maneja los errores que puedan ocurrir
   */
  const verificarToken = useCallback(async () => {
    try {
      // Obtiene el token almacenado en el localStorage
      const tokenAlmacenado = localStorage.getItem("token");

      // Si no hay token, resetea el estado de autenticación
      if (!tokenAlmacenado) {
        setUsuarioLoggeado(false);
        setToken(null);
        return;
      }

      // Verifica la validez del token
      const { esValido, payload } = verificarTokenJWT(tokenAlmacenado);

      if (!esValido) {
        // Si el token no es válido, limpia los datos de autenticación
        localStorage.removeItem("token");
        setUsuarioLoggeado(false);
        setToken(null);
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        // Si el token es válido, actualiza el estado de autenticación
        setToken(tokenAlmacenado);
        setUsuarioLoggeado(true);
      }
    } catch (error) {
      // Maneja cualquier error que ocurra durante el proceso
      console.error('Error en la verificación del token:', error);
      setError('Error al verificar la sesión');
      toast.error('Error al verificar tu sesión');
    } finally {
      // Siempre finaliza el estado de carga, independientemente del resultado
      setCargando(false);
    }
  }, []); // Array de dependencias vacío porque no depende de ningún estado o prop

  // Efecto que se ejecuta al montar el componente para verificar el token
  useEffect(() => {
    verificarToken();
  }, [verificarToken]);

  // Renderizado condicional para mostrar errores
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h3>Error</h3>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setError(null);
              verificarToken();
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sistema de notificaciones para feedback al usuario */}
      <Toaster />

      {/* Renderizado condicional basado en el estado de carga y autenticación */}
      {cargando ? (
        // Muestra un spinner durante la verificación del token
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : usuarioLoggeado ? (
        // Renderiza la interfaz principal si el usuario está autenticado
        <>
          <Header />
          <Home />
        </>
      ) : (
        // Muestra el formulario de login si el usuario no está autenticado
        <LoginForm props={{ setToken, setUsuarioLoggeado }} />
      )}
    </>
  );
}