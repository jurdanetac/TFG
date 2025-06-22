import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Form, Nav } from 'react-bootstrap';
import { KeyFill, PersonFill } from 'react-bootstrap-icons';
import { toast } from "react-hot-toast";
import { AuthContexto } from './contexto/_auth';

// Componente para crear un label con un icono centrado y texto
const formLabelConIconCentrado = (icono, texto) => {
    return (
        <Form.Label>
            <div className="d-flex align-items-center">
                {icono} <strong className='ms-2'>{texto}</strong>
            </div>
        </Form.Label>
    );
};

// Componente principal de la página de inicio de sesión
export default function Login() {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

    const { login, cargando } = useContext(AuthContexto);

    const router = useRouter();

    // función para manejar el envío del formulario de inicio de sesión
    const manejarSubida = async (e) => {
        e.preventDefault();
        const resultadoLogin = await login(usuario, contrasena);
        console.info("Login: Resultado del login:", resultadoLogin);
        if (resultadoLogin) {
            toast.success("Sesión iniciada correctamente");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow">
                <Card.Body>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>

                    <Form onSubmit={manejarSubida}>
                        <Form.Group>

                            {formLabelConIconCentrado(<PersonFill />, 'Usuario')}

                            <Form.Control
                                type="text"
                                placeholder="Introduce tu usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">

                            {formLabelConIconCentrado(<KeyFill />, 'Contraseña')}

                            <Form.Control
                                type="password"
                                placeholder="Introduce tu contraseña"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Enlace para redirigir al registro si el usuario no tiene cuenta */} 
                        <Nav.Link href="/registro" className="text-center">
                            ¿No tienes cuenta? Regístrate aquí </Nav.Link>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mt-3"
                            disabled={cargando}
                        >
                            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
} 