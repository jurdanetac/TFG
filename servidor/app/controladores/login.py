# login simple que verifica el usuario y la contraseña, permite registrar usuarios
# y utiliza bcrypt para encriptar las contraseñas, almacenando si el usuario esta
# autenticado o no en la sesion de flask, que dura 1 hora

from datetime import datetime as dt
from datetime import timedelta as td

import jwt
from flask import current_app, g, jsonify, request
from flask_restful import Resource, reqparse
from werkzeug.security import check_password_hash, generate_password_hash


class Login(Resource):
    def get(self):
        return {"message": "GET login."}

    def post(self):
        # Definir los argumentos esperados en la petición JSON
        parser = reqparse.RequestParser()
        parser.add_argument(
            "usuario", type=str, required=True, help="El nombre de usuario es requerido"
        )
        parser.add_argument(
            "contrasena", type=str, required=True, help="La contraseña es requerida"
        )
        args = parser.parse_args()

        usuario = args.usuario
        contrasena = args.contrasena
        hash_contrasena = generate_password_hash(contrasena)

        # Verificar si los datos son correctos
        with g.db.cursor() as cursor:
            cursor.execute(
                """--sql
                    SELECT * FROM public.usuarios WHERE usuario = %s
                """,
                (usuario,),
            )

            # Obtener el resultado de la consulta
            usuario_db = cursor.fetchone()

            # Verificar credenciales
            # Si no se encuentra el usuario o la contraseña no coincide, devolver un error
            if not usuario_db or not check_password_hash(
                usuario_db["hash_contrasena"], contrasena
            ):
                return {"error": "Usuario o Contraseña incorrecta"}, 401

            # Si la contraseña es correcta, se puede autenticar al usuario
            current_app.logger.info(f"Usuario {usuario} autenticado correctamente")

            # Arreglar el formato de la fecha de creación
            # para evitar problemas de serialización al convertir a JSON
            usuario_db["creado_en"] = usuario_db["creado_en"].isoformat()

            # Generar un token de sesión JWT con timeout de una hora
            token = jwt.encode(
                {
                    "usuario": usuario_db,
                    "exp": dt.utcnow() + td(hours=1),
                },
                current_app.config["SECRET_KEY"],
                algorithm="HS256",
            )

            return jsonify(
                jwt.decode(
                    token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
                )
            )

            return {
                "info": f"Usuario {usuario} autenticado correctamente",
                "usuario": usuario,
                "contrasena": hash_contrasena,
            }
