import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import {
  CalendarPlus,
  JournalRichtext,
  KeyFill
} from "react-bootstrap-icons";
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
      <h1
        className="text-center mb-4 fw-bold "
      >
        Mis Documentos
      </h1>
      <hr className="mb-4" />

      {(documentos && documentos.length > 0) ? (
        <Row xs={1} md={3} className="g-4">
          {documentos.map(doc => {
            const fecha = new Date(doc.creado_en);
            const nombreDocumento = doc.nombre
            const nombreTipoDoc = doc.tipo_de_documento
            const palabras_clave = doc.palabras_clave ? doc.palabras_clave.join(', ') : 'No hay palabras clave';

            const atributos = Object.entries(doc.valores_attrib).map(([nombre, valor]) => ({ nombre, valor }));
            const cantidadDeAtributos = Object.keys(atributos).length;

            return (
              <Col key={doc.id}>
                <Card style={{ width: '100%' }}>
                  <iframe
                    src={doc.url}
                    style={{ width: '100%', height: '300px' }}
                  ></iframe>

                  <Card.Body style={{ padding: '15px' }}>
                    <Card.Title>{nombreDocumento}</Card.Title>
                    <Card.Text className="fst-italic">{nombreTipoDoc}</Card.Text>
                  </Card.Body>

                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <CalendarPlus className="me-2" /> {fecha.toLocaleDateString()} {fecha.toLocaleTimeString()}
                      </div>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <KeyFill className="me-2" style={{ transform: 'rotate(45deg)' }}
                        />
                        {palabras_clave}
                      </div>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <JournalRichtext className="me-2" />
                      {cantidadDeAtributos > 0 ?
                        atributos.map((attr, index) => (
                          <span key={index} className="badge bg-secondary me-1">
                            {attr.nombre}: {attr.valor}
                          </span>
                        )) :
                        'No hay atributos asociados'
                      }
                    </ListGroup.Item>
                  </ListGroup>

                  <Card.Footer className="d-grid gap-2" style={{ padding: '15px' }}>
                    <Button variant="primary">
                      Descargar
                    </Button>
                  </Card.Footer>
                </Card>
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
