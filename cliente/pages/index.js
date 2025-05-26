import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { ArrowDown } from 'react-bootstrap-icons';
import RutaProtegida from "./componentes/_RutaProtegida";


export default function Index() {
  return (
    <RutaProtegida>
      <Container className="text-center d-flex flex-column justify-content-center min-vh-100 gap-5">
        <Row className="justify-content-center h-100">
          <Col lg={6}>
            {/* Ícono de blockchain */}
            <Image
              className="d-block mx-auto mb-4"
              src="/blockchain-gif.gif"
              alt=""
              width="100%"
            />

            {/* Título y subtítulo */}
            <div>
              <h1 className="text-center fs-2 fs-md-1 fw-semibold text-dark mb-3">
                Sistema de distribución y autenticación de documentos digitales basado en blockchain
              </h1>
              <hr className="my-1" />
              <small className="d-block mt-2 text-secondary fs-5 fs-md-4 fw-normal">
                Trabajo Final de Grado<br />Universidad Dr. Rafael Belloso Chacín
              </small>
            </div>

            <Button
              variant="dark"
              className="mt-4"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                });
              }}
            >
              <ArrowDown />
            </Button>
          </Col>
        </Row>
      </Container>
    </RutaProtegida>
  );
}