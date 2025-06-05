import { Button, Card, Container, Image, Row, Col } from "react-bootstrap";
import { ArrowDown } from 'react-bootstrap-icons';
import RutaProtegida from "./componentes/_RutaProtegida";
import TituloPagina from "./componentes/_TituloPagina";
import CountUp from 'react-countup';

export default function Index() {
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

          {/*
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
           */}
        </section>

        {/* Informative Section */}
        <section>
          <TituloPagina titulo="¿Qué es este sistema?" />

          <Row className="w-100 w-md-75 text-center">
            <Col md={4} className="mb-4">
              <h3 className="fw-bold">¿Qué es?</h3>
              <p className="text-secondary">
                Un sistema para subir, almacenar y autenticar documentos digitales de forma segura y transparente.
              </p>
              <Button variant="primary" href="/subir">Subir Documento</Button>
            </Col>
            <Col md={4} className="mb-4">
              <h3 className="fw-bold">¿Cómo funciona?</h3>
              <p className="text-secondary">
                Utiliza tecnología blockchain para garantizar la integridad y autenticidad de los documentos.
              </p>
              <Button variant="primary" href="/mis_documentos">Mis Documentos</Button>
            </Col>
            <Col md={4} className="mb-4">
              <h3 className="fw-bold">¿Cómo buscar?</h3>
              <p className="text-secondary">
                Puedes buscar documentos por palabras clave o por el nombre del documento.
              </p>
              <Button variant="primary" href="/buscar">Buscar Documentos</Button>
            </Col>
          </Row>

        </section>

        {/* Statistics Section */}
        <section className="w-100 w-md-75">
          <TituloPagina titulo="Estadísticas" />
          <Row className="text-center mt-4">
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <Card.Text className="text-secondary fs-5 text-center">
                    <CountUp start={0} end={100} duration={2.75} separator="," enableScrollSpy={true} />
                    <span className="text-muted"> documentos han sido subidos al sistema.</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <Card.Text className="text-secondary fs-5 text-center">
                    <CountUp start={0} end={50} duration={2.75} separator="," enableScrollSpy={true} />
                    <span className="text-muted"> usuarios han utilizado el sistema.</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <Card.Text className="text-secondary fs-5 text-center">
                    <CountUp start={0} end={10} duration={2.75} separator="," enableScrollSpy={true} />
                    <span className="text-muted"> tipos de documentos han sido registrados.</span>
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
