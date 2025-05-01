from flask_restful import Resource, reqparse
from flask import g


class TiposDeDocumentos(Resource):
    def get(self):
        return {"message": "GET tipos de documentos."}

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
                cursor.execute(query, (nombre,))
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
