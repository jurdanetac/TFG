class Config:
    PORT = 5000

    HOST = "localhost"
    DB = "tfg"
    USUARIO = "postgres"
    CONTRASENA = "postgres"

    DB_URI = f"postgresql://{USUARIO}:{CONTRASENA}@{HOST}/{DB}"

    RUTA_DOCUMENTOS = f"C:/Users/W10/Documents/GitHub/TFG/servidor/documentos"
