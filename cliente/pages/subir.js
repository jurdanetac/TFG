import { useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import RutaProtegida from "./componentes/_RutaProtegida";


export default function Hero() {
  const [documento, setDocumento] = useState(null);

  // funcion para convertir archivo a base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  // funcion para setear el archivo al estar seleccionado
  // se usa el evento onChange del input file
  const handleFileChange = (e) => {
    if (e.target.files) {
      setDocumento(e.target.files[0]);
    }
  };

  // funcion para subir el archivo en si y convertirlo a base64
  const handleUpload = async () => {
    const documentoInput = document.getElementById("documentoInput");
    const documento = documentoInput.files[0];
    const extension = documento.name.split(".").pop(); // Obtener la extensión del archivo

    // convertir a base64
    const base64 = await toBase64(documento);
    console.log(base64);

    const base64Data = base64.split(",")[1]; // Split the base64 string and get the data part
    await fetch("http://localhost:5000/api/documentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documento_b64: base64Data,
        documento_extension: extension,
        tipo_de_documento_id: 1, // TODO: cambiar por el id del tipo de documento
        valores_attrib: {}, // TODO: cambiar por los valores del atributo
        usuario_id: 1 // TODO: cambiar por el id del usuario

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

              {/* Input para subir el archivo */}
              <Form.Group className="mb-3">
                <Form.Control type="file" id="documentoInput" onChange={handleFileChange} accept="application/pdf" />
              </Form.Group>

              {/* Detalles del archivo 
                        {documento && (
                            <div>
                                <h5>Detalles del archivo seleccionado:</h5>
                                <ul>
                                    <li><strong>Nombre:</strong> {documento.name}</li>
                                    <li><strong>Tipo:</strong> {documento.type}</li>
                                    <li><strong>Tamaño:</strong> {documento.size} bytes</li>
                                </ul>
                            </div>
                        )}*/}

              {/* Boton para subir el archivo */}
              {documento && (
                <Button
                  onClick={handleUpload}
                  variant="primary"
                >
                  Subir
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </RutaProtegida>
  );
}