import { Button, Card, ListGroup } from 'react-bootstrap';
import { CalendarPlus, JournalRichtext, KeyFill } from 'react-bootstrap-icons';

const DocumentoCard = ({ doc }) => {
    const fecha = new Date(doc.creado_en);
    const nombreDocumento = doc.nombre
    const nombreTipoDoc = doc.tipo_de_documento
    const palabras_clave = doc.palabras_clave ? doc.palabras_clave.join(', ') : 'No hay palabras clave';

    const atributos = Object.entries(doc.valores_attrib).map(([nombre, valor]) => ({ nombre, valor }));
    const cantidadDeAtributos = Object.keys(atributos).length;

    return (
        <Card className="shadow w-100 h-100">
            <iframe
                src={doc.url}
                style={{ width: '100%', height: '300px' }}
            ></iframe>

            <Card.Body style={{ padding: '15px' }}>
                <Card.Title>{nombreDocumento}</Card.Title>
                <Card.Text className="fst-italic">{nombreTipoDoc}</Card.Text>
            </Card.Body>

            <ListGroup className="list-group-flush">
                <ListGroup.Item>
                    <div className="d-flex align-items-center">
                        <CalendarPlus className="me-2" /> {fecha.toLocaleDateString()} {fecha.toLocaleTimeString()}
                    </div>
                </ListGroup.Item>

                <ListGroup.Item>
                    <div className="d-flex align-items-center">
                        <KeyFill className="me-2" style={{ transform: 'rotate(45deg)' }}
                        />
                        {palabras_clave}
                    </div>
                </ListGroup.Item>

                <ListGroup.Item>
                    <JournalRichtext className="me-2" />
                    {cantidadDeAtributos > 0 ?
                        atributos.map((attr, index) => (
                            <span key={index} className="badge bg-secondary me-1">
                                {attr.nombre}: {attr.valor}
                            </span>
                        )) :
                        'No hay atributos asociados'
                    }
                </ListGroup.Item>
            </ListGroup>

            <Card.Footer className="d-grid gap-2" style={{ padding: '15px' }}>
                <Button variant="primary" onClick={() => {
                    const link = document.createElement('a');
                    link.href = doc.url;
                    console.log("Descargando documento:", nombreDocumento);
                    link.download = `${nombreDocumento}.pdf`; // Append extension to file name
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }}>
                    Descargar
                </Button>
            </Card.Footer>
        </Card>
    );
}

export default DocumentoCard;