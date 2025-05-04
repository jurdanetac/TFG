import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { PersonFill, KeyFill } from 'react-bootstrap-icons';
import toast from 'react-hot-toast';

function formLabelConIconCentrado(icono, texto) {
  return (
    <Form.Label>
      <div className="d-flex align-items-center">
        {icono} <strong className='ms-2'>{texto}</strong>
      </div>
    </Form.Label>
  );
};

const LoginForm = ({ props }) => {
  const { setToken, setUsuarioLoggeado } = props;

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarSubida = async (e) => {
    // e.preventDefault() es necesario para evitar que la página se recargue al enviar el formulario
    e.preventDefault();
    setCargando(true);

    const cuerpo = { usuario, contrasena };

    // Aquí normalmente harías una llamada a la API de tu servicio de autenticación
    console.log('Intento de inicio de sesión con:', cuerpo);

    // Lógica de petición a la API de Flask
    const apiResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cuerpo),
    });

    const status = apiResponse.status;
    const data = await apiResponse.json();
    console.log('Respuesta de la API:', data);

    if (status === 200) {
      // console.log('Respuesta de la API:', data);
      // Si la respuesta es exitosa, redirigir o mostrar un mensaje de éxito
      toast.success('Inicio de sesión exitoso!');

      setToken(data.token); // Guarda el token en el estado
      setUsuarioLoggeado(true); // Cambia el estado de usuario logueado a verdadero
    } else if (status === 401) {

      // Si las credenciales son incorrectas, mostrar un mensaje de error
      toast.error('Usuario o contraseña incorrectos. Por favor, intenta de nuevo.');
    }

    setCargando(false);
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

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={cargando}
            >
              {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Form>

          {/* 
          <div className="text-center mt-3">
            <a href="#forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
          */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;