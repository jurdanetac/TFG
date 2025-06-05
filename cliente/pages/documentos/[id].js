import { useRouter } from "next/router";
import { QRCodeSVG } from 'qrcode.react';
import { URL_BACKEND, URL_FRONTEND } from "../const";
import TituloPagina from "../componentes/_TituloPagina";

export default function Documento() {
    const router = useRouter();
    const { id } = router.query;

    const url = `${URL_FRONTEND}/documentos/${id}`;

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh' }}>
            <TituloPagina titulo="Comparte este documento" />
            <QRCodeSVG value={url} size={256} className="mb-4" />
            <h1 className="text-center">Página de Documento</h1>
            <p className="text-secondary">Aquí puedes ver los detalles del documento seleccionado.</p>
            <p>{id}</p>
        </div>
    );
}