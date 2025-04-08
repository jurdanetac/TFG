# app.py

from flask import Flask, g
from flask_restful import Api
from psycopg.rows import dict_row

from config import Config
from controladores.usuarios import Usuarios
from controladores.tipos_de_documento import TiposDeDocumentos
from controladores.documentos import Documentos
from db import conectar, desconectar

# Crear la aplicación Flask
app = Flask(__name__)
# Cargar variables de entorno
app.config.from_object(Config)

# Configurar la base de datos para que se conecte a PostgreSQL antes de cada solicitud y se desconecte después
app.before_request(conectar)
app.teardown_request(desconectar)


# Probar conexión a la base de datos
@app.before_request
def probar_db():
    try:
        cursor = g.db.cursor(row_factory=dict_row)
        cursor.execute("SELECT 1")
        if cursor.fetchone():
            print("Conexión a la base de datos exitosa.")
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")

    return None


# Crear la API RESTful
api = Api(app, prefix="/api")
# Agregar recursos a la API
api.add_resource(Usuarios, "/usuarios")
api.add_resource(TiposDeDocumentos, "/tipos_docs")
api.add_resource(Documentos, "/documentos")

if __name__ == "__main__":
    app.run(debug=True, port=app.config["PORT"])
