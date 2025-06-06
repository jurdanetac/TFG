// Componente del encabezado de la aplicación
import { useContext, useEffect, useState } from "react";
import { Container, Dropdown, Form, FormControl, Image, Nav, Navbar } from "react-bootstrap";
import { AuthContexto } from "../contexto/_auth";

export default function Encabezado() {
    const { usuario, desloguear } = useContext(AuthContexto);

    return (
        <>
            {usuario && (
                <Navbar bg="light" expand="lg" className="mb-4">
                    <Container>
                        <Navbar.Brand href="/">
                            <Image
                                src="/blockchain-icon.svg"
                                alt="logo"
                                width="72"
                                height="40"
                                className="d-inline-block align-top me-2"
                            />
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <Navbar.Collapse id="navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/mis_documentos" className="link-body-emphasis">Mis documentos</Nav.Link>
                                <Nav.Link href="/subir" className="link-body-emphasis">Subir</Nav.Link>
                            </Nav>
                            <Form className="d-flex" role="search">
                                <FormControl
                                    type="search"
                                    placeholder="Búsqueda..."
                                    className="me-2"
                                    aria-label="Search"
                                />
                            </Form>
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" className="d-block p-0">
                                    <Image
                                        src="https://github.com/jurdanetac.png"
                                        alt="mdo"
                                        width="32"
                                        height="32"
                                        roundedCircle
                                    />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#">Nuevo documento</Dropdown.Item>
                                    <Dropdown.Item href="#">Mis documentos</Dropdown.Item>
                                    <Dropdown.Item href="#">Perfil</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={desloguear}>Cerrar sesión</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}
        </>
    )
};