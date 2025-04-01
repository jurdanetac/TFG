# app.py
from flask import Flask, redirect, url_for
from models import db
from routes import bp


def create_app() -> Flask:
    """Crear y configurar la aplicación Flask."""

    # Crear la aplicación Flask
    app = Flask(__name__)

    # Variables de entorno
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg://postgres:postgres@localhost:5432/tfg'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Inicializar la base de datos
    db.init_app(app)

    # Crear tablas en la base de datos
    with app.app_context():
        db.create_all()

    # Registrar el blueprint de la API
    app.register_blueprint(bp, url_prefix='/')

    # Configurar la ruta de inicio a /api
    """
    @app.route('/')
    def index():
        return redirect(url_for("api.index"))
    """

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
