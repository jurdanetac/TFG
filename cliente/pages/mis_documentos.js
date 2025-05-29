import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import RutaProtegida from "./componentes/_RutaProtegida";
import { AuthContexto } from "./contexto/_auth";

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

      fetch(`http://localhost:5000/api/documentos?usuario=${usuarioId}`, configuracionPeticion)

        // Parsear la respuesta como JSON
        .then((response) => {
          if (!response.ok) {
            // Si la respuesta no es OK, setear documentos como un array vacío
            toast.error("Error al obtener documentos: " + response.statusText);
            setDocumentos([]);
          }

          return response.json()
        })

        // Extraer los datos de la respuesta en el formato que necesitamos
        .then((data) => {
          console.info("MisDocumentos: Setteando documentos obtenidos:", data);
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

      <Row>
        {(documentos && documentos.length > 0) ? documentos.map(doc => (
          <Col key={doc.id}>
            <Card style={{ width: '100%' }}>
              <iframe
                src={doc.url}
                style={{ width: '100%', height: '300px' }}
              ></iframe>

              <Card.Body style={{ padding: '15px' }}>
                <Card.Title></Card.Title>
                <Card.Text></Card.Text>
              </Card.Body>

              <ListGroup className="list-group-flush">
                <ListGroup.Item>ADasdsadas</ListGroup.Item>
                <ListGroup.Item>Lorem i</ListGroup.Item>
                <ListGroup.Item>dolro sit amed</ListGroup.Item>
              </ListGroup>

              <Card.Footer className="d-grid gap-2" style={{ padding: '15px' }}>
                <Button
                  style={{ fontSize: '0.875rem', padding: '8px 16px' }}
                >
                  Ver
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        )) : (
          <p className="text-center fw-bold text-secondary mt-4" style={{ fontSize: '1.25rem' }}>
            No tienes documentos registrados en el sistema
          </p>
        )}
      </Row>

    </RutaProtegida>
  );
}
