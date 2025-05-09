import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';

// inicializar DataTable
DataTable.use(DT);

const Tabla = ({ registros = [], titulo = "Tabla" }) => {
    const columnas = registros[0] ? Object.keys(registros[0]).map((key) => {
        return {
            data: key,
            title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
        };
    }) : [];

    return (
        <>
            <h2 className="text-center fs-3 fs-md-1 fw-semibold text-dark mb-3">
                {titulo}
            </h2>

            {registros.length > 0 ? (
                <DataTable
                    data={registros}
                    columns={columnas}
                    options={{
                        paging: true,
                        searching: true,
                        ordering: true,
                        language
                    }}
                    className="table table-striped table-bordered table-hover"
                />
            ) : (
                <p className="text-center">No hay datos disponibles.</p>
            )}
        </>
    );
};

export default Tabla;