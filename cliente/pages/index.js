import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { ArrowDown } from 'react-bootstrap-icons';
import RutaProtegida from "./componentes/_RutaProtegida";
import Tabla from "./componentes/_Tabla";


export default function Index() {
  const [bloques, setBloques] = useState([]);

  // Obtener los últimos 10 bloques anexados a la blockchain
  useEffect(() => {
    const obtenerBloques = async () => {
      const bloques = await fetch('http://localhost:5000/api/bloques')
        // Parsear la respuesta como JSON
        .then((response) => response.json())
        // Extraer los datos de la respuesta
        .then((data) => {
          return data;
        });

      setBloques(bloques.slice(0, 10));
    };
    obtenerBloques();
  }, []);

  return (
    <RutaProtegida>
      <Container className="text-center d-flex flex-column justify-content-center min-vh-100 gap-5">
        <Row className="justify-content-center h-100 mt-5">
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

        <Row className="min-vh-100">
          <Tabla registros={bloques} titulo="Últimos 10 bloques anexados a la blockchain" />
        </Row>
      </Container>
    </RutaProtegida>
  );
}