# app.py

# clase de configuración para la aplicación Flask
from config import Config
# controladores (rutas) de la aplicación
from controladores.documentos import Documentos
from controladores.login import Login
from controladores.queries import QueriesBloques as qb
from controladores.registro import Registro
from controladores.tipos_de_documento import TiposDeDocumentos
from controladores.usuarios import Usuarios
# Conexión a la base de datos PostgreSQL
from db import conectar, desconectar
# Flask, Flask-RESTful
from flask import Flask, g, request, session
from flask_restful import Api
# psycopg para manejar la conexión a PostgreSQL
from psycopg.rows import dict_row

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

        # Verificar si existe un bloque genesis
        cursor.execute(qb.SELECCIONAR_ULTIMO_BLOQUE)
        ultimo_bloque = cursor.fetchone()
        # print(ultimo_bloque)

        # Si no existe, insertar el bloque genesis, que es el primer bloque de la cadena
        # de bloques. Este bloque no tiene padre, su hash es generado aleatoriamente y su id es 0
        if not ultimo_bloque:
            cursor.execute(qb.INSERTAR_BLOQUE_GENESIS)
            print("Bloque genesis creado exitosamente.")

    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")

    return None


# Crear la API RESTful
api = Api(app, prefix="/api")
# Agregar recursos a la API
api.add_resource(Login, "/login")
api.add_resource(Registro, "/registro")
api.add_resource(Usuarios, "/usuarios")
api.add_resource(TiposDeDocumentos, "/tipos_docs")
api.add_resource(Documentos, "/documentos")


if __name__ == "__main__":
    app.run(debug=True, port=app.config["PORT"])
