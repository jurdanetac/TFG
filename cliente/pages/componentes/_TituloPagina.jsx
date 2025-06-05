export default function TituloPagina({ titulo }) {
    return (
        <div>
            <h1
                className="text-center mb-4 fw-bold "
            >
                {titulo}
            </h1>
            <hr className="mb-4" />
        </div>
    )
};