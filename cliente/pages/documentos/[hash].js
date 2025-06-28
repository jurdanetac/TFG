import { useRouter } from "next/router";
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import DocumentoCard from "../componentes/_DocumentoCard";
import TituloPagina from "../componentes/_TituloPagina";

export default function Documento() {
    const router = useRouter();
    const { hash } = router.query;
    const [documento, setDocumento] = useState(null);
    const [respuestaIA, setRespuestaIA] = useState(null);
    const [input, setInput] = useState('');

    const urlQR = `${process.env.URL_FRONTEND}/documentos/${hash}`;
    const urlBackend = `${process.env.URL_BACKEND}/consulta_documento/${hash}`;

    // Buscar el documento por hash
    useEffect(() => {
        if (hash) {
            fetch(urlBackend, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(async (response) => {
                if (!response.ok) {
                    console.error("BUSCAR: Error al buscar documento:", response.statusText);
                    toast.error("Error al buscar documento: " + response.statusText);
                    setDocumento(null);
                    return;
                }

                // Extraer los datos de la respuesta en el formato que necesitamos
                const data = await response.json();
                // console.log(Object.keys(data));
                setDocumento({
                    ...data,
                    url: `data:application/pdf;base64,${data.contenido}`
                });

            });
        }
    }, [hash]);

    // FUNCION QUE RECIBE EL VALOR DEL INPUT Y CONSULTA EN EL SERVIDOR
    // LA PETICION QUE SE HA REALIZADO
    const consultaIA = async () => {
        //ESTA ES UNA KEY DE GEMINI
        const key = 'AIzaSyCzwYrgV0879UeOdFwcGEqM_4VV8c-EZa4'

        //AQUI HAGO LAS CONFIGURACIONES DEL API
        const configuracionPeticion = {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },

            // PETICION QUE SE REALIZA A LA API DE GEMINI
            body: JSON.stringify({
                model: "gemini-2.0-flash",
                messages: [
                    {
                        role: "system",
                        content: `Eres un asistente. Basarás tus respuestas
                        únicamente en el siguiente texto. 
                        No debes inventar información. Responde únicamente
                        con base en el contenido proporcionado. 
                        si no entiendes la consulta, di formule
                        de otra forma la pregunta.
                        Nunca digas la dirección de donde se encuentra el texto
                        cambia eso por "Documento". Texto: 
                        ${documento.texto_ocr}`
                    },
                    {
                        role: "user",
                        content: `${input}`
                    }
                ]
            })
        }

        // HAGO EL LLAMADO A LA API
        await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, configuracionPeticion)
            .then(res => res.json())
            .then(data => {
                const respuesta = data.choices[0].message.content
                setRespuestaIA(respuesta)
            })
    }

    return (
        <>
            {documento ? (
                <Container className="p-4 bg-white rounded shadow-sm">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                        <TituloPagina titulo="Comparte este documento" />
                        <p className="text-secondary">Escanea el código QR o copia el enlace para compartir este documento.</p>
                        <a href={urlQR} target="_blank" rel="noopener noreferrer" className="text-primary mb-2">({documento.tipo_de_documento}) - {documento.nombre}</a>

                        <QRCodeSVG value={urlQR} size={256} className="my-4" imageSettings={{
                            src: '/blockchain-icon.svg', // Ruta de la imagen del logo
                            height: 60, // Altura de la imagen del logo
                            width: 60, // Ancho de la imagen del logo
                            excavate: true, // Excavación para que el logo no cubra el código QR
                        }} />
                    </div>


                    <Row className="mb-4">
                        <Col className="d-flex justify-content-center">
                            <DocumentoCard doc={documento} />
                        </Col>
                    </Row>

                    <hr className="my-4" />

                    <div className="mt-4">
                        {/* Input para la consulta a la IA */}
                        <h5 className="text-center">Realiza consultas sobre el documento a la inteligencia artificial</h5>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Escribe tu consulta aquí..."
                                id='inputIA'
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                                onKeyDown={(e) => {
                                    setInput(e.target.value);

                                    if (e.key === "Enter") {
                                        consultaIA();
                                    }
                                }}

                            />

                            {/* Botón para enviar la consulta a la IA */}
                            <Button onClick={consultaIA}>
                                Enviar
                            </Button>
                        </div>

                        <div className="d-flex flex-column align-items-center justify-content-center mt-4">
                            <h5>Respuesta</h5>
                            <div style={{ height: '300px', width: '100%' }} className="border border-secondary rounded p-3 overflow-auto">
                                {respuestaIA && <p>- {respuestaIA}</p>}
                            </div>
                        </div>
                    </div>
                </Container >
            ) : (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                    <h1 className="text-6xl font-bold text-gray-800">404</h1>
                    <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
                    <a href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Volver al inicio
                    </a>
                </div>
            )
            }
        </>
    );
}