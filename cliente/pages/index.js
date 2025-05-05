// react
import { useState } from "react";

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
