import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
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
  const [tiposAgrupadosPorId, setTiposAgrupadosPorId] = useState({});

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
  const [crearTipoDeDocumento, setCrearTipoDeDocumento] = useState(null);
  const [crearAtributosTipoDeDocumento, setCrearAtributosTipoDeDocumento] = useState([{
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

          const tiposDisponibles = [];

          const tiposAgrupadosPorId = data.reduce((acc, tipo) => {
            // Agrupar los tipos de documento por ID
            if (!acc[tipo.attr_tipo_de_documento_id]) {
              acc[tipo.attr_tipo_de_documento_id] = []
            }

            // Agregar el tipo de documento al array correspondiente, si no existe ya
            if (!tiposDisponibles.some(t => t.tipo_doc_id === tipo.tipo_doc_id)) {
              tiposDisponibles.push({
                tipo_doc_id: tipo.tipo_doc_id,
                nombre: tipo.tipo_doc_nombre
              });
            }

            acc[tipo.attr_tipo_de_documento_id].push(tipo);

            return acc;
          }, {});

          console.log("SUBIR: Tipos de documento disponibles:", tiposDisponibles);
          console.info("SUBIR: Tipos de documento agrupados por ID:", tiposAgrupadosPorId);

          // Convertir el objeto a un array de objetos
          setTiposDeDocumentoDisponibles(tiposDisponibles);
          setTiposAgrupadosPorId(tiposAgrupadosPorId);
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

    // atributos del tipo de documento
    const atributos = atributosTipoDocumento.reduce((acc, attr) => {
      console.info("SUBIR: Atributo:", attr.attr_nombre, "Valor:", attr.valor);
      acc[attr.attr_nombre] = attr.valor;
      return acc;
    }, {});

    const cuerpoDocumento = {
      documento_b64: base64Data,
      documento_extension: extension,
      tipo_de_documento_id: tipoDeDocumentoSeleccionado,
      palabras_clave: { palabras: palabrasClave },
      usuario_id: usuario.id,
      nombre: nombreDocumento,
      hash_antecesor: hashDocumento,
      valores_attrib: atributos
    };

    console.info("SUBIR: Subiendo documento:", cuerpoDocumento);

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
        setAtributosTipoDocumento([]);
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
    if (!crearTipoDeDocumento) {
      toast.error("Por favor, ingresa un nombre para el tipo de documento.");
      return;
    }
    if (crearAtributosTipoDeDocumento.some(attr => !attr.nombre || !attr.tipo_dato)) {
      toast.error("Por favor, completa todos los campos de los atributos.");
      return;
    }

    // Aquí se haría la petición al backend para crear el tipo de documento
    console.info("SUBIR: Creando tipo de documento:", { nombre: crearTipoDeDocumento, atributos: crearAtributosTipoDeDocumento });

    (async () => {
      await fetch(process.env.URL_BACKEND + "/tipos_docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          nombre: crearTipoDeDocumento,
          atributos: crearAtributosTipoDeDocumento
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
      setCrearTipoDeDocumento(null);
      setCrearAtributosTipoDeDocumento([{ nombre: "", tipo_dato: "", requerido: false }]);
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
              <Form.Select onChange={(e) => {
                setTipoDeDocumentoSeleccionado(e.target.value)
                // Al cambiar el tipo de documento, actualizar los atributos correspondientes
                // si el tipo de documento seleccionado no tiene atributos, se muestra un array vacío
                setAtributosTipoDocumento(tiposAgrupadosPorId[e.target.value] || [])
              }} value={tipoDeDocumentoSeleccionado}>
                <option value="">Selecciona un tipo de documento</option>
                {tiposDeDocumentoDisponibles.map((tipo) => (
                  <option key={tipo.tipo_doc_id} value={tipo.tipo_doc_id}>
                    {tipo.nombre}
                  </option>
                ))}
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

          {atributosTipoDocumento.length > 0 && (
            <Row className="mt-4 border p-2 rounded">
              <Form.Label>Atributos del tipo de documento</Form.Label>
              {atributosTipoDocumento.map((atributo, index) => (
                <Col key={index}>
                  <Form.Group className="mb-3">
                    <Form.Label>{atributo.attr_nombre}</Form.Label>
                    <Form.Control
                      type={(() => {
                        switch (atributo.attr_tipo_dato) {
                          case 'varchar': return 'text';
                          case 'date': return 'date';
                          default: return 'text'; // Por defecto, usar texto
                        }
                      })()}
                      onChange={(e) => {
                        // Actualizar el valor del atributo en el estado
                        const nuevosAtributos = [...atributosTipoDocumento];
                        nuevosAtributos[index].valor = e.target.value;
                        setAtributosTipoDocumento(nuevosAtributos);
                      }}
                      required={atributo.attr_requerido}
                      className="atributoInput"
                      name={atributo.attr_nombre}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          )}

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
              value={crearTipoDeDocumento}
              onChange={(e) => {
                // Actualizar el estado del tipo de documento
                setCrearTipoDeDocumento(e.target.value)
              }}
            />
          </div>


          <hr className="my-4" />

          <div>
            {crearAtributosTipoDeDocumento.map((atributo, index) => (
              <div key={index} className="mb-3 d-flex align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Nombre del atributo"
                  value={atributo.nombre}
                  onChange={(e) => {
                    const nuevosAtributos = [...crearAtributosTipoDeDocumento];
                    nuevosAtributos[index].nombre = e.target.value;
                    setCrearAtributosTipoDeDocumento(nuevosAtributos);
                  }}
                />
                <Form.Select
                  className="mx-2"
                  value={atributo.tipo_dato}
                  onChange={(e) => {
                    const nuevosAtributos = [...crearAtributosTipoDeDocumento];
                    nuevosAtributos[index].tipo_dato = e.target.value;
                    setCrearAtributosTipoDeDocumento(nuevosAtributos);
                  }}
                >
                  <option value="">Seleccione un tipo de dato</option>
                  <option value="varchar">Texto</option>
                  <option value="date">Fecha</option>
                </Form.Select>
                <Form.Check
                  type="checkbox"
                  label="Requerido"
                  checked={atributo.requerido}
                  onChange={(e) => {
                    const nuevosAtributos = [...crearAtributosTipoDeDocumento];
                    nuevosAtributos[index].requerido = e.target.checked;
                    setCrearAtributosTipoDeDocumento(nuevosAtributos);
                  }}
                />

                {/* Botón para eliminar el atributo, si es que hay más de uno */}
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => {
                    const nuevosAtributos = crearAtributosTipoDeDocumento.filter((_, i) => i !== index);
                    setCrearAtributosTipoDeDocumento(nuevosAtributos);
                  }}
                  disabled={crearAtributosTipoDeDocumento.length <= 1}
                >X</Button>
              </div>
            ))}

            <div className="mb-3 d-flex justify-content-between align-items-center">
              {/* Botón para agregar un atributo */}
              <Button
                variant="primary"
                onClick={() => {
                  setCrearAtributosTipoDeDocumento([...crearAtributosTipoDeDocumento, { nombre: "", tipo_dato: "", requerido: false }]);
                }}
              >Nuevo Atributo</Button>

              {/* Botón para crear el tipo de documento con los atributos */}
              <Button
                variant="success"
                onClick={manejarSubidaTipoDocumento}>Enviar</Button>
            </div>
          </div>
        </div>
      </Container >
    </RutaProtegida >
  );
};