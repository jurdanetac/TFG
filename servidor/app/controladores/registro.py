# login simple que verifica el usuario y la contraseña, permite registrar usuarios
# y utiliza bcrypt para encriptar las contraseñas, almacenando si el usuario esta
# autenticado o no en la sesion de flask, que dura 1 hora

from flask import g
from flask_restful import Resource, reqparse
from werkzeug.security import check_password_hash, generate_password_hash


class Registro(Resource):

    def post(self):
        # Definir los argumentos esperados en la petición JSON
        parser = reqparse.RequestParser()
        parser.add_argument(
            "nombre", type=str, required=True, help="El nombre es requerido"
        )
        parser.add_argument(
            "usuario", type=str, required=True, help="El nombre de usuario es requerido"
        )
        parser.add_argument(
            "contrasena", type=str, required=True, help="La contraseña es requerida"
        )
        args = parser.parse_args()

        nombre = args.nombre
        usuario = args.usuario
        contrasena = args.contrasena
        hash_contrasena = generate_password_hash(contrasena)

        # Insertar el nuevo usuario en la base de datos
        with g.db.cursor() as cursor:

            try:
                cursor.execute(
                    """--sql
                        INSERT INTO public.usuarios (nombre, usuario, hash_contrasena) VALUES (%s, %s, %s)
                    """,
                    (nombre, usuario, hash_contrasena),
                )

                # Guardar cambios en la base de datos
                g.db.commit()

            # Si se presenta un error, significa que el usuario ya existe
            except:
                return {"error": "El usuario ya existe"}, 409

            # Informar al usuario que se ha registrado correctamente
            return {
                "info": f"Usuario {usuario} registrado correctamente",
            }
