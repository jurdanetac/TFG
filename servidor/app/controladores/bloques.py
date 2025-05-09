from flask import g, jsonify
from flask_restful import Resource

from .queries import QueriesBloques as qb


class Bloques(Resource):
    def get(self) -> dict:
        """Obtiene todos los bloques almacenados en la base de datos"""

        with g.db.cursor() as cursor:
            cursor.execute(qb.SELECCIONAR_TODOS_BLOQUES)
            bloques: list = cursor.fetchall()

            # convertir todos los creado_en a ISO 8601
            for bloque in bloques:
                bloque["creado_en"] = bloque["creado_en"].isoformat()

            return jsonify(bloques)
