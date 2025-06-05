import os


class Config:
    # Configuración de la aplicación
    PORT = 5000
    SECRET_KEY = os.urandom(24)

    # Configuración de la base de datos
    HOST = "localhost"
    DB = "tfg"
    USUARIO = "postgres"
    CONTRASENA = "postgres"

    # Configuración de rutas
    # Cambiar esto según sistema operativo y la ruta donde almacenar los documentos
    USUARIO_WINDOWS = "W10"
    DB_URI = f"postgresql://{USUARIO}:{CONTRASENA}@{HOST}/{DB}"
    RUTA_DOCUMENTOS = (
        f"C:/Users/{USUARIO_WINDOWS}/Documents/GitHub/TFG/servidor/documentos"
    )