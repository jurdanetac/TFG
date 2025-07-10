import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import CountUp from 'react-countup';
import RutaProtegida from "./componentes/_RutaProtegida";
import TituloPagina from "./componentes/_TituloPagina";

export default function Index() {
  const [cantidadUsuarios, setCantidadUsuarios] = useState(0);
  const [cantidadDocumentos, setCantidadDocumentos] = useState(0);
  const [cantidadTiposDocumentos, setCantidadTiposDocumentos] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.URL_BACKEND + '/info');
        const data = await response.json();
        setCantidadUsuarios(data.cantidad_usuarios);
        setCantidadDocumentos(data.cantidad_documentos);
        setCantidadTiposDocumentos(data.cantidad_tipos_de_documentos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <RutaProtegida>
      <Container className="text-center d-flex flex-column align-items-center" style={{ gap: '150px' }}>

        {/* Hero Section */}
        <section className="d-flex flex-column justify-content-center align-items-center">
          <Image
            src="/blockchain-gif.gif"
            alt="Blockchain GIF"
            width="500px"
            className="mb-4"
          />
          <div className="w-100 w-md-75">
            <TituloPagina titulo="Sistema de distribución y autenticación de documentos digitales basado en blockchain" />
            <small className="d-block mt-2 text-secondary fs-5">
              Trabajo Final de Grado<br />Universidad Dr. Rafael Belloso Chacín
            </small>
          </div>
        </section>

        {/* Informative Section */}
        <section className="py-5 bg-light">
          <Container>
            <TituloPagina titulo="¿Qué es este sistema?" />
            <Row className="text-center">
              <Col md={4} className="mb-4">
                <Card className="shadow border-0 h-100">
                  <Card.Body>
                    <h3 className="fw-bold text-primary">¿Qué es?</h3>
                    <p className="text-secondary">
                      Un sistema para subir, almacenar y autenticar documentos digitales de forma segura y transparente.
                    </p>
                    <Button variant="primary" href="/subir" className="mt-3">
                      Subir Documento
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="shadow border-0 h-100">
                  <Card.Body>
                    <h3 className="fw-bold text-success">¿Cómo funciona?</h3>
                    <p className="text-secondary">
                      Utiliza tecnología blockchain para garantizar la integridad y autenticidad de los documentos.
                    </p>
                    <Button variant="success" href="/mis_documentos" className="mt-3">
                      Mis Documentos
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="shadow border-0 h-100">
                  <Card.Body>
                    <h3 className="fw-bold text-info">¿Cómo buscar?</h3>
                    <p className="text-secondary">
                      Puedes buscar documentos por palabras clave o por el nombre del documento.
                    </p>
                    <Button variant="info" href="/buscar" className="mt-3">
                      Buscar Documentos
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="w-100 w-md-75">
          <TituloPagina titulo="Estadísticas" />
          <Row className="text-center mt-4">
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center" style={{ height: '200px' }}>
                  <Card.Text className="text-secondary fs-5 text-center">
                    <CountUp start={0} end={cantidadUsuarios} duration={2.75} separator="," enableScrollSpy={true} />
                    <span className="text-muted"> usuarios registrados en el sistema.</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center" style={{ height: '200px' }}>
                  <Card.Text className="text-secondary fs-5 text-center">
                    <CountUp start={0} end={cantidadDocumentos}
                      duration={2.75} separator="," enableScrollSpy={true} />
                    <span className="text-muted"> documentos sido subidos al sistema.</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center" style={{ height: '200px' }}>
                  <Card.Text className="text-secondary fs-5 text-center">
                    <CountUp start={0} end={cantidadTiposDocumentos} duration={2.75} separator="," enableScrollSpy={true} />
                    <span className="text-muted"> tipos de documentos creados.</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Developers Section */}
        <section className="w-100 w-md-75 text-center">
          <TituloPagina titulo="Desarrolladores" />
          <p className="text-secondary">
            <strong>Br. Urdaneta, Juan</strong><br />
            <strong>Br. Rincon, Samuel</strong><br />
            <strong>Br. Baez, Samuel</strong><br />
            <span>@</span><br />
            Universidad Dr. Rafael Belloso Chacín<br />
            Facultad de Ingeniería<br />
            Escuela de Informática<br />
            2025
          </p>
        </section>
      </Container>
    </RutaProtegida>
  );
}
