/**
 * @fileoverview Componente principal de la aplicación que maneja la autenticación y renderizado condicional
 * de la interfaz de usuario basado en el estado de login.
 */

// react
import { useEffect, useState } from "react";

// notificaciones
import { Toaster } from "react-hot-toast";

// componentes
import Header from "./componentes/_Encabezado";
import Hero from "./componentes/_Hero";
import LoginForm from "./componentes/_LoginForm";

// spinner de react-bootstrap
import { Spinner } from "react-bootstrap";

/**
 * Componente Principal - Punto de entrada de la aplicación
 * @returns {JSX.Element} Renderiza la interfaz de usuario basada en el estado de autenticación
 */
export default function Principal() {
  // Estados para manejar la autenticación y la interfaz de usuario
  const [usuarioLoggeado, setUsuarioLoggeado] = useState(false); // Controla si el usuario está autenticado
  const [token, setToken] = useState(null); // Almacena el token JWT de autenticación
  const [cargando, setCargando] = useState(true); // Controla el estado de carga durante la verificación del token

  /**
   * Efecto que verifica la validez del token almacenado al cargar la aplicación
   * - Comprueba si existe un token en localStorage
   * - Valida si el token ha expirado
   * - Actualiza el estado de autenticación según corresponda
   */
  useEffect(() => {
    const verificarToken = async () => {
      const tokenAlmacenado = localStorage.getItem("token");
      if (tokenAlmacenado) {
        // Decodifica la parte del payload del token JWT
        const tokenDecodificado = atob(tokenAlmacenado.split(".")[1]);
        const tokenEstaExpirado = JSON.parse(tokenDecodificado).exp < Date.now() / 1000;

        if (tokenEstaExpirado) {
          // Limpia los datos de autenticación si el token ha expirado
          localStorage.removeItem("token");
          setUsuarioLoggeado(false);
          setToken(null);
        } else {
          // Establece el estado de autenticación si el token es válido
          setToken(tokenAlmacenado);
          setUsuarioLoggeado(true);
        }
      }
      setCargando(false); // Finaliza el proceso de verificación
    };

    verificarToken();
  }, []);

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
          <Hero />
        </>
      ) : (
        // Muestra el formulario de login si el usuario no está autenticado
        <LoginForm props={{ setToken, setUsuarioLoggeado }} />
      )}
    </>
  );
}
