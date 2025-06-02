import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import RutaProtegida from "./componentes/_RutaProtegida";
import { AuthContexto } from './contexto/_auth';


export default function Hero() {
  const [documento, setDocumento] = useState(null);
  const { token, usuario } = useContext(AuthContexto)

  // funcion para convertir archivo a base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  // funcion para setear el archivo al estar seleccionado
  // se usa el evento onChange del input file
  const cambiarArchivo = (e) => {
    const docInput = e.target.files[0];
    const docConURL = {
      name: docInput.name,
      type: docInput.type,
      size: docInput.size,
      url: URL.createObjectURL(docInput)
    };

    setDocumento(docConURL);
  }

  // funcion para subir el archivo en si y convertirlo a base64
  const manejarSubida = async () => {
    const documentoInput = document.getElementById("documentoInput");
    const documento = documentoInput.files[0];
    const extension = documento.name.split(".").pop(); // Obtener la extensión del archivo

    // convertir a base64
    const base64 = await toBase64(documento);

    const base64Data = base64.split(",")[1]; // Split the base64 string and get the data part
    await fetch("http://localhost:5000/api/documentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({
        documento_b64: base64Data,
        documento_extension: extension,
        tipo_de_documento_id: 1, // TODO: cambiar por el id del tipo de documento
        valores_attrib: {}, // TODO: cambiar por los valores del atributo
        usuario_id: usuario.id

        // parser.add_argument("documento_b64", type=str, required=True)
        // parser.add_argument("documento_extension", type=str, required=True)
        // parser.add_argument("tipo_de_documento_id", type=int, required=True)
        // parser.add_argument("valores_attrib", type=dict, required=True)
        // parser.add_argument("usuario_id", type=int, required=True)
      }),
    });
  };

  return (
    <RutaProtegida>
      <Container className="" style={{ minHeight: '100vh' }}>
        <h1
          className="text-center mb-4 fw-bold "
        >
          Subir un documento
        </h1>
        <hr className="mb-4" />

        {/* Input para subir el archivo */}
        <Form.Group className="mb-3">
          <Form.Control type="file" id="documentoInput" onChange={cambiarArchivo} accept="application/pdf" />
        </Form.Group>

        {/* Detalles del archivo */}
        {documento && (
          <>
            <div>
              <embed
                src={documento.url}
                width="250"
                height="200"></embed>
            </div>

            <div>
              <h5>Detalles del archivo seleccionado:</h5>
              <ul>
                <li><strong>Nombre:</strong> {documento.name}</li>
                <li><strong>Tipo:</strong> {documento.type}</li>
                <li><strong>Tamaño:</strong> {documento.size} bytes</li>
              </ul>
            </div>
          </>
        )}

        {/* Boton para subir el archivo */}
        {documento && (
          <Button
            onClick={manejarSubida}
            variant="primary"
          >
            Subir
          </Button>
        )}
      </Container>
    </RutaProtegida>
  );
};