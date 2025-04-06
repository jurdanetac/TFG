from flask import Blueprint

from .usuarios import usuarios_bp

api_bp = Blueprint('api', __name__)

@api_bp.route('/')
def index():
    """Ruta de ejemplo para la API."""
    return "Bienvenido a la API"

api_bp.register_blueprint(usuarios_bp, url_prefix='/usuarios')
