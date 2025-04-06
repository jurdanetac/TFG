from flask import Blueprint, redirect, url_for, request

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/', methods=['POST'])
def lista_usuarios():
    """TODO"""

    if request.method == 'GET':
        return redirect(url_for('api.index'))

    # Lógica para crear un nuevo usuario
    elif request.method == 'POST':
        # Extraer datos del formulario
        data = request.get_json()
        usuario = data.get('usuario')
        contrasena = data.get('contrasena')

        # Aquí deberías agregar la lógica para guardar el usuario en la base de datos
        # Por ejemplo, usando SQLAlchemy:
        # nuevo_usuario = Usuario(username=username, password=generate_password_hash(password))
        # db.session.add(nuevo_usuario)
        # db.session.commit()

        return {"info": f"Usuario {usuario} creado exitosamente"}, 201