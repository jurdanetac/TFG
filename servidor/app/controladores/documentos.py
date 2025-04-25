import os
from base64 import b64decode, b64encode
from datetime import datetime
from hashlib import sha256

import requests
from flask import current_app, g, jsonify
from flask_restful import Resource, reqparse


class Documentos(Resource):
    def get(self) -> dict:
        """Obtiene todos los documentos almacenados en la base de datos"""
        with g.db.cursor() as cursor:
            cursor.execute(
                """--sql
                    SELECT * FROM public.documentos
                """
            )
            documentos: list = cursor.fetchall()
            return jsonify(documentos)

    def post(self) -> dict:
        """Recibe un documento en base64 en el cuerpo de una petición
        HTTP POST y lo almacena en el servidor"""

        # Definir los argumentos esperados en la petición JSON
        parser: reqparse.RequestParser = reqparse.RequestParser()
        parser.add_argument("documento_b64", type=str)
        parser.add_argument("documento_extension", type=str)
        parser.add_argument("tipo_de_documento_id", type=int)

        # Diccionario que contiene los argumentos de la petición;
        # por ejemplo : {"documento_b64": "VG8gaGFzaCBhICoqd...", "documento_extension": "pdf"}
        try:
            args: dict = parser.parse_args()
        except Exception as e:
            current_app.logger.error(e)
            return jsonify({"error": f"No fueron suministrados los campos requeridos"})

        # Extraer los argumentos de la petición JSON
        documento_b64: str = args.documento_b64
        extension: str = args.documento_extension
        tipo_de_documento_id: int = args.tipo_de_documento_id

        # Crear nombre del documento con timestamp y nombre del doc en la forma de "ddmmyyyy.<extension>"
        nombre_doc: str = f"{datetime.now().strftime('%d%m%Y')}"

        # Decodificar el base64 enviado en la petición JSON y almacenarlo
        documento: bytes = b64decode(documento_b64)

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
            sha256_doc: str = sha256(documento).hexdigest()

            # TODO: Obtener las palabras clave del documento (Samuel B)
            palabras_clave = ["palabra1", "palabra2", "palabra3"]

        current_app.logger.info("Documento guardado exitosamente.")

        return jsonify(
            {
                "mensaje": "Documento guardado exitosamente.",
                "documento": {
                    "nombre": nombre_doc,
                    "extension": extension,
                    "tipo_de_documento_id": tipo_de_documento_id,
                    "hash": sha256_doc,
                    "palabras_clave": palabras_clave,
                },
            }
        ) 


        # hashear columnas del registro
        # id, creado_en, hash, contenido, tipo_de_documento_id, usuario_id, valores_attrib, palabras_clave
        # with g.db.cursor() as cursor:
        #    cursor.execute(
        #        """--sql
        #            SELECT * FROM public.tipos_de_documentos WHERE nombre = %s
        #        """,
        #        (nombre_doc,),
        #    )

        # with g.db.cursor() as cursor:
        #     query = """--sql
        #     INSERT INTO public.tipos_de_documentos (nombre) VALUES(%s)
        #     """

        #     try:
        #         # Insertar el nuevo tipo de doc en la base de datos
        #         cursor.execute(query, (nombre,))
        #         # Confirmar los cambios en la base de datos
        #         g.db.commit()
        #     except Exception as e:
        #         return {"error": "Tipo de documento ya existe"}, 409

    def put(self):
        return {"message": "PUT usuarios."}

    def delete(self):
        return {"message": "DELETE tipos de documentos."}
