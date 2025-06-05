# app.py

# clase de configuración para la aplicación Flask
import jwt
from config import Config
from controladores.bloques import Bloques

# controladores (rutas) de la aplicación
from controladores.documentos import Documentos
from controladores.login import Login
from controladores.queries import QueriesBloques as qb
from controladores.registro import Registro
from controladores.tipos_de_documento import TiposDeDocumentos
from controladores.usuarios import Usuarios
from controladores.consulta_documento import ConsultaDocumento

# Conexión a la base de datos PostgreSQL
from db import conectar, desconectar

# Flask, Flask-RESTful
from flask import Flask, current_app, g, jsonify, request
from flask_restful import Api

# psycopg para manejar la conexión a PostgreSQL
from psycopg.rows import dict_row

# Crear la aplicación Flask
app = Flask(__name__)
# Cargar variables de entorno
app.config.from_object(Config)
# Desactivar el ordenamiento de claves en la respuesta JSON
app.json.sort_keys = False

# Configurar la base de datos para que se conecte a PostgreSQL antes de cada solicitud y se desconecte después
app.before_request(conectar)
app.teardown_request(desconectar)


# Probar conexión a la base de datos
@app.before_request
def probar_db():
    """Prueba la conexión a la base de datos y crea el bloque genesis si no existe."""

    # Verificar si la solicitud es de tipo OPTIONS, que se utiliza para las solicitudes CORS
    if request.method == "OPTIONS":
        # Si es una solicitud OPTIONS, no hacer nada y retornar None
        return None

    try:
        cursor = g.db.cursor(row_factory=dict_row)
        cursor.execute("SELECT 1")
        if cursor.fetchone():
            current_app.logger.info("Conexión a la base de datos exitosa.")

        # Verificar si existe un bloque genesis
        cursor.execute(qb.SELECCIONAR_ULTIMO_BLOQUE)
        ultimo_bloque = cursor.fetchone()

        # Si no existe, insertar el bloque genesis, que es el primer bloque de la cadena
        # de bloques. Este bloque no tiene padre, su hash es generado aleatoriamente y su id es 0
        if not ultimo_bloque:
            cursor.execute(qb.INSERTAR_BLOQUE_GENESIS)
            current_app.logger.info("Bloque genesis creado exitosamente.")

    except Exception as e:
        current_app.logger.info(f"Error al conectar a la base de datos: {e}")

    return None


@app.before_request
def esta_autenticado():
    """Verifica si el usuario está autenticado antes de cada solicitud."""

    # Verificar si la solicitud es de tipo OPTIONS, que se utiliza para las solicitudes CORS
    if request.method == "OPTIONS":
        # Si es una solicitud OPTIONS, no hacer nada y retornar None
        return None

    # Verificar que la ruta no sea /login y que el método sea POST,
    # ya que el GET se utiliza para verificar si el usuario está autenticado
    # como si fuera un middleware de autenticación.
    if request.path == "/api/login" and request.method == "POST":
        return None
    elif request.path.startswith("/api/consulta_documento"):
        return None

    # Obtener el token recibido en la cabecera de la solicitud
    auth = request.headers.get("Authorization")

    # Si se recibe un token, extraerlo de la cabecera
    # y almacenar el usuario en flask.g para que esté disponible en toda la aplicación
    if auth:
        # Extraer el token de la cabecera Authorization
        encoded_jwt = auth.split("Bearer ")[-1]

        try:
            # Decodificar el token usando la clave secreta y el algoritmo HS256
            decoded_jwt = jwt.decode(
                encoded_jwt,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"],
            )

            current_app.logger.info(f"Token decodificado: {decoded_jwt}")
            g.token = decoded_jwt

        # Para manejar el error de token expirado
        except jwt.ExpiredSignatureError:
            current_app.logger.info("El token ha expirado.")
            g.token = None
            # Si el token ha expirado, no permitir acceso a la API
            return jsonify({"error": "El token ha expirado."}), 401

        # Para manejar el error de token inválido
        except jwt.InvalidTokenError:
            current_app.logger.info("El token es inválido.")
            g.token = None
            # Si el token es inválido, no permitir acceso a la API
            return jsonify({"error": "El token es inválido."}), 401

    else:
        current_app.logger.info("No se recibió token de autorización.")
        g.token = None
        # Si no se recibió token de autorización, no permitir acceso a la API
        return jsonify({"error": "No se recibió token de autorización."}), 401


# Crear la API RESTful
api = Api(app, prefix="/api")
# Agregar recursos a la API
api.add_resource(Login, "/login")
api.add_resource(Registro, "/registro")
api.add_resource(Usuarios, "/usuarios")
api.add_resource(TiposDeDocumentos, "/tipos_docs")
api.add_resource(Documentos, "/documentos")
api.add_resource(Bloques, "/bloques")

# Endpoints libres de autenticación
api.add_resource(ConsultaDocumento, "/consulta_documento/<string:hash>")


# Configurar CORS para permitir solicitudes desde el frontend
@app.after_request
def permitir_cors(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


if __name__ == "__main__":
    app.run(debug=True, port=app.config["PORT"], host="0.0.0.0")
