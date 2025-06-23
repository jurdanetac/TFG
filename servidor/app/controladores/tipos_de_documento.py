from flask import g
from flask_restful import Resource, reqparse

from .queries import QueriesTiposDocumentos as qtd


class TiposDeDocumentos(Resource):
    def get(self):
        with g.db.cursor() as cursor:
            # Obtener todos los tipos de documentos
            cursor.execute(qtd.SELECCIONAR_TODOS_TIPOS_DE_DOC)
            tipos_de_doc = cursor.fetchall()
            return tipos_de_doc

    def post(self):
        """Crea un nuevo tipo de documento"""

        # Definir los argumentos esperados en la petición JSON
        parser = reqparse.RequestParser()
        parser.add_argument("nombre", type=str)
        args = parser.parse_args()

        nombre = args.nombre

        with g.db.cursor() as cursor:

            try:
                # Insertar el nuevo tipo de doc en la base de datos
                cursor.execute(qtd.INSERTAR_TIPO_DE_DOC, (nombre,))
                # Confirmar los cambios en la base de datos
                g.db.commit()
            except Exception as e:
                return {"error": "Tipo de documento ya existe"}, 409

        return {
            "info": f"Tipo de documento creado exitosamente",
            "nombre": nombre,
        }

    def put(self):
        return {"message": "PUT usuarios."}

    def delete(self):
        return {"message": "DELETE tipos de documentos."}
