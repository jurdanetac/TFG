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
        parser.add_argument("atributos", type=list[dict], location="json")
        args = parser.parse_args()

        nombre = args.nombre
        atributos = args.atributos

        with g.db.cursor() as cursor:

            try:
                # Insertar el nuevo tipo de doc en la base de datos
                id = cursor.execute(qtd.INSERTAR_TIPO_DE_DOC, (nombre,)).fetchone()[
                    "id"
                ]

                for atributo in atributos:
                    # Insertar cada atributo asociado al tipo de documento
                    cursor.execute(
                        qtd.INSERTAR_ATRIBUTO_TIPO_DE_DOC,
                        (
                            atributo["nombre"],
                            atributo["tipo_dato"],
                            atributo["requerido"],
                            id,
                        ),
                    )

                # Confirmar los cambios en la base de datos
                g.db.commit()
            except Exception as e:
                print(e)
                return {"error": "Tipo de documento ya existe"}, 409

        return {
            "info": f"Tipo de documento creado exitosamente",
            "nombre": nombre,
        }

    def put(self):
        return {"message": "PUT usuarios."}

    def delete(self):
        return {"message": "DELETE tipos de documentos."}
