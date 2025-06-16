import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import DocumentoCard from "./componentes/_DocumentoCard";
import RutaProtegida from "./componentes/_RutaProtegida";
import { AuthContexto } from "./contexto/_auth";
import { URL_BACKEND } from "./_const";
import TituloPagina from "./componentes/_TituloPagina";

export default function MisDocumentos() {

  const [documentos, setDocumentos] = useState(null);

  // obtener el usuario logueado del contexto
  const { usuario, token } = useContext(AuthContexto);

  useEffect(() => {
    // revisar si el contexto cargó para obtener el usuario logueado
    if (usuario && token) {
      const usuarioId = usuario.id;

      console.info("MisDocumentos: Solicitando documentos del usuario:", usuario.usuario);

      const configuracionPeticion = { // Configuración de la solicitud
        method: 'GET',
        // Incluir el token de autorización en los headers para que el servidor pueda identificar al usuario
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }

      fetch(URL_BACKEND + `/documentos?usuario=${usuarioId}`, configuracionPeticion)

        // Parsear la respuesta como JSON
        .then((response) => {

          console.log("MisDocumentos: Respuesta del servidor:", response);
          if (!response.ok) {
            // Si la respuesta no es OK, setear documentos como un array vacío
            toast.error("Error al obtener documentos: " + response.statusText);
            setDocumentos([]);
          }

          return response.json()
        })

        // Extraer los datos de la respuesta en el formato que necesitamos
        .then((data) => {
          console.info(`MisDocumentos: Setteando ${data.length} documentos obtenidos:`, data);
          const conURL = data.map(doc => ({
            ...doc,
            url: `data:application/pdf;base64,${doc.contenido}`
          }));
          setDocumentos(conURL);
        });
    } else {
      console.info("MisDocumentos: Cargando context...");
    }
    // ejecutar este efecto solo cuando el usuario cambie (contexto de login)
  }, [usuario, token]);


  return (
    <RutaProtegida>
      <TituloPagina titulo={"Mis Documentos"} />

      {(documentos && documentos.length > 0) ? (
        <Row xs={1} md={3} className="g-4">
          {documentos.map(doc => {
            return (
              <Col key={doc.id}>
                <DocumentoCard doc={doc} />
              </Col>
            );
          })}
        </Row>
      ) : (
        <p className="text-center fw-bold text-secondary mt-4" style={{ fontSize: '1.25rem' }}>
          No tienes documentos registrados en el sistema
        </p>
      )}
    </RutaProtegida>
  );
}
