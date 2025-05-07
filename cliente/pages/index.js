// react
import { useEffect, useState } from "react";

// notificaciones
import { Toaster } from "react-hot-toast";

// componentes
import Header from "./componentes/_Encabezado";
import Hero from "./componentes/_Hero";
import LoginForm from "./componentes/_LoginForm";

// componente principal de la aplicación
export default function Principal() {
  // Estado para controlar si el usuario está logueado o no.
  const [usuarioLoggeado, setUsuarioLoggeado] = useState(false);
  const [token, setToken] = useState(null); // Estado para almacenar el token de autenticación

  // Efecto que se ejecuta al cargar la página para verificar si el usuario ya está logueado
  useEffect(() => {
    // Verifica si hay un token almacenado en localStorage al cargar la página
    const tokenAlmacenado = localStorage.getItem("token");
    if (tokenAlmacenado) {
      // Si hay un token, revisar que no esté caducado o inválido
      const tokenDecodificado = atob(tokenAlmacenado.split(".")[1]);
      // Verifica si el token ha expirado
      const tokenEstaExpirado = JSON.parse(tokenDecodificado).exp < Date.now() / 1000;

      if (tokenEstaExpirado) {
        // Si el token ha expirado, eliminarlo y redirigir al usuario a la página de inicio de sesión
        localStorage.removeItem("token");
        setUsuarioLoggeado(false);
        setToken(null);
        return;
      }

      // Si hay un token (válido), el usuario está logueado y puede usar la aplicación
      setToken(tokenAlmacenado);
      setUsuarioLoggeado(true);
    }
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez al cargar el componente

  return (
    <>
      {/* Componente de notificaciones para mostrar mensajes al usuario */}
      <Toaster />

      {/* Si el usuario está logueado, muestra el Header y Hero,
      en caso contrario, muestra el formulario de inicio de sesión*/}

      {usuarioLoggeado ? (
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
