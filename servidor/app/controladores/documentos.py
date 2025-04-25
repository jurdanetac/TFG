import json
import os
from base64 import b64decode, b64encode
from datetime import datetime
from hashlib import sha256

from flask import current_app, g, jsonify
from flask_restful import Resource, reqparse

from .queries import QueriesDocumentos as qd


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
        nombre_doc: str = f"{datetime.now().strftime('%d%m%Y-%H%M%S')}.{extension}"

        # Decodificar el base64 enviado en la petición JSON y almacenarlo
        documento: bytes = b64decode(documento_b64)

        ruta_docs: str = current_app.config["RUTA_DOCUMENTOS"]
        # Crear la carpeta si no existe
        if not os.path.exists(ruta_docs):
            current_app.logger.info("Creando carpeta de documentos...")
            os.makedirs(ruta_docs)
            current_app.logger.info("Carpeta de documentos creada.")

        # Construir la ruta completa del documento de manera segura usando os.path.join
        ruta_doc: str = os.path.join(ruta_docs, nombre_doc)

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
            proximo_id: int = cursor.fetchone()[0]

        # Obtener y convertir la marca de tiempo para el campo `creado_en` a un formato
        # ISO 8601 para almacenar en la base de datos
        creado_en: datetime = datetime.now().isoformat()

        campos: list = [
            proximo_id,
            creado_en,
            hash_doc,
            tipo_de_documento_id,
            usuario_id,
            json.dumps(valores_attrib),  # Convertir el diccionario a JSON
            palabras_clave,
        ]

        # Hashear columnas del registro sin el base64 ya que ya se tiene el hash del documento
        # Al hashear estos valores juntos, el sistema asegura que cada documento tenga un identificador único (`hash_registro`)
        # que puede ser usado para indexar, buscar o verificar la integridad del documento.
        hash_registro = sha256("".join(map(str, campos)).encode("utf-8")).hexdigest()
        current_app.logger.info(f"Hash del registro: {hash_registro}")

        print(campos)

        with g.db.cursor() as cursor:
            cursor.execute(
                qd.INSERTAR_DOCUMENTO,
                campos
                + [
                    documento_b64,
                ],
            )

            if cursor.rowcount == 0:
                current_app.logger.error(
                    "No se pudo insertar el documento en la base de datos."
                )
                return {
                    "error": "No se pudo insertar el documento en la base de datos."
                }, 500

        # Confirmar los cambios en la base de datos
        g.db.commit()
        current_app.logger.info("Documento insertado exitosamente en la base de datos.")
        current_app.logger.info(f"Registro creado en: {creado_en}")

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
