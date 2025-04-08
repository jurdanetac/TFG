from datetime import datetime

from flask_restful import Resource, reqparse
from flask import g, current_app
from base64 import b64encode, b64decode
import requests


class Documentos(Resource):
    def get(self):
        # Demo

        ruta_test = f"{current_app.config['RUTA_DOCUMENTOS']}/test.txt"

        # Crear un archivo de texto para probar el envío
        with open(ruta_test, "wb") as archivo:
            archivo.write(b"Este es un archivo de prueba.")

        with open(ruta_test, "rb") as archivo:
            # Leer el contenido del archivo
            contenido = archivo.read()

        # Codificar el contenido en base64
        contenido_b64 = b64encode(contenido).decode("utf-8")
        # Hacer un post a la API para probar el envío del archivo
        url = "http://localhost:5000/api/documentos"
        headers = {"Content-Type": "application/json"}
        data = {"documento_b64": contenido_b64}

        # Enviar la solicitud POST a la API
        response = requests.post(url, headers=headers, json=data)

        # Devolver la respuesta de la API
        print(response)
        return response.json()

    def post(self):
        """Crea un nuevo documento"""

        # Definir los argumentos esperados en la petición JSON
        parser = reqparse.RequestParser()
        # parser.add_argument("nombre", type=str)
        parser.add_argument("documento_b64", type=str)
        args = parser.parse_args()

        print(args)

        # nombre = args.nombre
        documento_b64 = args.documento_b64
        # Crear nombre del documento con timestamp y nombre del doc
        nombre_doc = f"{datetime.now().strftime('%d%m%Y')}-test"
        print(nombre_doc)

        # Decodificar el base64 enviado en la petición JSON y almacenarlo
        documento = b64decode(documento_b64)
        print(f"{current_app.config["RUTA_DOCUMENTOS"]}/{nombre_doc}")
        with open(
            f"{current_app.config["RUTA_DOCUMENTOS"]}/{nombre_doc}", "wb"
        ) as archivo:
            archivo.write(documento)

        print("Documento guardado exitosamente.")

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

        return {
            "info": f"Tipo de documento creado exitosamente",
        }

    def put(self):
        return {"message": "PUT usuarios."}

    def delete(self):
        return {"message": "DELETE tipos de documentos."}
