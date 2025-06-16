import { useRouter } from "next/router";
import { QRCodeSVG } from 'qrcode.react';
import { useContext, useEffect } from "react";
import { URL_BACKEND, URL_FRONTEND } from "../_const";
import TituloPagina from "../componentes/_TituloPagina";
import { AuthContexto } from "../contexto/_auth";

export default function Documento() {
    const router = useRouter();
    const { hash } = router.query;
    const { token } = useContext(AuthContexto);

    const urlQR = `${URL_FRONTEND}/documentos/${hash}`;
    const urlBackend = `${URL_BACKEND}/consulta_documento/${hash}`;

    // buscar el documento por hash
    useEffect(() => {
        fetch(urlBackend, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }, [hash]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
            <TituloPagina titulo="Comparte este documento" />
            <QRCodeSVG value={urlQR} size={256} className="mb-4" />
            <h1 className="text-center">Página de Documento</h1>
            <p className="text-secondary">Aquí puedes ver los detalles del documento seleccionado.</p>
            <p>{hash}</p>
        </div>
    );
}