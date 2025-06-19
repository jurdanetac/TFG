from flask import g
from flask_restful import Resource
from .queries import QueriesDocumentos as qd


class ConsultaDocumento(Resource):
    def get(self, hash):
        with g.db.cursor() as cursor:
            cursor.execute(qd.SELECCIONAR_DOC, (hash,))

            resultado = cursor.fetchone()
            if resultado:
                # Arreglar problema de serialización con creado_en
                resultado["creado_en"] = (
                    resultado["creado_en"].isoformat()
                    if resultado["creado_en"]
                    else None
                )

                return resultado
            
            return {"error": "Documento no existe"}, 404
