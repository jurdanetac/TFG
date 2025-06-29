import { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import RutaProtegida from "./componentes/_RutaProtegida";
import TituloPagina from "./componentes/_TituloPagina";
import { AuthContexto } from './contexto/_auth';

/**
 * Verifica si una cadena tiene el formato típico de un hash SHA-256.
 * Esto NO comprueba si es el hash *correcto* de algún dato,
 * solo si su estructura es válida para un hash SHA-256.
 *
 * Un hash SHA-256 siempre tiene 64 caracteres hexadecimales de longitud.
 *
 * @param {string} hashString La cadena a verificar.
 * @returns {boolean} Verdadero si la cadena parece un hash SHA-256 válido, falso en caso contrario.
 */
function esFormatoSha256Valido(hashString) {
  if (typeof hashString !== 'string') {
    return false;
  }

  // Un hash SHA-256 siempre tiene 64 caracteres de longitud.
  console.log(hashString.length)
  if (hashString.length !== 64) {
    return false;
  }

  // Verifica si la cadena contiene solo caracteres hexadecimales (0-9, a-f, A-F).
  const hexRegex = /^[0-9a-fA-F]{64}$/;
  return hexRegex.test(hashString);
}


export default function Hero() {
  const [documento, setDocumento] = useState(null);
  const [tiposDeDocumento, setTiposDeDocumento] = useState([]);
  const [tipoDeDocumentoSeleccionado, setTipoDeDocumentoSeleccionado] = useState(1);
  const [nombreDocumento, setNombreDocumento] = useState("");
  const [hashDocumento, setHashDocumento] = useState("");
  const { token, usuario } = useContext(AuthContexto)

  // estados para la creación de tipos de documento
  const [tipoDeDocumento, setTipoDeDocumento] = useState(null);
  const [atributos, setAtributos] = useState([{
    nombre: "",
    tipoDato: "",
    requerido: false
  }]);

  useEffect(() => {
    if (token) {
      fetch(process.env.URL_BACKEND + `/tipos_docs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

        // Parsear la respuesta como JSON
        .then((response) => {
          console.log("SUBIR: Obteniendo tipos de documento...");
          return response.json()
        }).then((data) => {
          console.info("SUBIR: Tipos de documento obtenidos:", data);
          setTiposDeDocumento(data);
        });
    }
  }, [token]);

  // funcion para convertir archivo a base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  // funcion para setear el archivo al estar seleccionado
  // se usa el evento onChange del input file
  const cambiarArchivo = (e) => {
    const docInput = e.target.files[0];
    const docConURL = {
      name: docInput.name,
      type: docInput.type,
      size: docInput.size,
      url: URL.createObjectURL(docInput)
    };

    setDocumento(docConURL);
  }

  // funcion para subir el archivo en si y convertirlo a base64
  const manejarSubida = async () => {
    const documentoInput = document.getElementById("documentoInput");
    const documento = documentoInput.files[0];
    const extension = documento.name.split(".").pop(); // Obtener la extensión del archivo

    // convertir a base64
    const base64 = await toBase64(documento);

    const base64Data = base64.split(",")[1]; // Split the base64 string and get the data part

    if (hashDocumento && !esFormatoSha256Valido(hashDocumento)) {
      console.error("SUBIR: El hash del antecesor no es válido. Debe ser un hash SHA-256 de 64 caracteres hexadecimales.");
      toast.error("El hash del antecesor no es válido. Debe ser un hash SHA-256 de 64 caracteres hexadecimales.");
      return;
    }

    const cuerpoDocumento = {
      documento_b64: base64Data,
      documento_extension: extension,
      tipo_de_documento_id: tipoDeDocumentoSeleccionado,
      valores_attrib: {}, // TODO: cambiar por los valores del atributo
      usuario_id: usuario.id,
      nombre: nombreDocumento,
      hash_antecesor: hashDocumento
    };

    console.info("SUBIR: Subiendo documento:", cuerpoDocumento);
    // Hacer la petición al servidor para subir el documento
    fetch(process.env.URL_BACKEND + "/documentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(cuerpoDocumento)
    }).then((response) => {
      return response.json();
    }).then((data) => {
      //  Verificar si la respuesta es exitosa
      if (data["estatus"] >= 200 && data["estatus"] < 300) {
        // Si la respuesta es exitosa, mostrar un mensaje de éxito
        console.info("SUBIR: Documento subido exitosamente");
        toast.success("Documento subido exitosamente");

        setDocumento(null);
        // Limpiar el nombre del documento
        setNombreDocumento("");
        // Resetear el tipo de documento al primero
        setTipoDeDocumentoSeleccionado(1);
        // Limpiar el input
        documentoInput.value = "";
      } else {
        const errorMessage = data["error"] || "Error al subir el documento. Por favor, inténtalo de nuevo.";
        console.error("SUBIR: Error al subir el documento:", errorMessage);
        toast.error("Error al subir el documento: " + errorMessage);
        return;
      }
    });
  };

  return (
    <RutaProtegida>
      <Container className="" style={{ minHeight: '100vh' }}>
        <TituloPagina titulo={"Subir Documento"} />

        {/* Input para subir el archivo */}
        <Form.Group className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Form.Label>Tipo de documento</Form.Label>
              <Form.Select onChange={(e) => setTipoDeDocumentoSeleccionado(e.target.value)} value={tipoDeDocumentoSeleccionado}>
                {/* Mapeo de los tipos de documento para el select */}
                {tiposDeDocumento.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="flex-grow-1 mx-3">
              <Form.Label>Antecesor en la cadena documental (opcional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
                value={hashDocumento}
                onChange={(e) => setHashDocumento(e.target.value)}
              />
            </div>


            <div>
              <Form.Label>Nombre del documento a registrar</Form.Label>
              <Form.Control
                type="text"
                placeholder="Documento de prueba"
                value={nombreDocumento}
                onChange={(e) => setNombreDocumento(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Form.Label>Selecciona un documento para subir</Form.Label>
            <Form.Control type="file" id="documentoInput" onChange={cambiarArchivo} accept="application/pdf" />
            <Form.Text className="text-muted" style={{ cursor: 'help' }}>
              Sólo se permiten archivos PDF.
            </Form.Text>
          </div>
        </Form.Group>

        {/* Detalles del archivo */}
        {documento && (
          <>
            <div>
              <embed
                src={documento.url}
                width="250"
                height="200"></embed>
            </div>

            <div>
              <h5>Detalles del archivo seleccionado:</h5>
              <ul>
                <li><strong>Nombre:</strong> {documento.name}</li>
                <li><strong>Tipo:</strong> {documento.type}</li>
                <li><strong>Tamaño:</strong> {documento.size} bytes</li>
              </ul>
            </div>
          </>
        )}

        {/* Boton para subir el archivo */}
        {documento && (
          <Button
            onClick={manejarSubida}
            variant="primary"
          >
            Subir
          </Button>
        )}

        {/* Separador */}
        <hr className="my-4" />

        <div>
          <h4
            className="text-center fw-bold "
          >
            Crear Tipo de Documento
          </h4>
          <hr className="mb-4" />
          <p>Un tipo de documento es una categoría que se le asigna a un documento. Esto le permite al sistema clasificar y organizar los documentos de manera más eficiente.</p>

          <div>
            <Form.Label>Nombre del tipo de documento a registrar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Tipo de Documento"
              value={tipoDeDocumento}
              onChange={(e) => setTipoDeDocumento(e.target.value)}
            />
          </div>

          <hr className="my-4" />

          {/* Atributos */}
          <div>
            {atributos.map((atributo, index) => (
              <div key={index} className="mb-3 d-flex align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Nombre del atributo"
                  value={atributo.nombre}
                  onChange={(e) => {
                    const nuevosAtributos = [...atributos];
                    nuevosAtributos[index].nombre = e.target.value;
                    setAtributos(nuevosAtributos);
                  }}
                />
                <Form.Select
                  className="mx-2"
                  value={atributo.tipoDato}
                  onChange={(e) => {
                    const nuevosAtributos = [...atributos];
                    nuevosAtributos[index].tipoDato = e.target.value;
                    setAtributos(nuevosAtributos);
                  }}
                >
                  <option value="">Seleccione un tipo de dato</option>
                  <option value="texto">Texto</option>
                  <option value="numero">Número</option>
                  <option value="fecha">Fecha</option>
                </Form.Select>
                <Form.Check
                  type="checkbox"
                  label="Requerido"
                  checked={atributo.requerido}
                  onChange={(e) => {
                    const nuevosAtributos = [...atributos];
                    nuevosAtributos[index].requerido = e.target.checked;
                    setAtributos(nuevosAtributos);
                  }}
                />

                {/* Botón para eliminar el atributo, si es que hay más de uno */}
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => {
                    const nuevosAtributos = atributos.filter((_, i) => i !== index);
                    console.log(nuevosAtributos)
                    setAtributos(nuevosAtributos);
                  }}
                  disabled={atributos.length <= 1}
                >X</Button>
              </div>
            ))}

            <div className="mb-3 d-flex justify-content-between align-items-center">
              {/* Botón para agregar un atributo */}
              <Button
                variant="primary"
                onClick={() => {
                  setAtributos([...atributos, { nombre: "", tipoDato: "", requerido: false }]);
                }}
              >Nuevo Atributo</Button>

              {/* Botón para crear el tipo de documento con los atributos */}
              <Button
                variant="success"
                onClick={() => {
                  if (!tipoDeDocumento) {
                    toast.error("Por favor, ingresa un nombre para el tipo de documento.");
                    return;
                  }
                  if (atributos.some(attr => !attr.nombre || !attr.tipoDato)) {
                    toast.error("Por favor, completa todos los campos de los atributos.");
                    return;
                  }

                  // Aquí se haría la petición al backend para crear el tipo de documento
                  console.info("SUBIR: Creando tipo de documento:", { nombre: tipoDeDocumento, atributos });
                  toast.success("Tipo de documento creado exitosamente");

                  // Resetear campos
                  setTipoDeDocumento(null);
                  setAtributos([{ nombre: "", tipoDato: "", requerido: false }]);
                }}>Enviar</Button>
            </div>
          </div>

          {/* Botón para agregar un nuevo atributo, es decir un div con un
          nombre atributo, un select con un tipo de dato y un check de si es requerido o no*/}
        </div>
      </Container>
    </RutaProtegida >
  );
};