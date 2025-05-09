import Encabezado from "./componentes/_Encabezado";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";

export default function Home() {
  const cardsData = Array.from({ length: 10 }, (_, index) => ({
    id: index,
    title: `Documento ${index + 1}`,
    image: "https://html.scribdassets.com/7id4d1l3k08rdhxj/images/1-0573e6c312.jpg",
    description: "Esto es una carta de prueba",
    uploadDate: "2021-01-01",
    author: "Juan Perez",
    version: "1.0"
  }));

  return (
    <>
      <Encabezado />
      <Container>
        <Row className="d-flex flex-wrap">
          {cardsData.map(card => (
            <Col key={card.id} md={3} className="mb-3">
              <Card style={{ width: '100%' }}>
                <Card.Img
                  src={card.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Card.Body style={{ padding: '15px' }}>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.description}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>Subido: {card.uploadDate}</ListGroup.Item>
                  <ListGroup.Item>Autor: {card.author}</ListGroup.Item>
                  <ListGroup.Item>Versión: {card.version}</ListGroup.Item>
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
          ))}
        </Row>
      </Container>
    </>
  );
}
