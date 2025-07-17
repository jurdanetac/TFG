// Componente del encabezado de la aplicación
import { useRouter } from "next/router";
import { useContext } from "react";
import { Container, Dropdown, Form, FormControl, Image, Nav, Navbar } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";
import { AuthContexto } from "../contexto/_auth";

export default function Encabezado() {
    const { usuario, desloguear } = useContext(AuthContexto);

    const router = useRouter();

    // Función para manejar la búsqueda de documentos con 
    // la barra de búsqueda del encabezado
    const buscarDocumentos = (e) => {
        e.preventDefault();
        const busqueda = e.target.value.trim();

        if (busqueda === "") {
            // Si la búsqueda está vacía, no hacer nada
            return;
        }

        // Redirigir a la página de búsqueda con el término de búsqueda
        router.push(`/buscar/${encodeURIComponent(busqueda)}`);
    };

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
                            {usuario.admin ? 'Admin' : 'Usuario'} - {usuario.nombre}
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="navbar-nav" />
                        <Navbar.Collapse id="navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="/mis_documentos" className="link-body-emphasis">Mis documentos</Nav.Link>
                                <Nav.Link href="/subir" className="link-body-emphasis">Subir</Nav.Link>
                                <Nav.Link href="/estatus_cadena" className="link-body-emphasis">Estatus de la cadena</Nav.Link>
                            </Nav>
                            <Form className="d-flex" role="search">
                                <FormControl
                                    type="search"
                                    placeholder="Buscar documentos..."
                                    className="me-2"
                                    name="buscarDocumentosInput"
                                    onKeyDown={(e) => {
                                        // Buscar documentos al presionar Enter
                                        if (e.key === 'Enter') {
                                            buscarDocumentos(e);
                                        }
                                    }}
                                />
                            </Form>
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" className="d-block p-0">
                                    <PersonFill className="fs-2 text-secondary" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="/subir">Subir</Dropdown.Item>
                                    <Dropdown.Item href="/mis_documentos">Mis documentos</Dropdown.Item>
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