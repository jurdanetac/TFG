import json
import os
from base64 import b64decode, b64encode
from datetime import datetime as dt
from hashlib import sha256

from flask import current_app, g, jsonify
from flask_restful import Resource, reqparse

from .queries import QueriesDocumentos as qd, QueriesBloques as qb
from psycopg.errors import UniqueViolation


class Documentos(Resource):
    def get(self) -> dict:
        """Obtiene todos los documentos almacenados en la base de datos"""

        with g.db.cursor() as cursor:
            cursor.execute(qd.SELECCIONAR_TODOS_DOCS)
            documentos: list = cursor.fetchall()
            return jsonify(documentos)

    def post(self) -> dict:
        """Recibe un documento en base64 en el cuerpo de una petición
        HTTP POST y lo almacena en el servidor"""

        # Definir los argumentos esperados en la petición JSON
        parser: reqparse.RequestParser = reqparse.RequestParser()
        parser.add_argument("documento_b64", type=str, required=True)
        parser.add_argument("documento_extension", type=str, required=True)
        parser.add_argument("tipo_de_documento_id", type=int, required=True)
        parser.add_argument("valores_attrib", type=dict, required=True)
        parser.add_argument("usuario_id", type=int, required=True)

        # Diccionario que contiene los argumentos de la petición;
        # por ejemplo : {"documento_b64": "VG8gaGFzaCBhICoqd...", "documento_extension": "pdf",
        # "tipo_de_documento_id": 1, "valores_attrib": {"nombre": "documento1"}}
        try:
            args: dict = parser.parse_args()
        except Exception as e:
            current_app.logger.error(e)
            return jsonify({"error": f"No fueron suministrados los campos requeridos"})

        # Extraer los argumentos de la petición JSON
        documento_b64: str = args.documento_b64
        extension: str = args.documento_extension
        tipo_de_documento_id: int = args.tipo_de_documento_id
        valores_attrib: dict = args.valores_attrib
        usuario_id: int = args.usuario_id

        # Crear nombre del documento con timestamp y nombre del doc en la forma de "ddmmyyyy.<extension>"
        nombre_doc: str = f"{dt.now().strftime('%d%m%Y-%H%M%S')}.{extension}"

        # Decodificar el base64 enviado en la petición JSON y almacenarlo
        documento: bytes = b64decode(documento_b64)

        # Ruta donde se almacenan los documentos en el servidor
        ruta_docs: str = current_app.config["RUTA_DOCUMENTOS"]
        # Crear la carpeta si no existe
        if not os.path.exists(ruta_docs):
            current_app.logger.info("Creando carpeta de documentos...")
            os.makedirs(ruta_docs)
            current_app.logger.info("Carpeta de documentos creada.")

        # Construir la ruta completa del documento de manera segura usando os.path.join
        ruta_doc: str = os.path.join(ruta_docs, f"{nombre_doc}.{extension}")

        with open(ruta_doc, "wb") as archivo:
            # Guardar el documento en el directorio de documentos
            archivo.write(documento)
            # Hashear el documento sha256 para almacenar en la base de datos
            # Se puede usar el hash del documento como un filtro extra tanto al almacenar como al recuperar el documento
            hash_doc: str = sha256(documento).hexdigest()

            # TODO: Obtener las palabras clave del documento (Samuel B)
            palabras_clave = ["palabra1", "palabra2", "palabra3"]

        # Obtener próximo id de documento de la secuencia documentos_id_seq (PK)
        with g.db.cursor() as cursor:
            cursor.execute(qd.SELECCIONAR_PROXIMO_DOC_ID)
            proximo_id: int = cursor.fetchone().get("id")

        # Obtener y convertir la marca de tiempo para el campo `creado_en` a un formato
        # ISO 8601 para almacenar en la base de datos
        creado_en: dt = dt.now().isoformat()

        # `campos` es una lista que contiene los valores a insertar en la base de datos
        campos: list = [
            proximo_id,
            creado_en,
            hash_doc,
            tipo_de_documento_id,
            usuario_id,
            json.dumps(valores_attrib),  # Convertir el diccionario a JSON
            palabras_clave,
            documento_b64,
        ]

        # Hashear columnas del registro sin el base64 ya que ya se tiene el hash del documento
        # Al hashear estos valores juntos, el sistema asegura que cada documento tenga un identificador único (`hash_registro`)
        # que puede ser usado para indexar, buscar o verificar la integridad del documento.
        hash_registro = sha256("".join(map(str, campos)).encode("utf-8")).hexdigest()
        current_app.logger.info(f"Hash del registro: {hash_registro}")

        # print(campos)

        with g.db.cursor() as cursor:
            try:
                # Insertar el documento en la base de datos
                cursor.execute(qd.INSERTAR_DOCUMENTO, campos)

                # Buscar el último bloque en la cadena de bloques
                cursor.execute(qb.SELECCIONAR_ULTIMO_BLOQUE)
                ultimo_bloque = cursor.fetchone()
                hash_ultimo_bloque = ultimo_bloque.get("hash")

                # Hashear el bloque con el hash del último bloque y el hash del registro
                # para crear un nuevo bloque que depende del bloque anterior,
                # asegurando la integridad de la cadena de bloques
                nuevo_bloque = {
                    "id": ultimo_bloque["id"] + 1,
                    "creado_en": dt.now().isoformat(),
                    "hash": sha256(
                        f"{hash_ultimo_bloque}{hash_registro}".encode("utf-8")
                    ).hexdigest(),
                    "hash_previo": hash_ultimo_bloque,
                }

                # print(nuevo_bloque)
                # Insertar el nuevo bloque en la base de datos
                cursor.execute(qb.INSERTAR_BLOQUE, list(nuevo_bloque.values()))

                current_app.logger.info(
                    "Documento insertado exitosamente en la base de datos."
                )
                current_app.logger.info(f"Registro creado en: {creado_en}")

                # Retornar la respuesta al cliente
                return jsonify(
                    {
                        "mensaje": "Documento guardado exitosamente.",
                        "documento": {
                            "nombre": nombre_doc,
                            "extension": extension,
                            "tipo_de_documento_id": tipo_de_documento_id,
                            "hash": hash_doc,
                            "palabras_clave": palabras_clave,
                        },
                    }
                )

            except UniqueViolation as e:
                current_app.logger.error("El documento ya existe en la base de datos.")
                return jsonify({"error": "El documento ya existe en la base de datos."})
