import { useRouter } from "next/router";
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { URL_BACKEND, URL_FRONTEND } from "../_const";
import DocumentoCard from "../componentes/_DocumentoCard";
import TituloPagina from "../componentes/_TituloPagina";

export default function Documento() {
    const router = useRouter();
    const { hash } = router.query;
    const [documento, setDocumento] = useState(null);
    const [respuestaIA, setRespuestaIA] = useState(null);
    const [input, setInput] = useState('');

    const urlQR = `${URL_FRONTEND}/documentos/${hash}`;
    const urlBackend = `${URL_BACKEND}/consulta_documento/${hash}`;

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
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
                    <TituloPagina titulo="Comparte este documento" />
                    <QRCodeSVG value={urlQR} size={256} className="mb-4" />
                    <h1 className="text-center">Página de Documento</h1>
                    <p className="text-secondary">Aquí puedes ver los detalles del documento seleccionado.</p>
                    <p>{hash}</p>
                    <DocumentoCard doc={documento} />

                    <div>
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center mt-4">
                            <h2>Respuesta</h2>
                            {respuestaIA && <p>{respuestaIA}</p>}
                        </div>

                        {/* Input para la consulta a la IA */}
                        <h5>Consulta a la IA</h5>
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
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                    <h1 className="text-6xl font-bold text-gray-800">404</h1>
                    <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
                    <a href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Volver al inicio
                    </a>
                </div>
            )}
        </>
    );
}