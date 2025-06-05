import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DocumentoCard from "./componentes/_DocumentoCard";
import RutaProtegida from "./componentes/_RutaProtegida";
import TituloPagina from "./componentes/_TituloPagina";
import { URL_BACKEND } from "./const";
import { AuthContexto } from "./contexto/_auth";

export default function Buscar() {
    // Obtener el token del contexto de autenticación
    const { token } = useContext(AuthContexto);

    // Obtener consulta de la URL
    const router = useRouter();
    const { query } = router;
    const busqueda = query.consulta || "";

    console.log("BUSCAR: Buscando documentos con consulta:", busqueda);

    const [resultados, setResultados] = useState([]);

    useEffect(() => {
        fetch(URL_BACKEND + `/documentos?consulta=${encodeURIComponent(busqueda)}`, {
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
    }, [busqueda]);

    return (
        <RutaProtegida>
            {resultados.length > 0 ? (
                <div>

                    <TituloPagina titulo={
                        `${resultados.length} Resultado(s) de la búsqueda para: "${busqueda}"`
                    } />

                    <ul className="list-unstyled">
                        {resultados.map((doc, index) => (
                            <li key={index} className="mb-3">
                                <DocumentoCard doc={doc} />
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <TituloPagina titulo={`No se encontraron resultados para: "${busqueda}"`} />
            )}
        </RutaProtegida>
    );
}