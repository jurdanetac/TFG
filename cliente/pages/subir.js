import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
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
  // Estado para manejar el archivo seleccionado y su información
  const [documento, setDocumento] = useState(null);

  // Estado para manejar los tipos de documento disponibles
  const [tiposDeDocumentoDisponibles, setTiposDeDocumentoDisponibles] = useState([]);

  // Estado para manejar el tipo de documento seleccionado y los atributos del mismo
  const [tipoDeDocumentoSeleccionado, setTipoDeDocumentoSeleccionado] = useState(1);
  const [atributosTipoDocumento, setAtributosTipoDocumento] = useState([]);
  const [palabrasClave, setPalabrasClave] = useState([""]);

  // Estado para manejar el nombre y hash del documento
  const [nombreDocumento, setNombreDocumento] = useState("");
  const [hashDocumento, setHashDocumento] = useState("");

  // Obtener el token y el usuario del contexto de autenticación
  const { token, usuario } = useContext(AuthContexto)

  // estados para la creación de tipos de documento
  const [tipoDeDocumento, setTipoDeDocumento] = useState(null);
  const [atributosCrearTipoDeDocumento, setAtributosCrearTipoDeDocumento] = useState([{
    nombre: "",
    tipo_dato: "",
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

          const tiposAgrupadosPorId = data.reduce((acc, tipo) => {
            // Agrupar los tipos de documento por ID
            if (!acc[tipo.attr_tipo_de_documento_id]) {
              acc[tipo.attr_tipo_de_documento_id] = []
            }

            acc[tipo.attr_tipo_de_documento_id].push(tipo);

            return acc;
          }, {});

          console.info("SUBIR: Tipos de documento agrupados por ID:", tiposAgrupadosPorId);

          // Convertir el objeto a un array de objetos
          setTiposDeDocumentoDisponibles(tiposAgrupadosPorId);
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
      palabras_clave: {palabras: palabrasClave},
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
        setPalabrasClave([""]);
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

  const manejarSubidaTipoDocumento = () => {
    if (!tipoDeDocumento) {
      toast.error("Por favor, ingresa un nombre para el tipo de documento.");
      return;
    }
    if (atributosCrearTipoDeDocumento.some(attr => !attr.nombre || !attr.tipo_dato)) {
      toast.error("Por favor, completa todos los campos de los atributos.");
      return;
    }

    // Aquí se haría la petición al backend para crear el tipo de documento
    console.info("SUBIR: Creando tipo de documento:", { nombre: tipoDeDocumento, atributos: atributosCrearTipoDeDocumento });

    (async () => {
      await fetch(process.env.URL_BACKEND + "/tipos_docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          nombre: tipoDeDocumento,
          atributos: atributosCrearTipoDeDocumento
        })
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Error al crear el tipo de documento: " + response.statusText);
        }
        return response.json();
      }).then((data) => {
        console.info("SUBIR: Tipo de documento creado exitosamente:", data);
        toast.success("Tipo de documento creado exitosamente");
      }).catch((error) => {
        console.error("SUBIR: Error al crear el tipo de documento:", error);
        toast.error("Error al crear el tipo de documento: " + error.message);
      });

      // Resetear campos
      setTipoDeDocumento(null);
      setAtributosCrearTipoDeDocumento([{ nombre: "", tipo_dato: "", requerido: false }]);
    })();
  }

  return (
    <RutaProtegida>
      <Container className="" style={{ minHeight: '100vh' }}>
        <TituloPagina titulo={"Subir Documento"} />

        {/* Input para subir el archivo */}
        <Form.Group className="mb-3">
          <Row className="border p-2 rounded">
            <Col md={2}>
              <Form.Label>Tipo de documento</Form.Label>
              <Form.Select onChange={(e) => setTipoDeDocumentoSeleccionado(e.target.value)} value={tipoDeDocumentoSeleccionado}>
                {/* Mapeo de los tipos de documento para el select */}
                {Object.keys(tiposDeDocumentoDisponibles).flatMap((tipoId) => {
                  return tiposDeDocumentoDisponibles[tipoId].map((tipo) => (
                    <option key={tipo.tipo_doc_id} value={tipo.tipo_doc_id}>
                      {tipo.tipo_doc_nombre}
                    </option>
                  ));
                })}
              </Form.Select>
            </Col>

            <Col md={4}>
              <Form.Label>Nombre del documento a registrar</Form.Label>
              <Form.Control
                type="text"
                placeholder="Documento de prueba"
                value={nombreDocumento}
                onChange={(e) => setNombreDocumento(e.target.value)}
              />
            </Col>

            <Col md={6}>
              <Form.Label>Antecesor en la cadena documental (opcional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
                value={hashDocumento}
                onChange={(e) => setHashDocumento(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mt-4 border p-2 rounded">
            <Form.Label>Palabras Clave</Form.Label>
            <Row>
              {palabrasClave && palabrasClave.map((pc, index) => (
                <Col>
                  <Form.Control
                    key={index}
                    type="text"
                    placeholder="Palabra clave"
                    value={pc}
                    className="palabraClaveInput"
                    onChange={() => {
                      console.info("SUBIR: Cambiando palabras clave...")

                      console.log(
                        Array.from(
                          document.querySelectorAll(".palabraClaveInput")
                        ).map((opc => opc.value))
                      )

                      setPalabrasClave(
                        Array.from(
                          document.querySelectorAll(".palabraClaveInput")
                        ).map((opc => opc.value))
                      )
                    }}
                  />
                </Col>
              ))}
            </Row>

            {/* Botón para agregar una nueva palabra clave */}
            <div className="d-flex gap-2 mt-2">
              <Button
                variant="primary"
                onClick={() => {
                  setPalabrasClave(palabrasClave.concat([""]))
                }}
              >+</Button>
              {/* Botón para eliminar una palabra clave */}
              <Button
                variant="secondary"
                onClick={() => {
                  setPalabrasClave(palabrasClave.slice(0, -1))
                }}
              >-</Button>
            </div>
          </Row>

          <Row className="mt-4 border p-2 rounded">
            <Col>
              <Form.Label>Selecciona un documento para subir</Form.Label>
              <Form.Control type="file" id="documentoInput" onChange={cambiarArchivo} accept="application/pdf" />
              <Form.Text className="text-muted" style={{ cursor: 'help' }}>
                Sólo se permiten archivos PDF.
              </Form.Text>
            </Col>
          </Row>
        </Form.Group>

        {/* Detalles del archivo */}
        {
          documento && (
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
          )
        }

        {/* Boton para subir el archivo */}
        {
          documento && (
            <Button
              onClick={manejarSubida}
              variant="primary"
            >
              Subir
            </Button>
          )
        }

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
              onChange={(e) => {
                // Actualizar el estado del tipo de documento
                setTipoDeDocumento(e.target.value)
                // Actualizar los atributos a mostrar
                // setAtributosCrearTipoDeDocumento([
                // ]);
                console.log(tiposDeDocumentoDisponibles.filter((tipo) => tipo.id === e.target.value))
              }}
            />
          </div>


          <hr className="my-4" />

          {/* Atributos */}
          <div>
            {atributosCrearTipoDeDocumento.map((atributo, index) => (
              <div key={index} className="mb-3 d-flex align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Nombre del atributo"
                  value={atributo.nombre}
                  onChange={(e) => {
                    const nuevosAtributos = [...atributosCrearTipoDeDocumento];
                    nuevosAtributos[index].nombre = e.target.value;
                    setAtributosCrearTipoDeDocumento(nuevosAtributos);
                  }}
                />
                <Form.Select
                  className="mx-2"
                  value={atributo.tipo_dato}
                  onChange={(e) => {
                    const nuevosAtributos = [...atributosCrearTipoDeDocumento];
                    nuevosAtributos[index].tipo_dato = e.target.value;
                    setAtributosCrearTipoDeDocumento(nuevosAtributos);
                  }}
                >
                  <option value="">Seleccione un tipo de dato</option>
                  <option value="varchar">Texto</option>
                  <option value="int4">Número</option>
                  <option value="datetime">Fecha</option>
                  <option value="bool">Sí/No</option>
                </Form.Select>
                <Form.Check
                  type="checkbox"
                  label="Requerido"
                  checked={atributo.requerido}
                  onChange={(e) => {
                    const nuevosAtributos = [...atributosCrearTipoDeDocumento];
                    nuevosAtributos[index].requerido = e.target.checked;
                    setAtributosCrearTipoDeDocumento(nuevosAtributos);
                  }}
                />

                {/* Botón para eliminar el atributo, si es que hay más de uno */}
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => {
                    const nuevosAtributos = atributosCrearTipoDeDocumento.filter((_, i) => i !== index);
                    console.log(nuevosAtributos)
                    setAtributosCrearTipoDeDocumento(nuevosAtributos);
                  }}
                  disabled={atributosCrearTipoDeDocumento.length <= 1}
                >X</Button>
              </div>
            ))}

            <div className="mb-3 d-flex justify-content-between align-items-center">
              {/* Botón para agregar un atributo */}
              <Button
                variant="primary"
                onClick={() => {
                  setAtributosCrearTipoDeDocumento([...atributosCrearTipoDeDocumento, { nombre: "", tipo_dato: "", requerido: false }]);
                }}
              >Nuevo Atributo</Button>

              {/* Botón para crear el tipo de documento con los atributos */}
              <Button
                variant="success"
                onClick={manejarSubidaTipoDocumento}>Enviar</Button>
            </div>
          </div>

          {/* Botón para agregar un nuevo atributo, es decir un div con un
          nombre atributo, un select con un tipo de dato y un check de si es requerido o no*/}
        </div>
      </Container >
    </RutaProtegida >
  );
};