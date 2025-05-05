import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';

// inicializar DataTable
DataTable.use(DT);

const TablaDocumentos = ({ documentos = [] }) => {
    const columnas = documentos[0] ? Object.keys(documentos[0]).map((key) => {
        return {
            data: key,
            title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
        };
    }) : [];

    console.log(columnas);


    return (
        <>
            <h2 className="text-center fs-3 fs-md-1 fw-semibold text-dark mb-3">
                Últimos documentos subidos
            </h2>

            {documentos.length > 0 ? (
                <DataTable
                    data={documentos}
                    columns={columnas}
                    options={{
                        paging: true,
                        searching: true,
                        ordering: true,
                        language
                    }}
                />
            ) : (
                <p className="text-center">No hay datos disponibles.</p>
            )}
        </>
    );
};

export default TablaDocumentos;