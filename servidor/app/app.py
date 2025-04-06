# app.py
from flask import Flask, redirect, url_for, g
from psycopg.rows import dict_row

from config import Config
from controladores.api import api_bp
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
def test_db_connection():
    try:
        cursor = g.db.cursor(row_factory=dict_row)
        cursor.execute("SELECT 1")
        if cursor.fetchone():
            print("Conexión a la base de datos exitosa.")
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")

    return None


@app.route('/')
def index():
    """Redirige a la ruta de la API por defecto."""
    return redirect(url_for('api.index'))


@app.errorhandler(404)
def not_found(e):
    """Manejo de errores 404."""
    return redirect(url_for('index'))


# Registrar el blueprint de la API
app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, port=app.config['PORT'])
