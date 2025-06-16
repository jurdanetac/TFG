from flask_restful import Resource
from flask import g
from .queries import QueriesEstatusCadena as qec


class EstatusCadena(Resource):
    def get(self):

        with g.db.cursor() as cursor:
            cursor.execute(qec.SELECCIONAR_ESTATUS_CADENA)
            estatus = cursor.fetchall()

            # Convertir los datetime a string para evitar problemas de serialización
            for bloque in estatus:
                bloque["creado_en"] = (
                    bloque["creado_en"].isoformat() if bloque["creado_en"] else None
                )

        return estatus
