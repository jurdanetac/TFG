import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import RutaProtegida from "./componentes/_RutaProtegida";
import { AuthContexto } from "./contexto/_auth";

export default function MisDocumentos() {
  const [documentos, setDocumentos] = useState([]);

  // estado para almacenar el usuario logueado
  const [usuarioId, setUsuarioId] = useState(null);

  // obtener el usuario logueado del contexto
  const contexto = useContext(AuthContexto);

  useEffect(() => {
    const usuario = contexto.usuario;

    // revisar si el contexto cargó para obtener el usuario logueado
    if (usuario) {
      console.log("Usuario logueado:", usuario);  
      setUsuarioId(usuario.id);
    }
  }, [contexto]);

  // Obtener los documentos del usuario que está logueado
  /*
  useEffect(() => {
    const obtenerDocumentos = async () => {
      const docs = await fetch(`http://localhost:5000/api/documentos?usuario=${usuarioId}`)
        // Parsear la respuesta como JSON
        .then((response) => response.json())
        // Extraer los datos de la respuesta
        .then((data) => {
          return data;
        });

      // Transform the documents data to include base64 URL
      const docsWithUrls = docs.map(doc => ({
        ...doc,
        url: `data:application/pdf;base64,${doc.contenido}`
      }));

      setDocumentos(docsWithUrls);
    };

    obtenerDocumentos();
  }, []);
  */

  return (
    <RutaProtegida>
      {usuarioId ? <p>Usuario logueado: {usuarioId}</p> : <p>No hay usuario logueado</p>}
      {/*
      <Container>
        <Row className="d-flex flex-wrap">
          {documentos.map(doc => (
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
          )) : <Col>No hay documentos</Col>}
           */}
    </RutaProtegida >
  );
}
