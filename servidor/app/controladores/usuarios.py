from flask_restful import Resource, reqparse
from werkzeug.security import generate_password_hash
from flask import g


class Usuarios(Resource):
    def get(self):
        return {"message": "GET usuarios."}

    def post(self):
        """Crea un nuevo usuario"""

        # Definir los argumentos esperados en la petición JSON
        parser = reqparse.RequestParser()
        parser.add_argument('nombre', type=str)
        parser.add_argument('usuario', type=str)
        parser.add_argument('contrasena', type=str)
        args = parser.parse_args()

        nombre = args.nombre
        usuario = args.usuario
        contrasena = args.contrasena
        hash_contrasena = generate_password_hash(contrasena)

        with g.db.cursor() as cursor:
            query = """--sql
            INSERT INTO public.usuarios (nombre, hash_contrasena, usuario)
            VALUES(%s, %s, %s);
            """

            try:
                # Insertar el nuevo usuario en la base de datos
                cursor.execute(query, (nombre, hash_contrasena, usuario))
                # Confirmar los cambios en la base de datos
                g.db.commit()
            except Exception as e:
                return {"error": "Usuario ya existe"}, 409

        return {"info": f"Usuario creado exitosamente",
                "nombre": nombre,
                "usuario": usuario,
                }

    def put(self):
        return {"message": "PUT usuarios."}

    def delete(self):
        return {"message": "DELETE usuarios."}
