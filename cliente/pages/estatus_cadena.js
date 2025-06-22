import { useEffect, useState } from "react";
import Tabla from "./componentes/_Tabla";


export default function EstatusCadena() {
    const [estatus, setEstatus] = useState([])

    useEffect(() => {
        fetch(process.env.URL_BACKEND + "/estatus_cadena").then(async (response) => {
            const data = await response.json();
            setEstatus(data);
        });
    }, []);

    return (
        <div className="mt-5">
            <Tabla titulo="Estatus de la cadena" registros={estatus} slots={{
                // acomodar fecha
                0: (data, row) => (
                    <span className="text-capitalize">{new Date(data).toLocaleString("es-VE")}</span>
                ),
                4: (data, row) => (
                    // emoji check para indicar si el bloque está verificado o no
                    (data ? "✅": "❌")
                )
            }} />
        </div>
    )
}