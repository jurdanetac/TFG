from datetime import datetime as dt
from datetime import timedelta as td

import jwt
from flask import current_app, g, jsonify
from flask_restful import Resource, reqparse
from werkzeug.security import check_password_hash, generate_password_hash
from .queries import QueriesUsuarios as qu


class Login(Resource):
    def get(self):
        return {"info": "Autenticación de usuario", "status": 200}

    def post(self):
        """Manejador para la autenticación de usuarios, recibe un usuario y una contraseña
        y devuelve un token JWT que expira en una hora y lo almacena en
        la sesión de flask si las credenciales son correctas."""

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
                qu.SELECCIONAR_USUARIO,
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
            current_app.logger.info(f"Token generado para el usuario {usuario}")

            # Arreglar el formato de la fecha de creación
            # para evitar problemas de serialización al convertir a JSON
            usuario_db["creado_en"] = usuario_db["creado_en"].isoformat()

            # Esto es lo que se almacena en el token JWT
            payload = {
                "usuario": usuario_db,
                "exp": dt.utcnow() + td(hours=1),  # Expira en una hora
            }

            # Generar un token de sesión JWT con timeout de una hora
            token = jwt.encode(
                payload,
                key=current_app.config["SECRET_KEY"],
                algorithm="HS256",
            )

            print(f"Token generado: {token}")

            # Devolver el token JWT y el usuario autenticado
            return jsonify(
                {
                    "info": f"Usuario {usuario} autenticado correctamente",
                    "token": f"Bearer {token}",
                }
            )
