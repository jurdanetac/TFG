import { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import RutaProtegida from "./componentes/_RutaProtegida";

export default function MisDocumentos() {
  const cardsData = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    title: `Documento ${index + 1}`,
    image: "https://html.scribdassets.com/7id4d1l3k08rdhxj/images/1-0573e6c312.jpg",
    description: "Esto es una carta de prueba",
    uploadDate: "2021-01-01",
    author: "Juan Perez",
    version: "1.0"
  }));

  const [documentos, setDocumentos] = useState([]);

  // Obtener los últimos 10 bloques anexados a la blockchain
  useEffect(() => {
    const obtenerDocumentos = async () => {
      const docs = await fetch('http://localhost:5000/api/documentos')
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

  return (
    <RutaProtegida>
      <Container>
        <Row className="d-flex flex-wrap">
          {documentos ? documentos.map(doc => (
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
        </Row>
      </Container>
    </RutaProtegida>
  );
}
