// Componente de la sección principal de la aplicación

import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { ArrowDown } from 'react-bootstrap-icons';

import { obtenerDatos } from "../funciones";
import Tabla from "./_Tabla";


export default function Home() {
    // const [documento, setDocumento] = useState(null);
    const [bloques, setBloques] = useState([]);

    // funcion para setear el archivo al estar seleccionado
    // se usa el evento onChange del input file
    /*
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
    */

    useEffect(() => {
        (async () => {
            // Obtener los documentos al cargar la página
            const bloques = await obtenerDatos("http://localhost:5000/api/bloques")
            setBloques(bloques.slice(0, 10));
        }
        )();
    }, [])

    return (
        <>
            <Container className="text-center d-flex flex-column justify-content-center min-vh-100 gap-5">
                <Row className="justify-content-center h-100 mt-5">
                    <Col lg={6}>
                        {/* Ícono de blockchain */}
                        <Image
                            className="d-block mx-auto mb-4"
                            src="/blockchain-gif.gif"
                            alt=""
                            width="100%"
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

                        <Button
                            variant="dark"
                            className="mt-4"
                            onClick={() => {
                                window.scrollTo({
                                    top: window.innerHeight,
                                    behavior: 'smooth'
                                });
                            }}
                        >
                            <ArrowDown />
                        </Button>
                    </Col>
                </Row>

                <Row className="min-vh-100">
                    <Tabla registros={bloques} titulo="Últimos 10 bloques anexados a la blockchain" />
                </Row>
            </Container>
        </>
    );
}