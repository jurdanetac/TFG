import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';

// inicializar DataTable
DataTable.use(DT);

const TablaDocumentos = ({ documentos }) => {
    console.info("Documentos: ", documentos);
    return (
        <>
            <h2>Últimos documentos subidos</h2>
            <DataTable
                data={[
                    { id: 1, nombre: "Documento 1", fecha: "2023-01-01" },
                    { id: 2, nombre: "Documento 2", fecha: "2023-02-01" },
                    { id: 3, nombre: "Documento 3", fecha: "2023-03-01" },
                ]}
                columns={[
                    { title: "ID", data: "id" },
                    { title: "Nombre", data: "nombre" },
                    { title: "Fecha", data: "fecha" },
                ]}
                options={{
                    paging: true,
                    searching: true,
                    ordering: true,
                }}
            />
        </>
    );
};

export default TablaDocumentos;