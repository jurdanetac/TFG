// Componente de la sección principal de la aplicación

import { useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";

import TablaDocumentos from "./_TablaDocumentos";


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
        console.info(`Archivo seleccionado: ${e.target.files[0].name}`);

        if (e.target.files) {
            setDocumento(e.target.files[0]);
        }
    };

    // funcion para subir el archivo en si y convertirlo a base64
    const handleUpload = async () => {
        console.info("Subiendo archivo");

        const documentoInput = document.getElementById("documentoInput");
        const documento = documentoInput.files[0];
        const extension = documento.name.split(".").pop(); // Obtener la extensión del archivo

        // convertir a base64
        const base64 = await toBase64(documento);

        console.info("Base64: ", base64);

        const base64Data = base64.split(",")[1]; // Split the base64 string and get the data part

        await fetch("http://localhost:5000/api/documentos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                documento_b64: base64Data,
                documento_extension: extension
            }),
        }).then((response) => {
            if (response.ok) {
                console.info("Archivo subido correctamente");
                alert("Archivo subido correctamente");
            } else {
                console.error("Error al subir el archivo");
                alert("Error al subir el archivo");
            }
        }).catch((error) => {
            console.error("Error al subir el archivo", error);
            alert("Error al subir el archivo");
        });
    };

    return (
        <Container className="px-4 py-5 my-5 text-center">
            <Image
                className="d-block mx-auto mb-4"
                src="/bootstrap-logo.svg"
                alt=""
                width="72"
                height="57"
            />


            <Row className="justify-content-center">
                <Col lg={6}>
                    <h1 className="text-center fs-2 fs-md-1 fw-semibold text-dark mb-3">
                        Sistema de distribución y autenticación de documentos digitales basado en blockchain
                        <small className="d-block mt-2 text-secondary fs-5 fs-md-4 fw-normal">
                            Trabajo Final de Grado<br />Universidad Dr. Rafael Belloso Chacín
                        </small>
                    </h1>

                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">

                        {/* Input para subir el archivo */}
                        {/* 
                        <Form.Group className="mb-3">
                            <Form.Control type="file" id="documentoInput" onChange={handleFileChange} />
                        </Form.Group>
                        */}

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

            <Row className="justify-content-center mt-5">
                <Col>
                    <TablaDocumentos documentos={[]} />
                </Col>
            </Row>
        </Container>
    );
}