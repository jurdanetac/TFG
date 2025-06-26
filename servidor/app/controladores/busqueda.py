from flask import current_app, g, jsonify, request
from flask_restful import Resource

from .queries import QueriesDocumentos as qd


class BusquedaDocumentos(Resource):
    def get(self) -> dict:
        """Ruta para buscar un documento por metadata."""

        consulta: int = request.args.get("consulta").lower()
        print(consulta)

        if consulta:
            # Si el usuario está logueado, obtener los documentos del usuario
            with g.db.cursor() as cursor:
                cursor.execute(qd.SELECCIONAR_TODOS_DOCS)
                documentos: list = cursor.fetchall()

                documentos_que_coinciden = [
                    doc for doc in documentos
                    if consulta in doc["nombre"].lower()
                    or consulta in doc["tipo_de_documento"].lower()
                    or consulta in ", ".join(doc["valores_attrib"]).lower()
                    or consulta in ", ".join(doc["palabras_clave"]).lower()
                ]
                print(len(documentos_que_coinciden), "documentos encontrados que coinciden con la consulta.")

                return jsonify(documentos_que_coinciden)

        # Si no hay consulta, retornar todos los documentos
        return jsonify(documentos)
