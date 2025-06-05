import os


class Config:
    # Configuración de la aplicación
    PORT = 5050
    SECRET_KEY = os.urandom(24)

    # Configuración de la base de datos
    HOST = "localhost"
    DB = "tfg"
    USUARIO = "soporte"

    # Configuración de rutas
    # Cambiar esto según sistema operativo y la ruta donde almacenar los documentos
    DB_URI = f"postgresql://{USUARIO}@{HOST}/{DB}"
    RUTA_DOCUMENTOS = f"/Users/soporte/Desktop/TFG/servidor/documentos"
