from flask_restful import Resource


class ConsultaDocumento(Resource):
    def get(self, hash):
        return { "hash": hash }
