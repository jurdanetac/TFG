// Componente de la sección principal de la aplicación

import { Button, Col, Container, Form, Image, Row, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

import TablaDocumentos from "./_TablaDocumentos";


export default function Hero() {
    const [documento, setDocumento] = useState(null);
    const [documentos, setDocumentos] = useState([]);

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

        // console.info("Base64: ", base64);

        const base64Data = base64.split(",")[1]; // Split the base64 string and get the data part

        // Subir el archivo a la API
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
            // Comprobar si la respuesta es correcta
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

    const obtenerDocumentos = async () => {
        // Obtener los documentos de la API
        return await fetch("http://localhost:5000/api/documentos")
            // Parsear la respuesta como JSON
            .then((response) => response.json())
            // Extraer los datos de la respuesta
            .then((data) => {
                return data;
            });
    };

    useEffect(() => {
        (async () => {
            // Obtener los documentos al cargar la página
            const documentos = await obtenerDocumentos()
            setDocumentos(documentos);
            // console.info("Documentos: ", documentos);
        }
        )();
    }, [])

    return (
        <Container className="px-4 py-5 my-5 text-center">
            <Row className="justify-content-center mb-5">
                <Col lg={6}>
                    {/* Ícono de blockchain */}
                    <Image
                        className="d-block mx-auto mb-4"
                        src="/blockchain-icon.svg"
                        alt=""
                        width="72"
                        height="72"
                    />

                    {/* Título y subtítulo */}
                    <div>
                        <h1 className="text-center fs-2 fs-md-1 fw-semibold text-dark mb-3">
                            Sistema de distribución y autenticación de documentos digitales basado en blockchain
                        </h1>
                        <hr className="my-1" />
                        <small className="d-block mt-2 text-secondary fs-5 fs-md-4 fw-normal">
                            Trabajo Final de Grado<br />Universidad Dr. Rafael Belloso Chacín
                        </small>
                    </div>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col>
                    <TablaDocumentos documentos={documentos} />
                </Col>
            </Row>
        </Container>
    );
}
