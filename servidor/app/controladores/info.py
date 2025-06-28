from flask import g
from flask_restful import Resource

from .queries import QueriesInfo as qi


class Info(Resource):
    def get(self):
        with g.db.cursor() as cursor:
            cursor.execute(qi.SELECCIONAR_CANTIDAD_DOCUMENTOS)
            cantidad_documentos = cursor.fetchone()
            cursor.execute(qi.SELECCIONAR_CANTIDAD_USUARIOS)
            cantidad_usuarios = cursor.fetchone()
            cursor.execute(qi.SELECCIONAR_CANTIDAD_TIPOS_DE_DOCUMENTOS)
            cantidad_tipos_documentos = cursor.fetchone()

            return {
                "cantidad_documentos": cantidad_documentos["cantidad"],
                "cantidad_usuarios": cantidad_usuarios["cantidad"],
                "cantidad_tipos_de_documentos": cantidad_tipos_documentos["cantidad"],
            }
