import { Container, Row, Col, Button, Image } from "react-bootstrap";

export default function Hero() {
    return (
        <Container className="px-4 py-5 my-5 text-center">
            <Image
                className="d-block mx-auto mb-4"
                src="/bootstrap-logo.svg"
                alt=""
                width="72"
                height="57"
            />
            <h1 className="display-5 fw-bold text-body-emphasis">Centered hero</h1>
            <Row className="justify-content-center">
                <Col lg={6}>
                    <p className="lead mb-4">
                        Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most
                        popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid
                        system, extensive prebuilt components, and powerful JavaScript plugins.
                    </p>
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                        <Button variant="primary" size="lg" className="px-4 gap-3">
                            Primary button
                        </Button>
                        <Button variant="outline-secondary" size="lg" className="px-4">
                            Secondary
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}