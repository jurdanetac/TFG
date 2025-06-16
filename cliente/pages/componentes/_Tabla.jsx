import DT from 'datatables.net-bs5';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';
import DataTable from 'datatables.net-react';
import 'datatables.net-responsive-dt';
import 'datatables.net-select-dt';

// inicializar DataTable
DataTable.use(DT);

const Tabla = ({ registros = [], titulo = "Tabla", slots = null }) => {
    const columnas = registros[0] ? Object.keys(registros[0]).map((key) => {
        return {
            data: key,
            title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
        };
    }) : [];

    return (
        <div className="table-responsive">
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
                        responsive: true,
                        language
                    }}
                    className="table table-striped table-bordered table-hover"
                    // Esto es para permitir el uso de slots personalizados
                    // es decir, para poder renderizar contenido personalizado en las celdas
                    slots={slots ? Object.entries(slots).reduce((acc, [key, slot]) => {
                        acc[key] = (data, row) => slot(data, row);
                        return acc;
                    }, {}) : {}}
                />
            ) : (
                <p className="text-center">No hay datos disponibles.</p>
            )}
        </div>
    );
};

export default Tabla;