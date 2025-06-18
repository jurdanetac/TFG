import { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
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

// Componente principal de la página de registro de usuario
export default function Registro() {
    const [nombre, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');

    const { usuario: usuarioLogueado, cargando, registro } = useContext(AuthContexto);

    useEffect(() => {
        if (usuarioLogueado) {
            console.info("REGISTRO: Usuario ya está logueado, redirigiendo a la página principal.");
        }
        else {
            console.info("REGISTRO: Usuario no está logueado, mostrando formulario de registro.");
        }
    }, [usuarioLogueado]);

    // función para manejar el envío del formulario de inicio de sesión
    const manejarRegistro = async (e) => {
        e.preventDefault();
        const resultadoRegistro = await registro(nombre, usuario, contrasena);
        if (resultadoRegistro) {
            toast.success("REGISTRO: Registro exitoso, por favor inicia sesión");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow">
                <Card.Body>
                    <h2 className="text-center mb-4">Registro de usuario</h2>

                    <Form onSubmit={manejarRegistro}>
                        <Form.Group>

                            {formLabelConIconCentrado(<PersonFill />, 'Nombre')}

                            <Form.Control
                                type="text"
                                placeholder="Introduce tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </Form.Group>

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

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mt-3"
                            disabled={cargando}
                        >
                            {cargando ? 'Procesando...' : 'Registrarse'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
} 