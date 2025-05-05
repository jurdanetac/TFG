import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';

// inicializar DataTable
DataTable.use(DT);

const TablaDocumentos = ({ documentos, columnas }) => {
    console.log(language)
    console.info("Documentos: ", documentos);
    console.info("Columnas: ", columnas);

    return (
        <>
            <h2 className="text-center fs-3 fs-md-1 fw-semibold text-dark mb-3">
                Últimos documentos subidos
            </h2>
            <DataTable
                data={documentos}
                columns={columnas.map((columna) => ({
                    data: columna.data,
                    title: columna.title,
                }))}
                options={{
                    paging: true,
                    searching: true,
                    ordering: true,
                    language
                }}
            />
        </>
    );
};

export default TablaDocumentos;