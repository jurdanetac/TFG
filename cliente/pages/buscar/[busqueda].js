import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import DocumentoCard from "../componentes/_DocumentoCard";
import RutaProtegida from "../componentes/_RutaProtegida";
import TituloPagina from "../componentes/_TituloPagina";
import { AuthContexto } from "../contexto/_auth";

export default function Buscar() {
    // Obtener el token del contexto de autenticación
    const { token } = useContext(AuthContexto);

    // Obtener consulta de la URL
    const router = useRouter();
    // La consulta es la última parte de la URL, después del último '/'
    // Usamos un split para dividir la URL y obtener la última parte
    const busqueda = router.asPath.split('/').pop();
    const busquedaDecoded = busqueda ? decodeURIComponent(busqueda) : null;

    console.log("BUSCAR: Buscando documentos con consulta:", busqueda);

    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        if (busqueda && token) {
            fetch(process.env.URL_BACKEND + `/busqueda?consulta=${busquedaDecoded}`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
            })
                // Parsear la respuesta como JSON
                .then(async (response) => {
                    // Si la respuesta no es OK, setear resultados como un array vacío
                    // console.log("BUSCAR: Respuesta del servidor:", response);
                    if (!response.ok) {
                        console.error("BUSCAR: Error al buscar documentos:", response.statusText);
                        toast.error("Error al buscar documentos: " + response.statusText);
                        setResultados([]);
                        return;
                    }

                    // Extraer los datos de la respuesta en el formato que necesitamos
                    const data = await response.json();
                    // console.info("BUSCAR: Respuesta del servidor parseada:", data);
                    console.info(`BUSCAR: ${data.length} documentos encontrados`);

                    // Convertir los documentos a un formato con URL de base64 para poder visualizarlos
                    const conURL = data.map(doc => ({
                        ...doc,
                        url: `data:application/pdf;base64,${doc.contenido}`
                    }));

                    // Setear los resultados en el estado de resultados
                    setResultados(conURL);
                })
        }
    }, [router, busqueda, token]);

    return (
        <RutaProtegida>
            <TituloPagina titulo={`Resultados de la búsqueda: "${busquedaDecoded}"`} />

            {(resultados && resultados.length > 0) ? (
                <Row xs={1} md={3} className="g-4">
                    {resultados.map(doc => {
                        return (
                            <Col key={doc.id}>
                                <DocumentoCard doc={doc} />
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <div>
                    <h3
                        className="text-center mb-4 fw-bold "
                    >
                        No se encontraron documentos
                    </h3>
                    <hr className="mb-4" />
                </div>
            )}
        </RutaProtegida>
    );
}