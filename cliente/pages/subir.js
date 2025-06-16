import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import RutaProtegida from "./componentes/_RutaProtegida";
import TituloPagina from "./componentes/_TituloPagina";
import { AuthContexto } from './contexto/_auth';
import { URL_BACKEND } from "./_const";


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

    const cuerpoDocumento = {
      documento_b64: base64Data,
      documento_extension: extension,
      tipo_de_documento_id: 1, // TODO: cambiar por el id del tipo de documento
      valores_attrib: {}, // TODO: cambiar por los valores del atributo
      usuario_id: usuario.id
    };

    console.info("SUBIR: Subiendo documento:", cuerpoDocumento);
    try {
      // Hacer la petición al servidor para subir el documento
      fetch(URL_BACKEND + "/documentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(cuerpoDocumento)
      }).then((response) => {
        //  Verificar si la respuesta es exitosa
        if (response.ok) {
          console.info("SUBIR: Documento subido exitosamente");
          toast.success("Documento subido exitosamente");
          setDocumento(null);
          documentoInput.value = ""; // Limpiar el input
        } else {
          console.error("SUBIR: Error al subir el documento:", response.statusText);
          toast.error("Error al subir el documento: " + response.statusText);
        }
      })
    } catch (error) {
      console.error("SUBIR: Error al subir el documento:", error);
      toast.error("Error al subir el documento. Por favor, inténtalo de nuevo.");
      return;
    }
  };

  return (
    <RutaProtegida>
      <Container className="" style={{ minHeight: '100vh' }}>
        <TituloPagina titulo={"Subir Documento"} />

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