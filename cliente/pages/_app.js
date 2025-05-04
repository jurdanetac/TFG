// estilos globales
import '@/styles/globals.css';
import "bootstrap/dist/css/bootstrap.min.css";

// react
import { useState } from "react";

// notificaciones
import { Toaster } from "react-hot-toast";

// componentes
import Header from "./components/_Header";
import Hero from "./components/_Hero";
import LoginForm from "./components/_LoginForm";

const PaginaPrincipal = () => {
  return (
    <>
      <Header />
      <Hero />
    </>
  );
}

// Componente principal de la aplicación
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
        <PaginaPrincipal />
      ) : (
        <LoginForm props={{ setToken, setUsuarioLoggeado }} />
      )}
    </>
  );
}