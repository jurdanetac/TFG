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

// componente principal de la aplicación
export default function Principal() {
  // Estado para controlar si el usuario está logueado o no.
  const [usuarioLoggeado, setUsuarioLoggeado] = useState(false);
  const [token, setToken] = useState(null); // Estado para almacenar el token de autenticación
  const [cargando, setCargando] = useState(true); // Estado para controlar si se está verificando el login

  // Efecto que se ejecuta al cargar la página para verificar si el usuario ya está logueado
  useEffect(() => {
    // Simula la verificación del token almacenado
    const verificarToken = async () => {
      const tokenAlmacenado = localStorage.getItem("token");
      if (tokenAlmacenado) {
        const tokenDecodificado = atob(tokenAlmacenado.split(".")[1]);
        const tokenEstaExpirado = JSON.parse(tokenDecodificado).exp < Date.now() / 1000;

        if (tokenEstaExpirado) {
          // Si el token ha expirado, eliminarlo
          localStorage.removeItem("token");
          setUsuarioLoggeado(false);
          setToken(null);
        } else {
          // Si el token es válido, el usuario está logueado
          setToken(tokenAlmacenado);
          setUsuarioLoggeado(true);
        }
      }
      setCargando(false); // Finaliza la verificación
    };

    verificarToken();
  }, []);

  return (
    <>
      {/* Componente de notificaciones para mostrar mensajes al usuario */}
      <Toaster />

      {/* Mostrar un spinner mientras se verifica el estado de login */}
      {cargando ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : usuarioLoggeado ? (
        <>
          <Header />
          <Hero />
        </>
      ) : (
        <LoginForm props={{ setToken, setUsuarioLoggeado }} />
      )}
    </>
  );
}
