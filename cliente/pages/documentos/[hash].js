import { useRouter } from "next/router";
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { URL_BACKEND, URL_FRONTEND } from "../_const";
import DocumentoCard from "../componentes/_DocumentoCard";
import TituloPagina from "../componentes/_TituloPagina";

export default function Documento() {
    const router = useRouter();
    const { hash } = router.query;
    const [documento, setDocumento] = useState(null);

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
                setDocumento({
                    ...data,
                    url: `data:application/pdf;base64,${data.contenido}`
                });

            });
        }
    }, [hash]);

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
                </div>
            ) : (<>
                <p>404</p>
            </>)}
        </>
    );
}